import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronDown, FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";

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
  income: ["Salary", "Freelance", "Investments", "Transfer", "Gift", "Refund", "Other"],
};

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

const createEmptyFormState = () => ({
  description: "",
  amount: "",
  currency: "USD",
  mode: "expense",
  category: CATEGORY_OPTIONS.expense[0],
  date: new Date().toISOString().split('T')[0],
  isRecurring: false,
});

const LABEL_CLASSES = "text-sm uppercase tracking-[0.3em] text-gray-400";
const INPUT_BASE_CLASSES = "w-full bg-transparent py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none";
const BORDER_SECTION_CLASSES = "mt-3 border-b border-gray-200";

export default function Schedule() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [form, setForm] = useState(() => createEmptyFormState());
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, transaction: null });
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const formRef = useRef(null);

  const { mode } = form;

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const transactionData = {
      description: form.description.trim(),
      amount: Number(form.amount),
      currency: form.currency,
      mode: form.mode,
      category: form.category,
      date: new Date(form.date).toISOString(),
      isRecurring: form.isRecurring,
    };

    if (editingId) {
      setTransactions(prev => prev.map(transaction => 
        transaction.id === editingId ? { ...transaction, ...transactionData } : transaction
      ));
      cancelEditing();
    } else {
      const newTransaction = {
        ...transactionData,
        id: Date.now(),
      };
      setTransactions(prev => [newTransaction, ...prev]);
      setForm(createEmptyFormState());
    }

    setErrors({});
  };

  const startEditing = (transaction) => {
    setForm({
      description: transaction.description,
      amount: String(transaction.amount),
      currency: transaction.currency,
      mode: transaction.mode,
      category: transaction.category,
      date: new Date(transaction.date).toISOString().split('T')[0],
      isRecurring: transaction.isRecurring,
    });
    setEditingId(transaction.id);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cancelEditing = () => {
    setForm(createEmptyFormState());
    setEditingId(null);
    setErrors({});
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

  const confirmDeleteTransaction = () => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== confirmDelete.transaction.id));
    closeDeleteConfirm();
  };

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-sm uppercase tracking-[0.3em] text-gray-400">Overview</span>
        <h1 className="text-3xl font-semibold text-gray-900">Schedule Logging</h1>
        <p className="text-gray-500">
          Track and manage your scheduled transactions and recurring payments.
        </p>
      </div>

      

      {/* Balance Overview */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Total Balance</p>
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
            <p className="text-sm text-rose-500">↑ Expense</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(currencyTotals.expense)}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-10">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Recent Transactions</p>
        </div>

        {sortedTransactions.length === 0 ? (
          <p className="text-sm text-gray-500">No transactions logged yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {sortedTransactions.map((transaction) => (
              <li
                key={transaction.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between relative"
              >
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900">{transaction.description}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                    {formatDate(transaction.date)} • {transaction.category}
                    {transaction.isRecurring && (
                      <span className="ml-2 text-emerald-600">• Recurring</span>
                    )}
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
                      {formatCurrency(transaction.amount, transaction.currency)}
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

      <div
        ref={formRef}
        className="bg-white border border-gray-100 rounded-3xl shadow-sm px-6 sm:px-10 py-10 mt-10"
      >
        <div className="flex items-center justify-between text-gray-400 text-sm uppercase tracking-[0.3em]">
          <span>{editingId ? "Update Transaction" : "Add Transaction"}</span>
        </div>

        <div className="max-w-xl mx-auto mt-10">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Transaction</h2>
            {editingId && (
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                Editing existing entry
              </p>
            )}
          </div>

          <form className="space-y-8" onSubmit={handleSubmit} noValidate>
            <div>
              <label className={LABEL_CLASSES}>Description</label>
              <div className={BORDER_SECTION_CLASSES}>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  className={INPUT_BASE_CLASSES}
                  placeholder="e.g., Rent payment"
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
                  <FaChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={LABEL_CLASSES}>Mode</label>
                <div className={`${BORDER_SECTION_CLASSES} relative`}>
                  <select
                    value={form.mode}
                    onChange={(e) => handleFormChange("mode", e.target.value)}
                    className={`${INPUT_BASE_CLASSES} appearance-none pr-10`}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                  <FaChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className={LABEL_CLASSES}>Category</label>
                <div className={`${BORDER_SECTION_CLASSES} relative`}>
                  <select
                    value={form.category}
                    onChange={(e) => handleFormChange("category", e.target.value)}
                    className={`${INPUT_BASE_CLASSES} appearance-none pr-10`}
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

              <div className="flex items-center">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.isRecurring}
                    onChange={(e) => handleFormChange("isRecurring", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                  />
                  <span className="text-sm font-semibold text-gray-900">Recurring Transaction</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="w-full rounded-full border border-gray-200 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-gray-600 transition-colors hover:bg-gray-100 sm:w-auto sm:min-w-[140px]"
                >
                  Cancel
                </button>
              )}
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
              your transaction history. You can't undo this action.
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
