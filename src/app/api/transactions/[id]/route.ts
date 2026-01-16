import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { date, description, amount, category } = body;

  const updateData: Record<string, unknown> = {};
  if (date !== undefined) updateData.date = new Date(date);
  if (description !== undefined) updateData.description = description;
  if (amount !== undefined) updateData.amount = amount;
  if (category !== undefined) updateData.category = category;

  const transaction = await prisma.transaction.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(transaction);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.transaction.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Transaction deleted" });
}
