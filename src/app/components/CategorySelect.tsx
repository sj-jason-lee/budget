"use client";

const CATEGORIES = [
  "Groceries",
  "Dining",
  "Rent",
  "Utilities",
  "Gas",
  "Insurance",
  "Subscriptions",
  "Shopping",
  "Health",
  "Travel",
  "Other",
];

interface CategorySelectProps {
  value: string | null;
  onChange: (category: string) => void;
  className?: string;
}

export default function CategorySelect({
  value,
  onChange,
  className = "",
}: CategorySelectProps) {
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${className}`}
    >
      <option value="">Select category</option>
      {CATEGORIES.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}

export { CATEGORIES };
