import React, { useRef, useState } from "react";
import { FaChevronDown, FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";

const INITIAL_GOALS = [
  {
    id: 1,
    name: "Phone",
    targetAmount: 1500,
    currentAmount: 450,
    category: "Electronics",
    deadline: "2024-12-01",
  },
  {
    id: 2,
    name: "Fitness watch",
    targetAmount: 500,
    currentAmount: 200,
    category: "Health",
    deadline: "2024-10-15",
  },
  {
    id: 3,
    name: "Laptop",
    targetAmount: 2000,
    currentAmount: 800,
    category: "Electronics",
    deadline: "2024-11-30",
  },
  {
    id: 4,
    name: "Emergency fund",
    targetAmount: 2000,
    currentAmount: 1200,
    category: "Savings",
    deadline: "2025-06-01",
  },
  {
    id: 5,
    name: "University Tuition",
    targetAmount: 3000,
    currentAmount: 900,
    category: "Education",
    deadline: "2024-12-31",
  },
  {
    id: 6,
    name: "Monthly savings",
    targetAmount: 2000,
    currentAmount: 1234.60,
    category: "Savings",
    deadline: "2024-09-30",
  },
];

const formatCurrency = (value, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);

const createEmptyFormState = () => ({
  name: "",
  targetAmount: "",
  currentAmount: "",
  category: "Savings",
  deadline: "",
});

const LABEL_CLASSES = "text-sm uppercase tracking-[0.3em] text-gray-400";
const INPUT_BASE_CLASSES = "w-full bg-transparent py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none";
const BORDER_SECTION_CLASSES = "mt-3 border-b border-gray-200";

export default function Goals() {
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [form, setForm] = useState(() => createEmptyFormState());
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, goal: null });
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const formRef = useRef(null);

  // Calculate current and target savings
  const currentSaving = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const targetSaving = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const savingsProgress = targetSaving > 0 ? (currentSaving / targetSaving) * 100 : 0;

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Goal name is required";
    }

    const targetAmount = Number(form.targetAmount);
    if (!form.targetAmount || targetAmount <= 0) {
      newErrors.targetAmount = "Target amount must be greater than 0";
    }

    const currentAmount = Number(form.currentAmount);
    if (form.currentAmount && (currentAmount < 0 || currentAmount > targetAmount)) {
      newErrors.currentAmount = "Current amount must be between 0 and target amount";
    }

    if (!form.deadline) {
      newErrors.deadline = "Deadline is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const goalData = {
      name: form.name.trim(),
      targetAmount: Number(form.targetAmount),
      currentAmount: Number(form.currentAmount) || 0,
      category: form.category,
      deadline: form.deadline,
    };

    if (editingId) {
      setGoals(prev => prev.map(goal => 
        goal.id === editingId ? { ...goal, ...goalData } : goal
      ));
      cancelEditing();
    } else {
      const newGoal = {
        ...goalData,
        id: Date.now(),
      };
      setGoals(prev => [newGoal, ...prev]);
      setForm(createEmptyFormState());
    }

    setErrors({});
  };

  const startEditing = (goal) => {
    setForm({
      name: goal.name,
      targetAmount: String(goal.targetAmount),
      currentAmount: String(goal.currentAmount),
      category: goal.category,
      deadline: goal.deadline,
    });
    setEditingId(goal.id);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cancelEditing = () => {
    setForm(createEmptyFormState());
    setEditingId(null);
    setErrors({});
  };

  const openDeleteConfirm = (goal) => {
    setConfirmDelete({ show: true, goal });
    setDropdownOpen(null);
  };

  const closeDeleteConfirm = () => {
    setConfirmDelete({ show: false, goal: null });
  };

  const toggleDropdown = (goalId) => {
    setDropdownOpen(dropdownOpen === goalId ? null : goalId);
  };

  const handleEdit = (goal) => {
    startEditing(goal);
    setDropdownOpen(null);
  };

  const confirmDeleteGoal = () => {
    setGoals(prev => prev.filter(goal => goal.id !== confirmDelete.goal.id));
    closeDeleteConfirm();
  };

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const getProgressPercentage = (current, target) => {
    return target > 0 ? Math.min((current / target) * 100, 100) : 0;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-sm uppercase tracking-[0.3em] text-gray-400">Overview</span>
        <h1 className="text-3xl font-semibold text-gray-900">Spending Goals</h1>
        <p className="text-gray-500">
          Set and track your savings goals to achieve your financial targets.
        </p>
      </div>

      {/* Savings Overview */}
      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-colors duration-200">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 transition-colors duration-200">Current Saving</p>
          <p className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">
            {formatCurrency(currentSaving)}
          </p>
        </div>
        
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-colors duration-200">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 transition-colors duration-200">Target Saving</p>
          <p className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">
            {formatCurrency(targetSaving)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-sm p-6 mb-10 transition-colors duration-200">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-4 transition-colors duration-200">Progress Bar</p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 transition-colors duration-200">
          <div
            className="h-3 rounded-full bg-gray-900 dark:bg-indigo-500 transition-all duration-300"
            style={{ width: `${Math.min(savingsProgress, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-200">
          {savingsProgress.toFixed(1)}% of total target achieved
        </p>
      </div>

      {/* Current Goals */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-sm p-6 sm:p-10 transition-colors duration-200">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 transition-colors duration-200">Current Goals</p>
        </div>

        {goals.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">No goals set yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700 transition-colors duration-200">
            {goals.map((goal) => {
              const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
              return (
                <li
                  key={goal.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between relative"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-base font-semibold text-gray-900 dark:text-white transition-colors duration-200">{goal.name}</p>
                      <span className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 transition-colors duration-200">
                        {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2 transition-colors duration-200">
                      <div
                        className="h-2 rounded-full bg-gray-900 dark:bg-indigo-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      <span>{formatCurrency(goal.currentAmount)} saved</span>
                      <span>{progress.toFixed(0)}% complete</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center sm:gap-6">
                    <button
                      onClick={() => toggleDropdown(goal.id)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 transition-colors duration-200">
                        {goal.category} • {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                      <FaChevronDown className="text-gray-400 dark:text-gray-500 text-sm transition-colors duration-200" />
                    </button>
                    
                    {dropdownOpen === goal.id && (
                      <div className="absolute right-0 top-full mt-2 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg min-w-[120px] transition-colors duration-200">
                        <button
                          type="button"
                          onClick={() => handleEdit(goal)}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-2xl transition-colors duration-200"
                        >
                          <FaEdit className="text-gray-500 dark:text-gray-400 transition-colors duration-200" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteConfirm(goal)}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 last:rounded-b-2xl border-t border-gray-100 dark:border-gray-700 transition-colors duration-200"
                        >
                          <FaTrash className="text-rose-500 dark:text-rose-400 transition-colors duration-200" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div
        ref={formRef}
        className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-sm px-6 sm:px-10 py-10 mt-10 transition-colors duration-200"
      >
        <div className="flex items-center justify-between text-gray-400 dark:text-gray-500 text-sm uppercase tracking-[0.3em] transition-colors duration-200">
          <span>{editingId ? "Update Goal" : "Add Goal"}</span>
        </div>

        <div className="max-w-xl mx-auto mt-10">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Goal</h2>
            {editingId && (
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                Editing existing entry
              </p>
            )}
          </div>

          <form className="space-y-8" onSubmit={handleSubmit} noValidate>
            <div>
              <label className={LABEL_CLASSES}>Goal Name</label>
              <div className={BORDER_SECTION_CLASSES}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className={INPUT_BASE_CLASSES}
                  placeholder="e.g., Emergency Fund"
                />
              </div>
              {errors.name && <p className="mt-2 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={LABEL_CLASSES}>Target Amount</label>
                <div className={BORDER_SECTION_CLASSES}>
                  <input
                    type="number"
                    value={form.targetAmount}
                    onChange={(e) => handleFormChange("targetAmount", e.target.value)}
                    className={`${INPUT_BASE_CLASSES} appearance-none`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.targetAmount && (
                  <p className="mt-2 text-xs text-red-500">{errors.targetAmount}</p>
                )}
              </div>

              <div>
                <label className={LABEL_CLASSES}>Current Amount</label>
                <div className={BORDER_SECTION_CLASSES}>
                  <input
                    type="number"
                    value={form.currentAmount}
                    onChange={(e) => handleFormChange("currentAmount", e.target.value)}
                    className={`${INPUT_BASE_CLASSES} appearance-none`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.currentAmount && (
                  <p className="mt-2 text-xs text-red-500">{errors.currentAmount}</p>
                )}
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
                    <option value="Savings">Savings</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Travel">Travel</option>
                    <option value="Other">Other</option>
                  </select>
                  <FaChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
                </div>
              </div>

              <div>
                <label className={LABEL_CLASSES}>Deadline</label>
                <div className={BORDER_SECTION_CLASSES}>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => handleFormChange("deadline", e.target.value)}
                    className={INPUT_BASE_CLASSES}
                  />
                </div>
                {errors.deadline && (
                  <p className="mt-2 text-xs text-red-500">{errors.deadline}</p>
                )}
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
              <p className="text-xs font-semibold uppercase tracking-[0.3em]">Delete Goal</p>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Are you sure?</h3>
            <p className="mt-2 text-sm text-gray-500">
              This will permanently remove "{confirmDelete.goal?.name}" from
              your goals. You can't undo this action.
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
                onClick={confirmDeleteGoal}
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
