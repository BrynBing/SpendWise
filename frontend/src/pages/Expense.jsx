import React, { useEffect, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

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

const INITIAL_TRANSACTIONS = [
  {
    id: 1,
    amount: 48.75,
    currency: "USD",
    mode: "expense",
    category: "Groceries",
    description: "Weekly supermarket shop",
    date: "2024-05-09T09:15:00Z",
  },
  {
    id: 2,
    amount: 15.5,
    currency: "USD",
    mode: "expense",
    category: "Transport",
    description: "Rideshare to client meeting",
    date: "2024-05-08T17:45:00Z",
  },
  {
    id: 3,
    amount: 3200,
    currency: "USD",
    mode: "income",
    category: "Salary",
    description: "Monthly payroll",
    date: "2024-05-05T08:00:00Z",
  },
  {
    id: 4,
    amount: 89,
    currency: "USD",
    mode: "expense",
    category: "Utilities",
    description: "Internet and phone bill",
    date: "2024-05-04T12:20:00Z",
  },
  {
    id: 5,
    amount: 210,
    currency: "USD",
    mode: "income",
    category: "Freelance",
    description: "Website design consultation",
    date: "2024-05-02T19:10:00Z",
  },
];

const CURRENCY_OPTIONS = ["USD", "AUD", "EUR", "GBP"];

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

export default function Expense() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [form, setForm] = useState({
    amount: "",
    currency: "USD",
    mode: "expense",
    category: CATEGORY_OPTIONS.expense[0],
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [filter, setFilter] = useState("all");

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

  const handleSubmit = (event) => {
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

    const newTransaction = {
      id: Date.now(),
      amount: Number(numericAmount.toFixed(2)),
      currency: form.currency,
      mode: form.mode,
      category: form.category,
      description: form.description.trim(),
      date: new Date().toISOString(),
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setForm((prev) => ({
      ...prev,
      amount: "",
      description: "",
    }));
    setErrors({});
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-2 mb-10">
        <span className="text-sm uppercase tracking-[0.3em] text-gray-400">
          Add Transaction
        </span>
        <h1 className="text-3xl font-semibold text-gray-900">Transaction</h1>
        <p className="text-gray-500">
          Log your spending and income to keep an eye on your cash flow.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm px-6 sm:px-10 py-10 mb-10">
        <div className="flex items-center justify-between text-gray-400 text-sm uppercase tracking-[0.3em]">
          <span>Add Transaction</span>
        </div>

        <div className="max-w-xl mx-auto mt-10">
          <h2 className="text-center text-2xl font-semibold text-gray-900 mb-10">
            Transaction
          </h2>

          <form className="space-y-8" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="text-sm uppercase tracking-[0.3em] text-gray-400">
                Amount
              </label>
              <div className="mt-3 border-b border-gray-200 pb-5">
                <div className="flex items-end justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold text-gray-900">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={form.amount}
                      onChange={handleChange("amount")}
                      className="w-40 bg-transparent text-4xl font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={form.currency}
                      onChange={handleChange("currency")}
                      className="appearance-none bg-transparent text-sm font-medium tracking-[0.3em] uppercase text-gray-500 pr-6 focus:outline-none"
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
              <label className="text-sm uppercase tracking-[0.3em] text-gray-400">
                Select mode
              </label>
              <div className="relative mt-3 border-b border-gray-200">
                <select
                  value={form.mode}
                  onChange={handleChange("mode")}
                  className="w-full appearance-none bg-transparent py-3 text-lg font-medium text-gray-900 focus:outline-none"
                  aria-label="Select mode"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <FaChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="text-sm uppercase tracking-[0.3em] text-gray-400">
                Category
              </label>
              <div className="relative mt-3 border-b border-gray-200">
                <select
                  value={form.category}
                  onChange={handleChange("category")}
                  className="w-full appearance-none bg-transparent py-3 text-lg font-medium text-gray-900 focus:outline-none"
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
              <label className="text-sm uppercase tracking-[0.3em] text-gray-400">
                Descriptions
              </label>
              <div className="mt-3 border-b border-gray-200">
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={handleChange("description")}
                  placeholder="Enter description"
                  className="w-full resize-none bg-transparent py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              {errors.description && (
                <p className="mt-2 text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-gray-900 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-gray-700"
            >
              Save
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Total Expense</p>
          <p className="mt-3 text-2xl font-semibold text-rose-500">
            {formatCurrency(currencyTotals.expense, form.currency)}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Total Income</p>
          <p className="mt-3 text-2xl font-semibold text-emerald-500">
            {formatCurrency(currencyTotals.income, form.currency)}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Balance</p>
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
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
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
          <p className="text-sm text-gray-500">No transactions logged yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {visibleTransactions.map((transaction) => (
              <li
                key={transaction.id}
                className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                    {formatDate(transaction.date)}
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {transaction.category}
                  </p>
                  <p className="text-sm text-gray-500">{transaction.description}</p>
                </div>
                <div className="text-right text-base font-semibold">
                  <span
                    className={
                      transaction.mode === "expense"
                        ? "text-rose-500"
                        : "text-emerald-500"
                    }
                  >
                    {transaction.mode === "expense" ? "-" : "+"}
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
