"use client";

interface CategoryBreakdown {
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  percentUsed: number;
}

interface SummaryData {
  month: number;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  categoryBreakdown: CategoryBreakdown[];
}

interface MonthlySummaryProps {
  summary: SummaryData | null;
  loading?: boolean;
}

export default function MonthlySummary({
  summary,
  loading,
}: MonthlySummaryProps) {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-zinc-200 dark:bg-zinc-700 rounded"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
        No data available for this month.
      </div>
    );
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
        {monthNames[summary.month - 1]} {summary.year}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
            Total Income
          </p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            ${summary.totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
            Total Expenses
          </p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">
            ${summary.totalExpenses.toFixed(2)}
          </p>
        </div>
        <div
          className={`rounded-lg p-4 ${
            summary.netSavings >= 0
              ? "bg-blue-50 dark:bg-blue-900/20"
              : "bg-orange-50 dark:bg-orange-900/20"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              summary.netSavings >= 0
                ? "text-blue-600 dark:text-blue-400"
                : "text-orange-600 dark:text-orange-400"
            }`}
          >
            Net Savings
          </p>
          <p
            className={`text-2xl font-bold ${
              summary.netSavings >= 0
                ? "text-blue-700 dark:text-blue-300"
                : "text-orange-700 dark:text-orange-300"
            }`}
          >
            ${summary.netSavings.toFixed(2)}
          </p>
        </div>
      </div>

      {summary.categoryBreakdown.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-4">
            Spending by Category
          </h3>
          <div className="space-y-4">
            {summary.categoryBreakdown.map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {cat.category}
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    ${cat.spent.toFixed(2)}
                    {cat.limit > 0 && ` / $${cat.limit.toFixed(2)}`}
                  </span>
                </div>
                {cat.limit > 0 && (
                  <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${
                        cat.percentUsed > 100
                          ? "bg-red-600"
                          : cat.percentUsed > 80
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(cat.percentUsed, 100)}%` }}
                    ></div>
                  </div>
                )}
                {cat.limit > 0 && (
                  <p
                    className={`text-xs mt-1 ${
                      cat.remaining < 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-zinc-500 dark:text-zinc-500"
                    }`}
                  >
                    {cat.remaining >= 0
                      ? `$${cat.remaining.toFixed(2)} remaining`
                      : `$${Math.abs(cat.remaining).toFixed(2)} over budget`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {summary.categoryBreakdown.length === 0 && (
        <p className="text-center text-zinc-500 dark:text-zinc-400 py-4">
          No expenses recorded this month.
        </p>
      )}
    </div>
  );
}
