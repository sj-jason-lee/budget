import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface TransactionInput {
  date: string;
  description: string;
  subDescription: string | null;
  amount: number;
  category: string | null;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { transactions } = body as { transactions: TransactionInput[] };

  if (!transactions || !Array.isArray(transactions)) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const created = await prisma.transaction.createMany({
    data: transactions.map((t) => ({
      date: new Date(t.date),
      description: t.description,
      subDescription: t.subDescription,
      amount: t.amount,
      category: t.category,
    })),
  });

  return NextResponse.json(
    { message: `Successfully created ${created.count} transactions` },
    { status: 201 }
  );
}
