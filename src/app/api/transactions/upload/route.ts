import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";

interface CSVRow {
  Date: string;
  Description: string;
  "Sub-description": string;
  Amount: string;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const text = await file.text();

  const result = Papa.parse<CSVRow>(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    return NextResponse.json(
      { error: "Failed to parse CSV", details: result.errors },
      { status: 400 }
    );
  }

  const transactions = result.data.map((row) => ({
    date: new Date(row.Date),
    description: row.Description,
    subDescription: row["Sub-description"]?.trim() || null,
    amount: parseFloat(row.Amount),
    category: null,
  }));

  const created = await prisma.transaction.createMany({
    data: transactions,
  });

  return NextResponse.json(
    { message: `Successfully imported ${created.count} transactions` },
    { status: 201 }
  );
}
