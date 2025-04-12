import { v4 as uuidv4 } from "uuid";

export interface Investor {
  id: string;
  name: string;
  description: string;
  riskTolerance: "low" | "medium" | "high";
  investmentFocus: string[];
  maxInvestmentAmount: number;
  minInvestmentAmount: number;
  details: string;
  createdAt: string;
}

const STORAGE_KEY = "investors";

export function getInvestors(): Investor[] {
  if (typeof window === "undefined") {
    return [];
  }

  const storedInvestors = localStorage.getItem(STORAGE_KEY);
  if (!storedInvestors) {
    return [];
  }

  try {
    return JSON.parse(storedInvestors);
  } catch {
    return [];
  }
}

export function addInvestor(
  investor: Omit<Investor, "id" | "createdAt">
): Investor {
  const newInvestor = {
    ...investor,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };

  const investors = getInvestors();
  investors.push(newInvestor);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(investors));
  }

  return newInvestor;
}

export function getInvestorById(id: string): Investor | undefined {
  const investors = getInvestors();
  return investors.find((investor) => investor.id === id);
}
