import React, { useState, useMemo, useEffect } from "react";
import {
  FaChevronDown,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { expenseRecordService } from "../services/api";

const LABEL_CLASSES = "block text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500";
const BORDER_SECTION_CLASSES = "relative mt-3 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus-within:border-gray-400 dark:focus-within:border-gray-500";
const INPUT_BASE_CLASSES = "block w-full rounded-2xl border-none bg-transparent px-4 py-3 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0";

const CATEGORY_OPTIONS = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Utilities",
];

const FREQUENCY_OPTIONS = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
];

function createEmptyFormState() {
  return {
    description: "",
    amount: "",
    currency: "USD",
    category: "Food",
    date: new Date().toISOString().split('T')[0],
    frequency: "MONTHLY",
  };
}

export default function Schedule() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categoryMap, setCategoryMap] = useState({
    Food: 1,
    Transport: 2,
    Entertainment: 3,
    Shopping: 4,
    Utilities: 5,
  });
  const [form, setForm] = useState(createEmptyFormState());
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, transaction: null });
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);

  // Fetch recurring expense records
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const data = await expenseRecordService.getAllRecords();
        
        console.log("📥 Raw data from API:", data);
        console.log("📥 Data type:", typeof data);
        console.log("📥 Is Array?:", Array.isArray(data));
        
        // Ensure data is an array
        const records = Array.isArray(data) ? data : [];
        
        // Filter only recurring records and transform to frontend format
        const recurringRecords = records
          .filter(record => record.isRecurring)
          .map(record => ({
            id: record.expenseId,
            description: record.description || `${record.category.name} expense`,
            amount: parseFloat(record.amount),
            currency: record.currency,
            category: record.category.name,
            date: record.expenseDate,
            isRecurring: record.isRecurring,
          }));
        
        console.log("📊 Recurring records found:", recurringRecords);
        setTransactions(recurringRecords);

        // Build category map from API
        const uniqueCategories = {};
        records.forEach(record => {
          if (record.category && record.category.name) {
            uniqueCategories[record.category.name] = record.category.id;
          }
        });
        console.log("🗂️ Category map built:", uniqueCategories);
        if (Object.keys(uniqueCategories).length > 0) {
          setCategoryMap(uniqueCategories);
        }
      } catch (err) {
        console.error("Failed to fetch recurring records:", err);
        // Keep using hardcoded categoryMap as fallback
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRecords();
    }
  }, [user]);

  const formatCurrency = (amount, currency = "USD") => {
    const symbol = { USD: "$", EUR: "€", GBP: "£", AUD: "A$" }[currency] || "$";
    return `${symbol}${Number(amount).toFixed(2)}`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const totalsByCurrency = useMemo(
    () =>
      transactions.reduce((acc, t) => {
        if (!acc[t.currency]) acc[t.currency] = { income: 0, expense: 0 };
        acc[t.currency].expense += t.amount;
        return acc;
      }, {}),
    [transactions]
  );

  const currencyTotals = totalsByCurrency[form.currency] ?? {
    income: 0,
    expense: 0,
  };
  const totalExpense = currencyTotals.expense;

  const validateForm = () => {
    const newErrors = {};

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    }

    const amount = Number(form.amount);
    if (!form.amount || amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!form.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const categoryId = categoryMap[form.category];
    if (!categoryId) {
      alert(`Category "${form.category}" not found in system`);
      return;
    }

    const transactionData = {
      category: {
        categoryId: categoryId
      },
      amount: Number(form.amount),
      currency: form.currency,
      expenseDate: form.date,
      description: form.description.trim(),
      isRecurring: true, // Always set to true for schedule logging
      paymentMethod: "Credit Card",
      notes: "",
    };

    try {
      if (editingId) {
        const updated = await expenseRecordService.updateRecord(editingId, transactionData, form.frequency);
        setTransactions(prev => prev.map(t => 
          t.id === editingId 
            ? {
                id: updated.expenseId,
                description: updated.description || `${updated.category.name} expense`,
                amount: parseFloat(updated.amount),
                currency: updated.currency,
                category: updated.category.name,
                date: updated.expenseDate,
                isRecurring: updated.isRecurring,
                frequency: form.frequency,
              }
            : t
        ));
        cancelEditing();
      } else {
        console.log("📤 Sending transaction data:", transactionData);
        console.log("📤 Frequency:", form.frequency);
        
        const created = await expenseRecordService.createRecord(transactionData, form.frequency);
        
        console.log("✅ Created record response:", created);
        console.log("✅ Created record type:", typeof created);
        console.log("✅ Created category:", created?.category);
        
        const newTransaction = {
          id: created.expenseId,
          description: created.description || `${created?.category?.name || 'Unknown'} expense`,
          amount: parseFloat(created.amount),
          currency: created.currency,
          category: created?.category?.name || 'Unknown',
          date: created.expenseDate,
          isRecurring: created.isRecurring,
          frequency: form.frequency,
        };
        console.log("📝 New transaction object:", newTransaction);
        
        setTransactions(prev => [newTransaction, ...prev]);
        setForm(createEmptyFormState());
        setModalOpen(false);
      }

      setErrors({});
    } catch (err) {
      console.error("Failed to save recurring transaction:", err);
      console.error("Error details:", err.response?.data || err.message);
      alert("Failed to save recurring transaction. Please try again.");
    }
  };

  const startEditing = (transaction) => {
    setForm({
      description: transaction.description,
      amount: String(transaction.amount),
      currency: transaction.currency,
      category: transaction.category,
      date: transaction.date,
      frequency: transaction.frequency || "MONTHLY",
    });
    setEditingId(transaction.id);
    setModalOpen(true);
  };

  const cancelEditing = () => {
    setForm(createEmptyFormState());
    setEditingId(null);
    setErrors({});
    setModalOpen(false);
  };

  const openDeleteConfirm = (transaction) => {
    setConfirmDelete({ show: true, transaction });
    setDropdownOpen(null);
  };

  const closeDeleteConfirm = () => {
    setConfirmDelete({ show: false, transaction: null });
  };

  const toggleDropdown = (transactionId) => {
    setDropdownOpen(dropdownOpen === transactionId ? null : transactionId);
  };

  const handleEdit = (transaction) => {
    startEditing(transaction);
    setDropdownOpen(null);
  };

  const confirmDeleteTransaction = async () => {
    try {
      await expenseRecordService.deleteRecord(confirmDelete.transaction.id);
      setTransactions(prev => prev.filter(t => t.id !== confirmDelete.transaction.id));
      closeDeleteConfirm();
    } catch (err) {
      console.error("Failed to delete recurring transaction:", err);
      alert("Failed to delete recurring transaction. Please try again.");
    }
  };

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const openModal = () => {
    setForm(createEmptyFormState());
    setEditingId(null);
    setErrors({});
    setModalOpen(true);
  };

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex flex-col gap-2">
          <span className="text-sm uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Overview</span>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Schedule Logging</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-sm p-6">
          <p className="text-gray-500 dark:text-gray-400">Loading recurring transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-2 mb-10">
        <span className="text-sm uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Overview</span>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Schedule Logging</h1>
          <button
            onClick={openModal}
            className="flex items-center gap-2 rounded-full bg-gray-900 dark:bg-gray-700 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-gray-700 dark:hover:bg-gray-600"
          >
            <FaPlus /> Add Recurring
          </button>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Track and manage your recurring transactions and scheduled payments.
        </p>
      </div>

      {/* Balance Overview */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-sm p-6 mb-10 transition-colors duration-200">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Total Recurring Expenses</p>
        <p className="mt-3 text-3xl font-semibold text-gray-900 dark:text-white">
          {formatCurrency(totalExpense)}
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {transactions.length} recurring {transactions.length === 1 ? 'transaction' : 'transactions'}
        </p>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-sm p-6 sm:p-10 transition-colors duration-200">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Recurring Transactions</p>
        </div>

        {sortedTransactions.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No recurring transactions logged yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {sortedTransactions.map((transaction) => (
              <li
                key={transaction.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between relative"
              >
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{transaction.description}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                    {formatDate(transaction.date)} • {transaction.category}
                    {transaction.frequency && (
                      <span className="ml-2 text-emerald-600 dark:text-emerald-400">• {transaction.frequency}</span>
                    )}
                    {transaction.isRecurring && (
                      <span className="ml-2 text-emerald-600 dark:text-emerald-400">• Recurring</span>
                    )}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center sm:gap-6">
                  <button
                    onClick={() => toggleDropdown(transaction.id)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-base font-semibold text-rose-500 dark:text-rose-400">
                      -{formatCurrency(transaction.amount, transaction.currency)}
                    </span>
                    <FaChevronDown className="text-gray-400 dark:text-gray-500 text-sm" />
                  </button>
                  
                  {dropdownOpen === transaction.id && (
                    <div className="absolute right-0 top-full mt-2 z-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-lg min-w-[120px]">
                      <button
                        type="button"
                        onClick={() => handleEdit(transaction)}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t-2xl"
                      >
                        <FaEdit className="text-gray-500 dark:text-gray-400" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteConfirm(transaction)}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 last:rounded-b-2xl border-t border-gray-100 dark:border-gray-600"
                      >
                        <FaTrash className="text-rose-500" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-10 shadow-xl transition-colors duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {editingId ? "Update Recurring Transaction" : "Add Recurring Transaction"}
              </h2>
              <button
                onClick={cancelEditing}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label className={LABEL_CLASSES}>Description</label>
                <div className={BORDER_SECTION_CLASSES}>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    className={INPUT_BASE_CLASSES}
                    placeholder="e.g., Monthly rent payment"
                  />
                </div>
                {errors.description && (
                  <p className="mt-2 text-xs text-red-500">{errors.description}</p>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className={LABEL_CLASSES}>Amount</label>
                  <div className={BORDER_SECTION_CLASSES}>
                    <input
                      type="number"
                      value={form.amount}
                      onChange={(e) => handleFormChange("amount", e.target.value)}
                      className={`${INPUT_BASE_CLASSES} appearance-none`}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-2 text-xs text-red-500">{errors.amount}</p>
                  )}
                </div>

                <div>
                  <label className={LABEL_CLASSES}>Currency</label>
                  <div className={`${BORDER_SECTION_CLASSES} relative`}>
                    <select
                      value={form.currency}
                      onChange={(e) => handleFormChange("currency", e.target.value)}
                      className={`${INPUT_BASE_CLASSES} appearance-none pr-10`}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="AUD">AUD</option>
                    </select>
                    <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className={LABEL_CLASSES}>Category</label>
                  <div className={`${BORDER_SECTION_CLASSES} relative`}>
                    <select
                      value={form.category}
                      onChange={(e) => handleFormChange("category", e.target.value)}
                      className={`${INPUT_BASE_CLASSES} appearance-none pr-10`}
                    >
                      {CATEGORY_OPTIONS.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className={LABEL_CLASSES}>Date</label>
                  <div className={BORDER_SECTION_CLASSES}>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => handleFormChange("date", e.target.value)}
                      className={INPUT_BASE_CLASSES}
                    />
                  </div>
                  {errors.date && (
                    <p className="mt-2 text-xs text-red-500">{errors.date}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={LABEL_CLASSES}>Frequency</label>
                <div className={`${BORDER_SECTION_CLASSES} relative`}>
                  <select
                    value={form.frequency}
                    onChange={(e) => handleFormChange("frequency", e.target.value)}
                    className={`${INPUT_BASE_CLASSES} appearance-none pr-10`}
                  >
                    {FREQUENCY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end pt-4">
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="w-full rounded-full border border-gray-200 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-gray-600 transition-colors hover:bg-gray-100 sm:w-auto sm:min-w-[140px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-gray-700 sm:w-auto sm:min-w-[140px]"
                >
                  {editingId ? "Save Changes" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 text-rose-500">
              <FaExclamationTriangle />
              <p className="text-xs font-semibold uppercase tracking-[0.3em]">Delete Transaction</p>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Are you sure?</h3>
            <p className="mt-2 text-sm text-gray-500">
              This will permanently remove "{confirmDelete.transaction?.description}" from
              your recurring transactions. You can't undo this action.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                className="w-full rounded-full border border-gray-200 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-gray-600 transition-colors hover:bg-gray-100 sm:w-auto sm:min-w-[120px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTransaction}
                className="w-full rounded-full bg-rose-500 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-rose-600 sm:w-auto sm:min-w-[120px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
