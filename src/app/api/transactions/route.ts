import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  let where = {};
  if (month && year) {
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
    where = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };
  }

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" },
  });

  return NextResponse.json(transactions);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { date, description, amount, category } = body;

  const transaction = await prisma.transaction.create({
    data: {
      date: new Date(date),
      description,
      amount,
      category,
    },
  });

  return NextResponse.json(transaction, { status: 201 });
}

export async function DELETE() {
  const result = await prisma.transaction.deleteMany({});
  return NextResponse.json({ deleted: result.count });
}
