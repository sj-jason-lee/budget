"use client";

import { useState, useEffect } from "react";
import TransactionList from "../components/TransactionList";
import CSVUpload, { PendingTransaction } from "../components/CSVUpload";
import CategorySelect from "../components/CategorySelect";
import AddTransactionModal from "../components/AddTransactionModal";

interface Transaction {
  id: string;
  date: string;
  description: string;
  subDescription: string | null;
  amount: number | string;
  category: string | null;
  createdAt: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to delete ALL transactions? This cannot be undone.")) return;

    try {
      await fetch("/api/transactions", { method: "DELETE" });
      fetchTransactions();
    } catch (error) {
      console.error("Failed to clear transactions:", error);
    }
  };

  const handleParse = (parsed: PendingTransaction[]) => {
    setPendingTransactions(parsed);
  };

  const handlePendingCategoryChange = (tempId: string, category: string) => {
    setPendingTransactions((prev) =>
      prev.map((t) => (t.tempId === tempId ? { ...t, category } : t))
    );
  };

  const handleRemovePending = (tempId: string) => {
    setPendingTransactions((prev) => prev.filter((t) => t.tempId !== tempId));
  };

  const handleClearPending = () => {
    if (!confirm("Clear all pending transactions?")) return;
    setPendingTransactions([]);
  };

  const handleSubmit = async () => {
    if (pendingTransactions.length === 0) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/transactions/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactions: pendingTransactions.map((t) => ({
            date: t.date.toISOString(),
            description: t.description,
            subDescription: t.subDescription,
            amount: t.amount,
            category: t.category,
          })),
        }),
      });

      if (response.ok) {
        setPendingTransactions([]);
        fetchTransactions();
      } else {
        console.error("Failed to submit transactions");
      }
    } catch (error) {
      console.error("Failed to submit transactions:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toFixed(2);
    return amount < 0 ? `-$${formatted}` : `$${formatted}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          Transactions
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Upload and manage your transactions
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
          Upload Transactions
        </h2>
        <CSVUpload onParse={handleParse} />
      </div>
      
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
          Add Single Transaction
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
        >
          Add Transaction
        </button>
      </div>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchTransactions}
      />

      {pendingTransactions.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Pending Transactions ({pendingTransactions.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleClearPending}
                className="px-4 py-2 text-sm border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Clear
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit All"}
              </button>
            </div>
          </div>
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
                {pendingTransactions.map((transaction) => (
                  <tr key={transaction.tempId}>
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
                        transaction.amount < 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {formatAmount(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <CategorySelect
                        value={transaction.category}
                        onChange={(cat) =>
                          handlePendingCategoryChange(transaction.tempId, cat)
                        }
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleRemovePending(transaction.tempId)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Saved Transactions
          </h2>
          {transactions.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Clear All
            </button>
          )}
        </div>
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-12 bg-zinc-200 dark:bg-zinc-700 rounded"
              ></div>
            ))}
          </div>
        ) : (
          <TransactionList
            transactions={transactions}
            onUpdate={fetchTransactions}
          />
        )}
      </div>
    </div>
  );
}
