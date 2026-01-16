"use client";

import { useState, useEffect } from "react";
import BudgetForm from "../components/BudgetForm";

interface Budget {
  id: string;
  category: string;
  limit: number | string;
  createdAt: string;
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/budgets");
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error("Failed to fetch budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to delete ALL budgets? This cannot be undone.")) return;

    try {
      await fetch("/api/budgets", { method: "DELETE" });
      fetchBudgets();
    } catch (error) {
      console.error("Failed to clear budgets:", error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Budget Limits
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Set monthly spending limits for each category
          </p>
        </div>
        {budgets.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 bg-zinc-200 dark:bg-zinc-700 rounded"
              ></div>
            ))}
          </div>
        ) : (
          <BudgetForm budgets={budgets} onUpdate={fetchBudgets} />
        )}
      </div>
    </div>
  );
}
