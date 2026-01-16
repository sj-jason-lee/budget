// Auto-categorization rules based on keywords in description/sub-description
// Keywords are matched case-insensitively

interface CategoryRule {
  keywords: string[];
  category: string;
}

const rules: CategoryRule[] = [
  // Dining
  {
    keywords: ["mcdonald", "burger", "wendy", "subway", "tim horton", "starbucks", "cafe", "restaurant", "pizza", "sushi", "taco", "kfc", "popeye", "chick-fil-a", "chipotle", "panera", "dunkin", "dining", "bakery", "grill", "kitchen", "eatery", "diner", "bistro", "bar & grill", "pub", "tavern"],
    category: "Dining",
  },
  // Groceries
  {
    keywords: ["walmart", "costco", "safeway", "kroger", "whole foods", "trader joe", "aldi", "publix", "grocery", "supermarket", "food mart", "market", "loblaws", "no frills", "metro", "sobeys", "freshco", "food basics", "real canadian superstore"],
    category: "Groceries",
  },
  // Gas
  {
    keywords: ["petro-canada", "shell", "esso", "chevron", "mobil", "exxon", "bp ", "gas station", "fuel", "petroleum", "sunoco", "circle k", "husky", "pioneer", "ultramar"],
    category: "Gas",
  },
  // Insurance
  {
    keywords: ["insurance", "td insurance", "geico", "state farm", "allstate", "progressive", "liberty mutual", "farmers", "nationwide"],
    category: "Insurance",
  },
  // Utilities
  {
    keywords: ["hydro", "electric", "power", "gas bill", "water bill", "utility", "enbridge", "fortis", "puc", "toronto hydro", "bc hydro"],
    category: "Utilities",
  },
  // Subscriptions
  {
    keywords: ["netflix", "spotify", "disney+", "hulu", "amazon prime", "apple music", "youtube", "hbo", "paramount", "peacock", "subscription", "membership", "monthly fee"],
    category: "Subscriptions",
  },
  // Shopping
  {
    keywords: ["amazon", "ebay", "best buy", "target", "home depot", "lowes", "ikea", "winners", "marshalls", "tj maxx", "canadian tire", "shoppers drug", "dollarama", "dollar tree"],
    category: "Shopping",
  },
  // Health
  {
    keywords: ["pharmacy", "cvs", "walgreens", "rexall", "medical", "clinic", "doctor", "dentist", "hospital", "health", "physio", "chiro", "optom", "vision", "dental"],
    category: "Health",
  },
  // Travel
  {
    keywords: ["airline", "airbnb", "hotel", "motel", "expedia", "booking.com", "uber", "lyft", "taxi", "transit", "parking", "airport", "flight", "travel"],
    category: "Travel",
  },
  // Rent
  {
    keywords: ["rent", "landlord", "property management", "lease"],
    category: "Rent",
  },
];

export function autoCategorize(description: string, subDescription: string | null): string | null {
  const textToSearch = `${description} ${subDescription || ""}`.toLowerCase();

  for (const rule of rules) {
    for (const keyword of rule.keywords) {
      if (textToSearch.includes(keyword.toLowerCase())) {
        return rule.category;
      }
    }
  }

  return null;
}
