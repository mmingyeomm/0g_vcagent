import { v4 as uuidv4 } from 'uuid';
import { getInvestorById } from './investorStorage';

export interface Investment {
  id: string;
  investorId: string;
  opportunityId: string;
  amount: number;
  date: string;
  currentValue: number;
  performancePercentage: number;
}

export interface Portfolio {
  investorId: string;
  investments: Investment[];
  totalInvested: number;
  totalCurrentValue: number;
  overallPerformance: number;
}

const STORAGE_KEY = 'investments';

// Get all investments
export function getInvestments(): Investment[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const storedInvestments = localStorage.getItem(STORAGE_KEY);
  if (!storedInvestments) {
    return [];
  }

  try {
    return JSON.parse(storedInvestments);
  } catch {
    return [];
  }
}

// Add a new investment
export function addInvestment(investment: Omit<Investment, 'id' | 'date' | 'currentValue' | 'performancePercentage'>): Investment {
  const newInvestment = {
    ...investment,
    id: uuidv4(),
    date: new Date().toISOString(),
    currentValue: investment.amount * (1 + Math.random() * 0.3), // Simulate current value
    performancePercentage: Math.random() * 30 - 10, // Random performance between -10% and +20%
  };

  const investments = getInvestments();
  investments.push(newInvestment);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(investments));
  }
  
  return newInvestment;
}

// Get investments for a specific investor
export function getInvestmentsByInvestorId(investorId: string): Investment[] {
  const investments = getInvestments();
  return investments.filter(investment => investment.investorId === investorId);
}

// Get portfolio for a specific investor
export function getPortfolioByInvestorId(investorId: string): Portfolio {
  const investor = getInvestorById(investorId);
  if (!investor) {
    throw new Error(`Investor with ID ${investorId} not found`);
  }

  const investments = getInvestmentsByInvestorId(investorId);
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const overallPerformance = totalInvested > 0 
    ? ((totalCurrentValue - totalInvested) / totalInvested) * 100
    : 0;

  return {
    investorId,
    investments,
    totalInvested,
    totalCurrentValue,
    overallPerformance
  };
} 