import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const month = searchParams.get("month") || (new Date().getMonth() + 1).toString();
  const year = searchParams.get("year") || new Date().getFullYear().toString();

  const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
  const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const budgets = await prisma.budget.findMany({
    where: { userId: session.user.id },
  });

  // Calculate spending by category
  const spendingByCategory: Record<string, number> = {};
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((t) => {
    const amount = typeof t.amount === "object" && t.amount !== null && "toNumber" in t.amount
      ? (t.amount as { toNumber: () => number }).toNumber()
      : Number(t.amount);
    const category = t.category || "Uncategorized";

    if (amount < 0) {
      // Expense
      totalExpenses += Math.abs(amount);
      spendingByCategory[category] = (spendingByCategory[category] || 0) + Math.abs(amount);
    } else {
      // Income
      totalIncome += amount;
    }
  });

  // Map budgets to spending
  const categoryBreakdown = budgets.map((b) => {
    const limit = typeof b.limit === "object" && b.limit !== null && "toNumber" in b.limit
      ? (b.limit as { toNumber: () => number }).toNumber()
      : Number(b.limit);
    const spent = spendingByCategory[b.category] || 0;
    return {
      category: b.category,
      limit,
      spent,
      remaining: limit - spent,
      percentUsed: limit > 0 ? (spent / limit) * 100 : 0,
    };
  });

  // Add uncategorized spending if exists
  Object.keys(spendingByCategory).forEach((cat) => {
    if (!budgets.find((b) => b.category === cat)) {
      categoryBreakdown.push({
        category: cat,
        limit: 0,
        spent: spendingByCategory[cat],
        remaining: -spendingByCategory[cat],
        percentUsed: 100,
      });
    }
  });

  return NextResponse.json({
    month: parseInt(month),
    year: parseInt(year),
    totalIncome,
    totalExpenses,
    netSavings: totalIncome - totalExpenses,
    categoryBreakdown,
  });
}
