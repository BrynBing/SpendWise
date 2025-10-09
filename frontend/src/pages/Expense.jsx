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
    "Other",
  ],
  income: ["Salary", "Freelance", "Investments", "Gift", "Refund", "Other"],
};

const CURRENCY_OPTIONS = ["USD", "AUD", "EUR", "GBP"];

// Backend only supports expenses, not income
const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "expense", label: "Expenses" },
  { value: "income", label: "Income" },
];

const formatCurrency = (value, currency) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const createEmptyFormState = () => ({
  amount: "",
  currency: "USD",
  mode: "expense",
  category: CATEGORY_OPTIONS.expense[0],
  description: "",
});

export default function Expense() {
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
          amount: record.amount,
          currency: record.currency,
          mode: record.transactionType || "expense", // Use transactionType from backend
          category: record.category.name,
          description: record.description || "",
          date: record.expenseDate,
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative")) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
  const netBalance = currencyTotals.income - currencyTotals.expense;

  const visibleTransactions = useMemo(() => {
    if (filter === "all") {
      return transactions;
    }

    return transactions.filter((transaction) => transaction.mode === filter);
  }, [transactions, filter]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    const numericAmount = parseFloat(form.amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      nextErrors.amount = "Enter an amount greater than 0.";
    }

    if (!form.category) {
      nextErrors.category = "Choose a category.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Add a brief description.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const recordData = {
      amount: Number(numericAmount.toFixed(2)),
      currency: form.currency,
      category: { categoryName: form.category },
      description: form.description.trim(),
      expenseDate: new Date().toISOString().split("T")[0],
      transactionType: form.mode, // "expense" or "income"
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
                  amount: response.data.amount,
                  currency: response.data.currency,
                  mode: response.data.transactionType || form.mode,
                  category: response.data.category.name,
                  description: response.data.description || "",
                  date: response.data.expenseDate,
                }
              : transaction
          )
        );
      } else {
        const response = await expenseService.createRecord(recordData);

        const newTransaction = {
          id: response.data.expenseId,
          amount: response.data.amount,
          currency: response.data.currency,
          mode: response.data.transactionType || form.mode,
          category: response.data.category.name,
          description: response.data.description || "",
          date: response.data.expenseDate,
        };

        setTransactions((prev) => [newTransaction, ...prev]);
      }

      setForm((prev) => ({
        ...prev,
        amount: "",
        description: "",
      }));
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
      amount: String(transaction.amount),
      currency: transaction.currency,
      mode: transaction.mode,
      category: transaction.category,
      description: transaction.description,
    });
    setErrors({});
    setEditingId(transaction.id);
    setIsModalOpen(true);
  };

  const cancelEditing = () => {
    setForm(createEmptyFormState());
    setErrors({});
    setEditingId(null);
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
      // You could add error handling UI here if needed
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-2 mb-10">
        <span className="text-sm uppercase tracking-[0.3em] text-gray-400">
          Overview
        </span>
        <h1 className="text-3xl font-semibold text-gray-900">Transactions</h1>
        <p className="text-gray-500">
          Log your spending and income to keep an eye on your cash flow.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-gray-400">Loading transactions...</div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3 mb-10">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                Total Expense
              </p>
              <p className="mt-3 text-2xl font-semibold text-rose-500">
                {formatCurrency(currencyTotals.expense, form.currency)}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                Total Income
              </p>
              <p className="mt-3 text-2xl font-semibold text-emerald-500">
                {formatCurrency(currencyTotals.income, form.currency)}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                Balance
              </p>
              <p
                className={`mt-3 text-2xl font-semibold ${
                  netBalance >= 0 ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {formatCurrency(netBalance, form.currency)}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-10">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                  Activity
                </p>
                <h2 className="mt-2 text-xl font-semibold text-gray-900">
                  Recent Transactions
                </h2>
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

            {visibleTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500 mb-2">
                  No transactions logged yet.
                </p>
                <p className="text-xs text-gray-400">
                  Start by adding your first transaction above
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {visibleTransactions.map((transaction) => (
                  <li
                    key={transaction.id}
                    className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between relative"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
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
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={cancelEditing}
        title={editingId ? "Update Transaction" : "Add Transaction"}
        size="lg"
      >
        <div className="max-w-xl mx-auto">
          {editingId && (
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500 text-center">
              Editing existing transaction
            </p>
          )}
          {!editingId && (
            <p className="mb-6 text-xs text-gray-500 text-center">
              Track your income and expenses to monitor your spending
            </p>
          )}

          <form className="space-y-8" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="text-sm uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                Amount
              </label>
              <div className="mt-3 border-b border-gray-200 dark:border-gray-700 pb-5">
                <div className="flex items-end justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold text-gray-900 dark:text-gray-100">
                      $
                    </span>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={form.amount}
                      onChange={handleChange("amount")}
                      className="w-40 bg-transparent text-4xl font-semibold text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={form.currency}
                      onChange={handleChange("currency")}
                      className="appearance-none bg-transparent text-sm font-medium tracking-[0.3em] uppercase text-gray-500 dark:text-gray-400 pr-6 focus:outline-none"
                      aria-label="Select currency"
                    >
                      {CURRENCY_OPTIONS.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
                  </div>
                </div>
                {errors.amount && (
                  <p className="mt-2 text-xs text-red-500">{errors.amount}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                Select mode
              </label>
              <div className="relative mt-3 border-b border-gray-200 dark:border-gray-700">
                <select
                  value={form.mode}
                  onChange={handleChange("mode")}
                  className="w-full appearance-none bg-transparent py-3 text-lg font-medium text-gray-900 dark:text-gray-100 focus:outline-none"
                  aria-label="Select mode"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <FaChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="text-sm uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                Category
              </label>
              <div className="relative mt-3 border-b border-gray-200 dark:border-gray-700">
                <select
                  value={form.category}
                  onChange={handleChange("category")}
                  className="w-full appearance-none bg-transparent py-3 text-lg font-medium text-gray-900 dark:text-gray-100 focus:outline-none"
                  aria-label="Select category"
                >
                  {CATEGORY_OPTIONS[form.mode].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.category && (
                <p className="mt-2 text-xs text-red-500">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="text-sm uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                Descriptions
              </label>
              <div className="mt-3 border-b border-gray-200 dark:border-gray-700">
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={handleChange("description")}
                  placeholder="Enter description"
                  className="w-full resize-none bg-transparent py-3 text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none"
                />
              </div>
              {errors.description && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            {errors.submit && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
                {errors.submit}
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
              {confirmDelete.transaction?.description}" from your history. You
              can’t undo this action.
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
