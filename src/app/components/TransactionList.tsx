"use client";

import { useState } from "react";
import CategorySelect from "./CategorySelect";

interface Transaction {
  id: string;
  date: string;
  description: string;
  subDescription: string | null;
  amount: number | string;
  category: string | null;
  createdAt: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onUpdate?: () => void;
}

export default function TransactionList({
  transactions,
  onUpdate,
}: TransactionListProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleCategoryChange = async (id: string, category: string) => {
    setUpdating(id);
    try {
      await fetch(`/api/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });
      onUpdate?.();
    } catch (error) {
      console.error("Failed to update category:", error);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      onUpdate?.();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const formatAmount = (amount: number | string) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    const formatted = Math.abs(num).toFixed(2);
    return num < 0 ? `-$${formatted}` : `$${formatted}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
        No transactions found. Upload a CSV or add a transaction to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
        <thead className="bg-zinc-50 dark:bg-zinc-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-700">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-white">
                {formatDate(transaction.date)}
              </td>
              <td className="px-6 py-4 text-sm text-zinc-900 dark:text-white">
                <div>{transaction.description}</div>
                {transaction.subDescription && (
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {transaction.subDescription}
                  </div>
                )}
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  Number(transaction.amount) < 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {formatAmount(transaction.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <CategorySelect
                  value={transaction.category}
                  onChange={(cat) => handleCategoryChange(transaction.id, cat)}
                  className={updating === transaction.id ? "opacity-50" : ""}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => handleDelete(transaction.id)}
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
  );
}
