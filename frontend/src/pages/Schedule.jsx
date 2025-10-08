import React, { useEffect, useMemo, useState } from "react";
import {
  FaChevronDown,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaPlus,
} from "react-icons/fa";
import Modal from "../components/Modal";
import { expenseService } from "../services/api";

const INITIAL_TRANSACTIONS = [
  {
    id: 1,
    description: "Gas",
    amount: 200,
    currency: "USD",
    mode: "expense",
    category: "Transport",
    date: "2024-09-15T10:00:00Z",
    isRecurring: false,
  },
  {
    id: 2,
    description: "Rent",
    amount: 50,
    currency: "USD",
    mode: "expense",
    category: "Housing",
    date: "2024-09-14T09:00:00Z",
    isRecurring: true,
  },
  {
    id: 3,
    description: "Pay Check",
    amount: 500,
    currency: "USD",
    mode: "income",
    category: "Salary",
    date: "2024-09-13T08:00:00Z",
    isRecurring: false,
  },
  {
    id: 4,
    description: "Grocery",
    amount: 200,
    currency: "USD",
    mode: "expense",
    category: "Groceries",
    date: "2024-09-12T16:30:00Z",
    isRecurring: false,
  },
  {
    id: 5,
    description: "Bank Transfer",
    amount: 300,
    currency: "USD",
    mode: "income",
    category: "Transfer",
    date: "2024-09-11T14:15:00Z",
    isRecurring: false,
  },
  {
    id: 6,
    description: "Money Transfer",
    amount: 80,
    currency: "USD",
    mode: "expense",
    category: "Transfer",
    date: "2024-09-10T11:45:00Z",
    isRecurring: false,
  },
];

const CATEGORY_OPTIONS = {
  expense: [
    "Groceries",
    "Transport",
    "Housing",
    "Utilities",
    "Entertainment",
    "Healthcare",
    "Dining Out",
    "Shopping",
    "Transfer",
    "Other",
  ],
  income: [
    "Salary",
    "Freelance",
    "Investments",
    "Transfer",
    "Gift",
    "Refund",
    "Other",
  ],
};

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "recurring", label: "Recurring" },
  { value: "one-time", label: "One-time" },
];

const formatCurrency = (value, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const RECURRENCE_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

const createEmptyFormState = () => ({
  description: "",
  amount: "",
  currency: "USD",
  mode: "expense",
  category: CATEGORY_OPTIONS.expense[0],
  date: new Date().toISOString().split("T")[0],
  isRecurring: false,
  recurrenceFrequency: "monthly",
});

const LABEL_CLASSES = "text-sm uppercase tracking-[0.3em] text-gray-400";
const INPUT_BASE_CLASSES =
  "w-full bg-transparent py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none";
const BORDER_SECTION_CLASSES = "mt-3 border-b border-gray-200";

export default function Schedule() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(() => createEmptyFormState());
  const [errors, setErrors] = useState({});
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    transaction: null,
  });
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { mode } = form;

  // Fetch transactions from backend on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await expenseService.getRecords();

        // Transform backend data to frontend format
        const formattedTransactions = response.data.map((record) => ({
          id: record.expenseId,
          description: record.description || "",
          amount: record.amount,
          currency: record.currency,
          mode: record.transactionType || "expense",
          category: record.category.name,
          date: record.expenseDate,
          isRecurring: record.isRecurring || false,
          recurrenceFrequency: record.recurrenceFrequency || "monthly",
        }));

        setTransactions(formattedTransactions);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setError("Failed to load transactions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const availableCategories = CATEGORY_OPTIONS[mode] ?? [];
    setForm((prev) => {
      const nextCategory = availableCategories.includes(prev.category)
        ? prev.category
        : availableCategories[0] || "";

      if (nextCategory === prev.category) {
        return prev;
      }

      return { ...prev, category: nextCategory };
    });
  }, [mode]);

  const totalsByCurrency = useMemo(
    () =>
      transactions.reduce((acc, item) => {
        const currencyKey = item.currency || "USD";
        if (!acc[currencyKey]) {
          acc[currencyKey] = { income: 0, expense: 0 };
        }

        const numericAmount = Number(item.amount) || 0;
        if (item.mode === "income") {
          acc[currencyKey].income += numericAmount;
        } else {
          acc[currencyKey].expense += numericAmount;
        }

        return acc;
      }, {}),
    [transactions]
  );

  const currencyTotals = totalsByCurrency[form.currency] ?? {
    income: 0,
    expense: 0,
  };
  const totalBalance = currencyTotals.income - currencyTotals.expense;

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

    const numericAmount = parseFloat(form.amount);

    const recordData = {
      amount: Number(numericAmount.toFixed(2)),
      currency: form.currency,
      category: { categoryName: form.category },
      description: form.description.trim(),
      expenseDate: form.date,
      transactionType: form.mode,
      isRecurring: form.isRecurring,
      recurrenceFrequency: form.isRecurring ? form.recurrenceFrequency : null,
    };

    try {
      if (editingId) {
        const response = await expenseService.updateRecord(
          editingId,
          recordData
        );

        setTransactions((prev) =>
          prev.map((transaction) =>
            transaction.id === editingId
              ? {
                  id: response.data.expenseId,
                  description: response.data.description || "",
                  amount: response.data.amount,
                  currency: response.data.currency,
                  mode: response.data.transactionType || form.mode,
                  category: response.data.category.name,
                  date: response.data.expenseDate,
                  isRecurring: response.data.isRecurring || false,
                  recurrenceFrequency:
                    response.data.recurrenceFrequency || "monthly",
                }
              : transaction
          )
        );
      } else {
        const response = await expenseService.createRecord(recordData);

        const newTransaction = {
          id: response.data.expenseId,
          description: response.data.description || "",
          amount: response.data.amount,
          currency: response.data.currency,
          mode: response.data.transactionType || form.mode,
          category: response.data.category.name,
          date: response.data.expenseDate,
          isRecurring: response.data.isRecurring || false,
          recurrenceFrequency: response.data.recurrenceFrequency || "monthly",
        };

        setTransactions((prev) => [newTransaction, ...prev]);
      }

      setForm(createEmptyFormState());
      setErrors({});
      setEditingId(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save transaction:", err);
      console.error("Error response:", err.response?.data);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to save transaction. Please try again.";
      setErrors({ submit: errorMessage });
    }
  };

  const startEditing = (transaction) => {
    setForm({
      description: transaction.description,
      amount: String(transaction.amount),
      currency: transaction.currency,
      mode: transaction.mode,
      category: transaction.category,
      date: new Date(transaction.date).toISOString().split("T")[0],
      isRecurring: transaction.isRecurring,
      recurrenceFrequency: transaction.recurrenceFrequency || "monthly",
    });
    setEditingId(transaction.id);
    setIsModalOpen(true);
  };

  const cancelEditing = () => {
    setForm(createEmptyFormState());
    setEditingId(null);
    setErrors({});
    setIsModalOpen(false);
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
    if (!confirmDelete.transaction) {
      return;
    }

    try {
      await expenseService.deleteRecord(confirmDelete.transaction.id);

      setTransactions((prev) =>
        prev.filter(
          (transaction) => transaction.id !== confirmDelete.transaction.id
        )
      );

      if (editingId === confirmDelete.transaction.id) {
        cancelEditing();
      }

      closeDeleteConfirm();
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      setErrors({ submit: "Failed to delete transaction. Please try again." });
    }
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Filter transactions based on recurring status
  const filteredTransactions = useMemo(() => {
    if (filter === "all") {
      return sortedTransactions;
    }
    if (filter === "recurring") {
      return sortedTransactions.filter((t) => t.isRecurring);
    }
    if (filter === "one-time") {
      return sortedTransactions.filter((t) => !t.isRecurring);
    }
    return sortedTransactions;
  }, [sortedTransactions, filter]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-sm uppercase tracking-[0.3em] text-gray-400">
          Overview
        </span>
        <h1 className="text-3xl font-semibold text-gray-900">
          Schedule Logging
        </h1>
        <p className="text-gray-500">
          Track and manage your scheduled transactions and recurring payments.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500">Loading transactions...</p>
        </div>
      ) : (
        <>
          {/* Balance Overview */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
              Total Balance
            </p>
            <p className="mt-3 text-3xl font-semibold text-gray-900">
              {formatCurrency(totalBalance)}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-sm text-emerald-500">↑ Income</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(currencyTotals.income)}
                </p>
              </div>
              <div>
                <p className="text-sm text-rose-500">↓ Expense</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(currencyTotals.expense)}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-10">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                  Activity
                </p>
                <h2 className="mt-2 text-xl font-semibold text-gray-900">
                  Scheduled Transactions
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {filteredTransactions.filter((t) => t.isRecurring).length}{" "}
                  recurring •{" "}
                  {filteredTransactions.filter((t) => !t.isRecurring).length}{" "}
                  one-time
                </p>
              </div>
              <div className="flex gap-2">
                {FILTER_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilter(value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      filter === value
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500 mb-2">
                  {filter === "recurring"
                    ? "No recurring transactions yet."
                    : filter === "one-time"
                    ? "No one-time transactions yet."
                    : "No transactions logged yet."}
                </p>
                <p className="text-xs text-gray-400">
                  Add your first scheduled transaction above
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {filteredTransactions.map((transaction) => (
                  <li
                    key={transaction.id}
                    className={`flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between relative ${
                      transaction.isRecurring
                        ? "bg-indigo-50/30 -mx-6 px-6 sm:-mx-10 sm:px-10 rounded-2xl"
                        : ""
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {transaction.isRecurring && (
                          <span className="text-xs font-semibold uppercase tracking-[0.3em] px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                            Recurring
                          </span>
                        )}
                        <span
                          className={`text-xs font-semibold uppercase tracking-[0.3em] px-2 py-1 rounded-full ${
                            transaction.mode === "expense"
                              ? "bg-rose-50 text-rose-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {transaction.mode}
                        </span>
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                          {formatDate(transaction.date)}
                          {transaction.isRecurring && (
                            <span className="ml-2 text-indigo-600">
                              •{" "}
                              {RECURRENCE_OPTIONS.find(
                                (opt) =>
                                  opt.value === transaction.recurrenceFrequency
                              )?.label || "Monthly"}
                            </span>
                          )}
                        </p>
                      </div>
                      <p className="text-base font-semibold text-gray-900">
                        {transaction.category}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center sm:gap-6">
                      <button
                        onClick={() => toggleDropdown(transaction.id)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span
                          className={`text-base font-semibold ${
                            transaction.mode === "expense"
                              ? "text-rose-500"
                              : "text-emerald-500"
                          }`}
                        >
                          {transaction.mode === "expense" ? "-" : "+"}
                          {formatCurrency(
                            transaction.amount,
                            transaction.currency
                          )}
                        </span>
                        <FaChevronDown className="text-gray-400 text-sm" />
                      </button>

                      {dropdownOpen === transaction.id && (
                        <div className="absolute right-0 top-full mt-2 z-10 bg-white border border-gray-200 rounded-2xl shadow-lg min-w-[120px]">
                          <button
                            type="button"
                            onClick={() => handleEdit(transaction)}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-2xl"
                          >
                            <FaEdit className="text-gray-500" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteConfirm(transaction)}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 last:rounded-b-2xl border-t border-gray-100"
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

          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-indigo-600 dark:bg-indigo-500 px-8 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-indigo-700 dark:hover:bg-indigo-600"
            >
              <FaPlus /> Add Transaction
            </button>
          </div>

          <Modal
            isOpen={isModalOpen}
            onClose={cancelEditing}
            title={
              editingId
                ? "Update Scheduled Transaction"
                : "Add Scheduled Transaction"
            }
            size="lg"
          >
            <div className="max-w-xl mx-auto">
              {editingId && (
                <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500 text-center">
                  Editing existing schedule
                </p>
              )}
              {!editingId && (
                <p className="mb-6 text-xs text-gray-500 text-center">
                  Set up recurring or one-time scheduled transactions
                </p>
              )}

              <form className="space-y-8" onSubmit={handleSubmit} noValidate>
                <div>
                  <label className={`${LABEL_CLASSES} dark:text-gray-500`}>
                    Description
                  </label>
                  <div
                    className={`${BORDER_SECTION_CLASSES} dark:border-gray-700`}
                  >
                    <input
                      type="text"
                      value={form.description}
                      onChange={(e) =>
                        handleFormChange("description", e.target.value)
                      }
                      className={`${INPUT_BASE_CLASSES} dark:text-gray-100 dark:placeholder:text-gray-600`}
                      placeholder="e.g., Rent payment"
                    />
                  </div>
                  {errors.description && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className={`${LABEL_CLASSES} dark:text-gray-500`}>
                      Amount
                    </label>
                    <div
                      className={`${BORDER_SECTION_CLASSES} dark:border-gray-700`}
                    >
                      <input
                        type="number"
                        value={form.amount}
                        onChange={(e) =>
                          handleFormChange("amount", e.target.value)
                        }
                        className={`${INPUT_BASE_CLASSES} appearance-none dark:text-gray-100 dark:placeholder:text-gray-600`}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {errors.amount && (
                      <p className="mt-2 text-xs text-red-500">
                        {errors.amount}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={`${LABEL_CLASSES} dark:text-gray-500`}>
                      Currency
                    </label>
                    <div
                      className={`${BORDER_SECTION_CLASSES} relative dark:border-gray-700`}
                    >
                      <select
                        value={form.currency}
                        onChange={(e) =>
                          handleFormChange("currency", e.target.value)
                        }
                        className={`${INPUT_BASE_CLASSES} appearance-none pr-10 dark:text-gray-100`}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="AUD">AUD</option>
                      </select>
                      <FaChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className={`${LABEL_CLASSES} dark:text-gray-500`}>
                      Mode
                    </label>
                    <div
                      className={`${BORDER_SECTION_CLASSES} relative dark:border-gray-700`}
                    >
                      <select
                        value={form.mode}
                        onChange={(e) =>
                          handleFormChange("mode", e.target.value)
                        }
                        className={`${INPUT_BASE_CLASSES} appearance-none pr-10 dark:text-gray-100`}
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                      <FaChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className={`${LABEL_CLASSES} dark:text-gray-500`}>
                      Category
                    </label>
                    <div
                      className={`${BORDER_SECTION_CLASSES} relative dark:border-gray-700`}
                    >
                      <select
                        value={form.category}
                        onChange={(e) =>
                          handleFormChange("category", e.target.value)
                        }
                        className={`${INPUT_BASE_CLASSES} appearance-none pr-10 dark:text-gray-100`}
                      >
                        {(CATEGORY_OPTIONS[mode] || []).map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className={`${LABEL_CLASSES} dark:text-gray-500`}>
                      Date
                    </label>
                    <div
                      className={`${BORDER_SECTION_CLASSES} dark:border-gray-700`}
                    >
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) =>
                          handleFormChange("date", e.target.value)
                        }
                        className={`${INPUT_BASE_CLASSES} dark:text-gray-100`}
                      />
                    </div>
                    {errors.date && (
                      <p className="mt-2 text-xs text-red-500">{errors.date}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={form.isRecurring}
                        onChange={(e) =>
                          handleFormChange("isRecurring", e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                      />
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Recurring Transaction
                      </span>
                    </label>
                  </div>
                </div>

                {form.isRecurring && (
                  <div>
                    <label className={`${LABEL_CLASSES} dark:text-gray-500`}>
                      Recurrence Frequency
                    </label>
                    <div
                      className={`${BORDER_SECTION_CLASSES} dark:border-gray-700`}
                    >
                      <select
                        value={form.recurrenceFrequency}
                        onChange={(e) =>
                          handleFormChange(
                            "recurrenceFrequency",
                            e.target.value
                          )
                        }
                        className={`${INPUT_BASE_CLASSES} dark:text-gray-100 cursor-pointer`}
                      >
                        {RECURRENCE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {errors.submit && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {editingId && (
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="w-full rounded-full border border-gray-200 dark:border-gray-700 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 sm:w-auto sm:min-w-[140px]"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="w-full rounded-full bg-indigo-600 dark:bg-indigo-500 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-indigo-700 dark:hover:bg-indigo-600 sm:w-auto sm:min-w-[140px]"
                  >
                    {editingId ? "Save Changes" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </Modal>

          {/* Delete Confirmation Modal */}
          {confirmDelete.show && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">
                <div className="flex items-center gap-3 text-rose-500">
                  <FaExclamationTriangle />
                  <p className="text-xs font-semibold uppercase tracking-[0.3em]">
                    Delete Transaction
                  </p>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  Are you sure?
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  This will permanently remove "
                  {confirmDelete.transaction?.description}" from your
                  transaction history. You can't undo this action.
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
        </>
      )}
    </div>
  );
}
