"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import { autoCategorize } from "@/lib/categoryRules";

interface CSVRow {
  Date: string;
  Description: string;
  "Sub-description": string;
  Amount: string;
}

export interface PendingTransaction {
  tempId: string;
  date: Date;
  description: string;
  subDescription: string | null;
  amount: number;
  category: string | null;
}

interface CSVUploadProps {
  onParse?: (transactions: PendingTransaction[]) => void;
}

export default function CSVUpload({ onParse }: CSVUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleUpload = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setMessage({ type: "error", text: "Please upload a CSV file" });
      return;
    }

    setParsing(true);
    setMessage(null);

    try {
      const text = await file.text();
      const result = Papa.parse<CSVRow>(text, {
        header: true,
        skipEmptyLines: true,
      });

      if (result.errors.length > 0) {
        setMessage({ type: "error", text: "Failed to parse CSV" });
        return;
      }

      const transactions: PendingTransaction[] = result.data
        .filter((row) => row.Date && row.Amount)
        .map((row, index) => {
          const description = row.Description || "";
          const subDescription = row["Sub-description"]?.trim() || null;
          return {
            tempId: `pending-${Date.now()}-${index}`,
            date: new Date(row.Date),
            description,
            subDescription,
            amount: parseFloat(row.Amount),
            category: autoCategorize(description, subDescription),
          };
        });

      const categorizedCount = transactions.filter((t) => t.category !== null).length;
      setMessage({
        type: "success",
        text: `Parsed ${transactions.length} transactions (${categorizedCount} auto-categorized). Review below, then click Submit.`,
      });
      onParse?.(transactions);
    } catch {
      setMessage({ type: "error", text: "Failed to parse file" });
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
        } ${parsing ? "opacity-50 pointer-events-none" : ""}`}
      >
        <div className="text-zinc-600 dark:text-zinc-400">
          <p className="mb-2">
            {parsing
              ? "Parsing..."
              : "Drag and drop a CSV file here, or click to browse"}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Expected columns: Date, Description, Sub-description, Amount
          </p>
        </div>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="csv-upload"
          disabled={parsing}
        />
        <label
          htmlFor="csv-upload"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
        >
          Select File
        </label>
      </div>
      {message && (
        <div
          className={`mt-4 p-3 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
