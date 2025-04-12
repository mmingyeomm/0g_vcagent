import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import InvestorPortfolio from '../components/InvestorPortfolio';
import { getInvestors, Investor, getInvestorById } from '../utils/investorStorage';
import { getPortfolioByInvestorId, addInvestment } from '../utils/portfolioStorage';
import { ChartBarIcon, ShieldCheckIcon, CurrencyDollarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface InvestmentOpportunity {
  id: string;
  name: string;
  description: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number;
  minInvestment: number;
  totalRaised: number;
  targetAmount: number;
  deadline: string;
}

const investmentOpportunities: InvestmentOpportunity[] = [
  {
    id: '1',
    name: 'AI-Powered Healthcare Platform',
    description: 'Revolutionary healthcare platform using AI for early disease detection',
    category: 'Healthcare',
    riskLevel: 'medium',
    expectedReturn: 25,
    minInvestment: 10000,
    totalRaised: 2500000,
    targetAmount: 5000000,
    deadline: '2024-06-30',
  },
  {
    id: '2',
    name: 'Renewable Energy Storage',
    description: 'Innovative battery technology for renewable energy storage',
    category: 'Energy',
    riskLevel: 'high',
    expectedReturn: 35,
    minInvestment: 50000,
    totalRaised: 1500000,
    targetAmount: 3000000,
    deadline: '2024-07-15',
  },
  {
    id: '3',
    name: 'FinTech Payment Solution',
    description: 'Next-generation payment processing platform',
    category: 'Finance',
    riskLevel: 'low',
    expectedReturn: 15,
    minInvestment: 25000,
    totalRaised: 4000000,
    targetAmount: 5000000,
    deadline: '2024-08-01',
  },
];

export default function Invest() {
  const [selectedInvestor, setSelectedInvestor] = useState<string>('');
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [selectedOpportunity, setSelectedOpportunity] = useState<string>('');
  const [investmentModal, setInvestmentModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [portfolioVisible, setPortfolioVisible] = useState(false);

  useEffect(() => {
    // Simulate loading state for a smoother experience
    const timer = setTimeout(() => {
      setInvestors(getInvestors());
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (investorId: string) => {
    setSelectedInvestor(investorId);
    setPortfolioVisible(false); // Reset portfolio view when changing investors
  };

  const handleViewPortfolio = () => {
    if (selectedInvestor) {
      setPortfolioVisible(true);
    }
  };

  const handleOpportunitySelect = (opportunityId: string) => {
    setSelectedOpportunity(opportunityId);
    const opportunity = investmentOpportunities.find(opp => opp.id === opportunityId);
    if (opportunity) {
      setInvestmentAmount(opportunity.minInvestment);
    }
    setInvestmentModal(true);
  };

  const handleInvest = () => {
    if (!selectedInvestor || !selectedOpportunity || investmentAmount <= 0) {
      return;
    }

    // Add the investment
    addInvestment({
      investorId: selectedInvestor,
      opportunityId: selectedOpportunity,
      amount: investmentAmount
    });

    // Reset and show success message
    setInvestmentModal(false);
    setSuccessMessage('Investment successfully added to portfolio!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getRiskColor = (riskTolerance: string) => {
    switch (riskTolerance) {
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

  const getRandomFigure = (min: number, max: number) => {
    return +(Math.random() * (max - min) + min).toFixed(2);
  };

  // Generate mock performance metrics for each investor
  const getPerformanceMetrics = (investorId: string) => {
    // Use investor ID to seed the random number so it's consistent
    const seed = investorId.charCodeAt(0) / 255;
    
    return {
      dailyChange: getRandomFigure(-5, 15) + seed * 10,
      weeklyChange: getRandomFigure(-10, 30) + seed * 20,
      monthlyChange: getRandomFigure(-15, 45) + seed * 30,
    };
  };

  // Get the selected investor's portfolio
  const getSelectedInvestorPortfolio = () => {
    if (!selectedInvestor) return null;
    
    try {
      return getPortfolioByInvestorId(selectedInvestor);
    } catch (error) {
      console.error('Failed to get portfolio:', error);
      return null;
    }
  };

  const selectedInvestorData = selectedInvestor ? getInvestorById(selectedInvestor) : null;
  const portfolio = getSelectedInvestorPortfolio();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold gradient-text">Investor Launchpad</h1>
          <p className="text-gray-400">Select an investor profile to manage investments</p>
        </div>

        {successMessage && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400">
            {successMessage}
          </div>
        )}

        {/* Top Investors */}
        <div className="relative rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden gradient-border">
          <div className="px-6 py-4 border-b border-[#2A2A2A] flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-[#00F5A0]" />
              <span>Top Investors</span>
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[#00F5A0]/10 text-[#00F5A0]">
                LIVE
              </span>
            </h2>
            <div className="flex items-center text-sm text-gray-400">
              <span className="mr-2">System status:</span>
              <span className="text-[#00F5A0] flex items-center">
                active
                <span className="ml-1 relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F5A0] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F5A0]"></span>
                </span>
              </span>
            </div>
          </div>
          
          {loading ? (
            <div className="p-8 flex justify-center items-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00F5A0]"></div>
                <p className="mt-4 text-gray-400">Loading investors...</p>
              </div>
            </div>
          ) : investors.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto h-16 w-16 text-gray-400 animate-float">
                <CurrencyDollarIcon className="h-16 w-16" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-white">No investors found</h3>
              <p className="mt-2 text-gray-400 max-w-md mx-auto">
                Start your investment journey by creating a new investor profile with custom risk tolerance and focus areas.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => window.location.href = '/create'}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] hover:from-[#00D9F5] hover:to-[#00F5A0] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00F5A0] animate-pulse-custom"
                >
                  Create Investor
                </button>
              </div>
            </div>
          ) : (
            <div>
              <table className="crypto-table">
                <thead>
                  <tr>
                    <th>Investor</th>
                    <th>Risk Level</th>
                    <th>Focus</th>
                    <th>Min Amount</th>
                    <th>Max Amount</th>
                    <th>24H Change</th>
                    <th>Created</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {investors.map((investor) => {
                    const metrics = getPerformanceMetrics(investor.id);
                    return (
                      <tr
                        key={investor.id}
                        className={`${
                          selectedInvestor === investor.id ? "bg-[#2A2A2A]" : ""
                        }`}
                        onClick={() => handleSelect(investor.id)}
                      >
                        <td>
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-[#00F5A0]/20 to-[#00D9F5]/20 flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {investor.name.substring(0, 2)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {investor.name}
                              </div>
                              <div className="text-sm text-gray-400 truncate max-w-[200px]">
                                {investor.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getRiskColor(
                              investor.riskTolerance
                            )}`}
                          >
                            {investor.riskTolerance}
                          </span>
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-1">
                            {investor.investmentFocus.slice(0, 2).map((focus, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 text-xs rounded-full bg-[#333] text-white"
                              >
                                {focus}
                              </span>
                            ))}
                            {investor.investmentFocus.length > 2 && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-[#333] text-white">
                                +{investor.investmentFocus.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="text-gray-300">
                          ${investor.minInvestmentAmount.toLocaleString()}
                        </td>
                        <td className="text-gray-300">
                          ${investor.maxInvestmentAmount.toLocaleString()}
                        </td>
                        <td>
                          <span
                            className={
                              metrics.dailyChange >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          >
                            {metrics.dailyChange >= 0 ? "+" : ""}
                            {metrics.dailyChange.toFixed(2)}%
                          </span>
                        </td>
                        <td className="text-gray-400">
                          {new Date(investor.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            className="bg-[#333] hover:bg-[#444] text-white px-3 py-1 rounded-md text-sm transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelect(investor.id);
                              handleViewPortfolio();
                            }}
                          >
                            Portfolio
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Investor Portfolio (conditionally rendered) */}
        {selectedInvestor && portfolioVisible && portfolio && (
          <InvestorPortfolio 
            portfolio={portfolio} 
            opportunities={investmentOpportunities} 
          />
        )}

        {/* Investment Opportunities */}
        {selectedInvestor && selectedInvestorData && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Investment Opportunities</h2>
              <div className="text-gray-400 text-sm">
                Selected Investor: <span className="text-white font-semibold">{selectedInvestorData.name}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investmentOpportunities.map((opportunity) => (
                <div 
                  key={opportunity.id} 
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden hover:border-[#00F5A0]/50 transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{opportunity.name}</h3>
                        <p className="text-gray-400 text-sm mb-2">{opportunity.category}</p>
                      </div>
                      <span className={`h-fit px-2 py-1 text-xs rounded-full ${getRiskColor(opportunity.riskLevel)}`}>
                        {opportunity.riskLevel}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mt-4">{opportunity.description}</p>
                    
                    <div className="mt-6 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expected Return:</span>
                        <span className="text-green-400 font-medium">{opportunity.expectedReturn}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Min Investment:</span>
                        <span className="text-white">${opportunity.minInvestment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Progress:</span>
                        <span className="text-white">{Math.round((opportunity.totalRaised / opportunity.targetAmount) * 100)}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-[#00F5A0] to-[#00D9F5]" 
                        style={{ width: `${Math.min(100, Math.round((opportunity.totalRaised / opportunity.targetAmount) * 100))}%` }}
                      ></div>
                    </div>
                    
                    <div className="mt-6">
                      <button
                        onClick={() => handleOpportunitySelect(opportunity.id)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-black font-semibold rounded-lg hover:from-[#00D9F5] hover:to-[#00F5A0] transition-all duration-300"
                      >
                        Invest Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Investment Modal */}
        {investmentModal && selectedInvestor && selectedOpportunity && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 max-w-md w-full">
              <h2 className="text-white text-xl font-semibold mb-4">Make Investment</h2>
              
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Investment Amount ($)</label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  className="w-full bg-[#242424] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00F5A0]"
                  min={investmentOpportunities.find(o => o.id === selectedOpportunity)?.minInvestment || 0}
                  max={selectedInvestorData?.maxInvestmentAmount || 1000000}
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setInvestmentModal(false)}
                  className="px-4 py-2 border border-[#333] text-white rounded-lg hover:bg-[#2A2A2A] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvest}
                  className="px-4 py-2 bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-black font-semibold rounded-lg hover:from-[#00D9F5] hover:to-[#00F5A0] transition-all duration-300"
                >
                  Confirm Investment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
