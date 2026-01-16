import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const budgets = await prisma.budget.findMany({
    orderBy: { category: "asc" },
  });

  return NextResponse.json(budgets);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { category, limit } = body;

  const budget = await prisma.budget.upsert({
    where: { category },
    update: { limit },
    create: { category, limit },
  });

  return NextResponse.json(budget, { status: 201 });
}

export async function DELETE() {
  const result = await prisma.budget.deleteMany({});
  return NextResponse.json({ deleted: result.count });
}
