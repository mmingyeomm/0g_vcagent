import React from 'react';
import { Portfolio, Investment } from '../utils/portfolioStorage';
import { ArrowUpIcon, ArrowDownIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface InvestorPortfolioProps {
  portfolio: Portfolio;
  opportunities: any[]; // Use the actual type from your opportunities
}

const InvestorPortfolio: React.FC<InvestorPortfolioProps> = ({ portfolio, opportunities }) => {
  // Helper function to find opportunity by ID
  const getOpportunityById = (id: string) => {
    return opportunities.find(opp => opp.id === id) || {
      name: 'Unknown Opportunity',
      category: 'Unknown',
      riskLevel: 'medium'
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage > 0) return 'text-green-400';
    if (percentage < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'high':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden gradient-border">
      <div className="px-6 py-4 border-b border-[#2A2A2A]">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-2 text-[#00F5A0]" />
          <span>Investment Portfolio</span>
        </h2>
      </div>
      
      {portfolio.investments.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mx-auto h-16 w-16 text-gray-400">
            <CurrencyDollarIcon className="h-16 w-16" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-white">No investments found</h3>
          <p className="mt-2 text-gray-400 max-w-md mx-auto">
            This investor has not made any investments yet. Start investing to build a portfolio.
          </p>
        </div>
      ) : (
        <div className="p-6">
          {/* Portfolio Summary */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#242424] rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Invested</p>
              <h3 className="text-white text-2xl font-bold">{formatCurrency(portfolio.totalInvested)}</h3>
            </div>
            <div className="bg-[#242424] rounded-lg p-4">
              <p className="text-gray-400 text-sm">Current Value</p>
              <h3 className="text-white text-2xl font-bold">{formatCurrency(portfolio.totalCurrentValue)}</h3>
            </div>
            <div className="bg-[#242424] rounded-lg p-4">
              <p className="text-gray-400 text-sm">Overall Performance</p>
              <h3 className={`text-2xl font-bold ${getPerformanceColor(portfolio.overallPerformance)}`}>
                {formatPercentage(portfolio.overallPerformance)}
                {portfolio.overallPerformance > 0 ? (
                  <ArrowUpIcon className="w-4 h-4 inline ml-1" />
                ) : portfolio.overallPerformance < 0 ? (
                  <ArrowDownIcon className="w-4 h-4 inline ml-1" />
                ) : null}
              </h3>
            </div>
          </div>
          
          {/* Investments Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#2A2A2A]">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Opportunity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Risk</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Current Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Performance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {portfolio.investments.map((investment) => {
                  const opportunity = getOpportunityById(investment.opportunityId);
                  return (
                    <tr key={investment.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{opportunity.name}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{opportunity.category}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(opportunity.riskLevel)}`}>
                          {opportunity.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatCurrency(investment.amount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatCurrency(investment.currentValue)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`text-sm ${getPerformanceColor(investment.performancePercentage)}`}>
                          {formatPercentage(investment.performancePercentage)}
                          {investment.performancePercentage > 0 ? (
                            <ArrowUpIcon className="w-3 h-3 inline ml-1" />
                          ) : investment.performancePercentage < 0 ? (
                            <ArrowDownIcon className="w-3 h-3 inline ml-1" />
                          ) : null}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(investment.date).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorPortfolio; 