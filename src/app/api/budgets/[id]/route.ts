import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { category, limit } = body;

  const updateData: Record<string, unknown> = {};
  if (category !== undefined) updateData.category = category;
  if (limit !== undefined) updateData.limit = limit;

  const budget = await prisma.budget.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(budget);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.budget.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Budget deleted" });
}
