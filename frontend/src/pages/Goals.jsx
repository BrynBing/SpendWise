import React, { useState, useEffect } from "react";
import { FaChevronDown, FaEdit, FaTrash, FaExclamationTriangle, FaPlus } from "react-icons/fa";
import Modal from "../components/Modal";
import { goalService } from "../services/api";

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
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState(() => createEmptyFormState());
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, goal: null });
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch goals from backend on component mount
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await goalService.getActiveGoals();
        
        // Transform backend data to frontend format
        const formattedGoals = response.data.map(goal => ({
          id: goal.goalId,
          name: goal.goalName,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
          category: goal.category || 'Other',
          deadline: goal.deadline,
        }));
        
        setGoals(formattedGoals);
      } catch (err) {
        console.error('Failed to fetch goals:', err);
        setError('Failed to load goals. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const goalData = {
      goalName: form.name.trim(),
      targetAmount: Number(form.targetAmount),
      currentAmount: Number(form.currentAmount) || 0,
      category: form.category,
      deadline: form.deadline,
    };

    console.log('Submitting goal data:', goalData);

    try {
      if (editingId) {
        const response = await goalService.updateGoal(editingId, goalData);
        
        const updatedGoal = {
          id: response.data.data.goalId,
          name: response.data.data.goalName,
          targetAmount: response.data.data.targetAmount,
          currentAmount: response.data.data.currentAmount,
          category: response.data.data.category || 'Other',
          deadline: response.data.data.deadline,
        };
        
        setGoals(prev => prev.map(goal => 
          goal.id === editingId ? updatedGoal : goal
        ));
        cancelEditing();
      } else {
        const response = await goalService.createGoal(goalData);
        
        const newGoal = {
          id: response.data.data.goalId,
          name: response.data.data.goalName,
          targetAmount: response.data.data.targetAmount,
          currentAmount: response.data.data.currentAmount,
          category: response.data.data.category || 'Other',
          deadline: response.data.data.deadline,
        };
        
        setGoals(prev => [newGoal, ...prev]);
        setForm(createEmptyFormState());
      }

      setErrors({});
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save goal:', err);
      console.error('Error response:', JSON.stringify(err.response?.data, null, 2));
      console.error('Error status:', err.response?.status);
      console.error('Goal data sent:', JSON.stringify(goalData, null, 2));
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save goal. Please try again.';
      setErrors({ submit: errorMessage });
    }
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
    setIsModalOpen(true);
  };

  const cancelEditing = () => {
    setForm(createEmptyFormState());
    setEditingId(null);
    setErrors({});
    setIsModalOpen(false);
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

  const confirmDeleteGoal = async () => {
    try {
      await goalService.deleteGoal(confirmDelete.goal.id);
      setGoals(prev => prev.filter(goal => goal.id !== confirmDelete.goal.id));
      closeDeleteConfirm();
    } catch (err) {
      console.error('Failed to delete goal:', err);
      alert('Failed to delete goal. Please try again.');
      closeDeleteConfirm();
    }
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

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-gray-400">Loading goals...</div>
        </div>
      ) : (
        <>
          {/* Savings Overview */}
          <div className="grid gap-4 sm:grid-cols-2 mb-10">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Current Saving</p>
              <p className="mt-3 text-2xl font-semibold text-gray-900">
                {formatCurrency(currentSaving)}
              </p>
            </div>
            
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Target Saving</p>
              <p className="mt-3 text-2xl font-semibold text-gray-900">
                {formatCurrency(targetSaving)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">Progress Bar</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gray-900 transition-all duration-300"
                style={{ width: `${Math.min(savingsProgress, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {savingsProgress.toFixed(1)}% of total target achieved
            </p>
          </div>

          {/* Current Goals */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-10">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Current Goals</p>
            </div>

            {goals.length === 0 ? (
              <p className="text-sm text-gray-500">No goals set yet.</p>
            ) : (
          <ul className="divide-y divide-gray-100">
            {goals.map((goal) => {
              const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
              return (
                <li
                  key={goal.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between relative"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-base font-semibold text-gray-900">{goal.name}</p>
                      <span className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
                        {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="h-2 rounded-full bg-gray-900 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{formatCurrency(goal.currentAmount)} saved</span>
                      <span>{progress.toFixed(0)}% complete</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center sm:gap-6">
                    <button
                      onClick={() => toggleDropdown(goal.id)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span className="text-xs uppercase tracking-[0.3em] text-gray-400">
                        {goal.category} • {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                      <FaChevronDown className="text-gray-400 text-sm" />
                    </button>
                    
                    {dropdownOpen === goal.id && (
                      <div className="absolute right-0 top-full mt-2 z-10 bg-white border border-gray-200 rounded-2xl shadow-lg min-w-[120px]">
                        <button
                          type="button"
                          onClick={() => handleEdit(goal)}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-2xl"
                        >
                          <FaEdit className="text-gray-500" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteConfirm(goal)}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 last:rounded-b-2xl border-t border-gray-100"
                        >
                          <FaTrash className="text-rose-500" /> Delete
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

      <div className="mt-10 flex justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-indigo-600 dark:bg-indigo-500 px-8 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-indigo-700 dark:hover:bg-indigo-600"
        >
          <FaPlus /> Add Goal
        </button>
      </div>
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={cancelEditing}
        title={editingId ? "Update Goal" : "Add Goal"}
        size="lg"
      >
        <div className="max-w-xl mx-auto">
          {editingId && (
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500 text-center">
              Editing existing entry
            </p>
          )}

          <form className="space-y-8" onSubmit={handleSubmit} noValidate>
            {errors.submit && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}
            
            <div>
              <label className={`${LABEL_CLASSES} dark:text-gray-500`}>Goal Name</label>
              <div className={`${BORDER_SECTION_CLASSES} dark:border-gray-700`}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className={`${INPUT_BASE_CLASSES} dark:text-gray-100 dark:placeholder:text-gray-600`}
                  placeholder="e.g., Emergency Fund"
                />
              </div>
              {errors.name && <p className="mt-2 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={`${LABEL_CLASSES} dark:text-gray-500`}>Target Amount</label>
                <div className={`${BORDER_SECTION_CLASSES} dark:border-gray-700`}>
                  <input
                    type="number"
                    value={form.targetAmount}
                    onChange={(e) => handleFormChange("targetAmount", e.target.value)}
                    className={`${INPUT_BASE_CLASSES} appearance-none dark:text-gray-100 dark:placeholder:text-gray-600`}
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
                <label className={`${LABEL_CLASSES} dark:text-gray-500`}>Current Amount</label>
                <div className={`${BORDER_SECTION_CLASSES} dark:border-gray-700`}>
                  <input
                    type="number"
                    value={form.currentAmount}
                    onChange={(e) => handleFormChange("currentAmount", e.target.value)}
                    className={`${INPUT_BASE_CLASSES} appearance-none dark:text-gray-100 dark:placeholder:text-gray-600`}
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
                <label className={`${LABEL_CLASSES} dark:text-gray-500`}>Category</label>
                <div className={`${BORDER_SECTION_CLASSES} relative dark:border-gray-700`}>
                  <select
                    value={form.category}
                    onChange={(e) => handleFormChange("category", e.target.value)}
                    className={`${INPUT_BASE_CLASSES} appearance-none pr-10 dark:text-gray-100`}
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
                <label className={`${LABEL_CLASSES} dark:text-gray-500`}>Deadline</label>
                <div className={`${BORDER_SECTION_CLASSES} dark:border-gray-700`}>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => handleFormChange("deadline", e.target.value)}
                    className={`${INPUT_BASE_CLASSES} dark:text-gray-100`}
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
