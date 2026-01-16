"use client";

import { useState } from "react";
import { CATEGORIES } from "./CategorySelect";

interface Budget {
  id: string;
  category: string;
  limit: number | string;
  createdAt: string;
}

interface BudgetFormProps {
  budgets: Budget[];
  onUpdate?: () => void;
}

export default function BudgetForm({ budgets, onUpdate }: BudgetFormProps) {
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !limit) return;

    setSubmitting(true);
    try {
      await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, limit: parseFloat(limit) }),
      });
      setCategory("");
      setLimit("");
      onUpdate?.();
    } catch (error) {
      console.error("Failed to create budget:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) return;

    try {
      await fetch(`/api/budgets/${id}`, { method: "DELETE" });
      onUpdate?.();
    } catch (error) {
      console.error("Failed to delete budget:", error);
    }
  };

  const formatLimit = (budgetLimit: number | string) => {
    const num =
      typeof budgetLimit === "string" ? parseFloat(budgetLimit) : budgetLimit;
    return `$${num.toFixed(2)}`;
  };

  // Get categories that don't have budgets yet
  const availableCategories = CATEGORIES.filter(
    (cat) => !budgets.find((b) => b.category === cat)
  );

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6 flex gap-4 flex-wrap">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 min-w-[150px] rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={submitting}
        >
          <option value="">Select category</option>
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          placeholder="Monthly limit"
          step="0.01"
          min="0"
          className="flex-1 min-w-[150px] rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting || !category || !limit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Adding..." : "Add Budget"}
        </button>
      </form>

      {budgets.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Monthly Limit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-700">
              {budgets.map((budget) => (
                <tr key={budget.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-white">
                    {budget.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-white">
                    {formatLimit(budget.limit)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {budgets.length === 0 && (
        <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">
          No budgets set. Add a category budget above to start tracking.
        </p>
      )}
    </div>
  );
}
