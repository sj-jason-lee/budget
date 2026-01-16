import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const budgets = await prisma.budget.findMany({
    where: { userId: session.user.id },
    orderBy: { category: "asc" },
  });

  return NextResponse.json(budgets);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { category, limit } = body;

  const budget = await prisma.budget.upsert({
    where: {
      userId_category: {
        userId: session.user.id,
        category,
      },
    },
    update: { limit },
    create: { category, limit, userId: session.user.id },
  });

  return NextResponse.json(budget, { status: 201 });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await prisma.budget.deleteMany({
    where: { userId: session.user.id },
  });
  return NextResponse.json({ deleted: result.count });
}
