"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MonthlySummary from "./components/MonthlySummary";
import TransactionList from "./components/TransactionList";

interface Transaction {
  id: string;
  date: string;
  description: string;
  subDescription: string | null;
  amount: number | string;
  category: string | null;
  createdAt: string;
}

interface SummaryData {
  month: number;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  categoryBreakdown: Array<{
    category: string;
    limit: number;
    spent: number;
    remaining: number;
    percentUsed: number;
  }>;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [summaryRes, transactionsRes] = await Promise.all([
        fetch("/api/summary"),
        fetch("/api/transactions"),
      ]);

      const summaryData = await summaryRes.json();
      const transactionsData = await transactionsRes.json();

      setSummary(summaryData);
      setRecentTransactions(transactionsData.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Overview of your monthly spending
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <MonthlySummary summary={summary} loading={loading} />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Recent Transactions
          </h2>
          <Link
            href="/transactions"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            View all
          </Link>
        </div>
        <TransactionList
          transactions={recentTransactions}
          onUpdate={fetchData}
        />
      </div>
    </div>
  );
}
