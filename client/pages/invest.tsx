import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import InvestorPortfolio from "../components/InvestorPortfolio";
import {
  getInvestors,
  Investor,
  getInvestorById,
} from "../utils/investorStorage";
import {
  getPortfolioByInvestorId,
  addInvestment,
} from "../utils/portfolioStorage";
import {
  ChartBarIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

interface InvestmentOpportunity {
  id: string;
  name: string;
  description: string;
  category: string;
  riskLevel: "low" | "medium" | "high";
  expectedReturn: number;
  minInvestment: number;
  totalRaised: number;
  targetAmount: number;
  deadline: string;
  agentId?: string; // Optional field to associate with a specific AI agent
  allocation?: number; // 투자 비율 추가
}

// A larger pool of investment opportunities
const allInvestmentOpportunities: InvestmentOpportunity[] = [
  {
    id: "1",
    name: "AI-Powered Healthcare Platform",
    description:
      "Revolutionary healthcare platform using AI for early disease detection",
    category: "Healthcare",
    riskLevel: "medium",
    expectedReturn: 25,
    minInvestment: 10000,
    totalRaised: 2500000,
    targetAmount: 5000000,
    deadline: "2024-06-30",
    allocation: 30, // 30% 할당
  },
  {
    id: "2",
    name: "Renewable Energy Storage",
    description: "Innovative battery technology for renewable energy storage",
    category: "Energy",
    riskLevel: "high",
    expectedReturn: 35,
    minInvestment: 50000,
    totalRaised: 1500000,
    targetAmount: 3000000,
    deadline: "2024-07-15",
    allocation: 40, // 40% 할당
  },
  {
    id: "3",
    name: "FinTech Payment Solution",
    description: "Next-generation payment processing platform",
    category: "Finance",
    riskLevel: "low",
    expectedReturn: 15,
    minInvestment: 25000,
    totalRaised: 4000000,
    targetAmount: 5000000,
    deadline: "2024-08-01",
    allocation: 30, // 30% 할당
  },
  {
    id: "4",
    name: "Quantum Computing Research",
    description: "Cutting-edge quantum computing technology development",
    category: "Technology",
    riskLevel: "high",
    expectedReturn: 45,
    minInvestment: 75000,
    totalRaised: 3700000,
    targetAmount: 8000000,
    deadline: "2024-09-15",
  },
  {
    id: "5",
    name: "Sustainable Agriculture Tech",
    description: "AI-driven solutions for sustainable farming and agriculture",
    category: "Agriculture",
    riskLevel: "medium",
    expectedReturn: 22,
    minInvestment: 30000,
    totalRaised: 2200000,
    targetAmount: 4500000,
    deadline: "2024-07-30",
  },
  {
    id: "6",
    name: "Autonomous Vehicle Systems",
    description: "Next-gen AI systems for autonomous transportation",
    category: "Automotive",
    riskLevel: "high",
    expectedReturn: 40,
    minInvestment: 60000,
    totalRaised: 5500000,
    targetAmount: 10000000,
    deadline: "2024-10-15",
  },
  {
    id: "7",
    name: "AR/VR Educational Platform",
    description: "Immersive learning experiences through augmented reality",
    category: "Education",
    riskLevel: "medium",
    expectedReturn: 28,
    minInvestment: 15000,
    totalRaised: 1800000,
    targetAmount: 3500000,
    deadline: "2024-08-30",
  },
  {
    id: "8",
    name: "Smart City Infrastructure",
    description: "IoT solutions for urban development and smart cities",
    category: "Infrastructure",
    riskLevel: "low",
    expectedReturn: 18,
    minInvestment: 40000,
    totalRaised: 6500000,
    targetAmount: 12000000,
    deadline: "2024-11-30",
  },
  {
    id: "9",
    name: "Blockchain Supply Chain",
    description: "Decentralized supply chain management solutions",
    category: "Logistics",
    riskLevel: "medium",
    expectedReturn: 32,
    minInvestment: 20000,
    totalRaised: 3200000,
    targetAmount: 7000000,
    deadline: "2024-09-01",
  },
  {
    id: "10",
    name: "Personalized Medicine Platform",
    description: "AI-powered solutions for personalized healthcare treatments",
    category: "Healthcare",
    riskLevel: "high",
    expectedReturn: 38,
    minInvestment: 45000,
    totalRaised: 4800000,
    targetAmount: 9000000,
    deadline: "2024-10-01",
  },
  {
    id: "11",
    name: "Space Technology Ventures",
    description:
      "Innovative technologies for space exploration and satellite systems",
    category: "Aerospace",
    riskLevel: "high",
    expectedReturn: 50,
    minInvestment: 100000,
    totalRaised: 8500000,
    targetAmount: 20000000,
    deadline: "2024-12-15",
  },
  {
    id: "12",
    name: "Cybersecurity Defense Systems",
    description: "Advanced security solutions for enterprise protection",
    category: "Security",
    riskLevel: "low",
    expectedReturn: 20,
    minInvestment: 35000,
    totalRaised: 5200000,
    targetAmount: 8000000,
    deadline: "2024-08-15",
  },
];

// Replace the old investmentOpportunities array
const investmentOpportunities: InvestmentOpportunity[] =
  allInvestmentOpportunities.slice(0, 3);

export default function Invest() {
  const [selectedInvestor, setSelectedInvestor] = useState<string>("");
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [selectedOpportunity, setSelectedOpportunity] = useState<string>("");
  const [investmentModal, setInvestmentModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [portfolioVisible, setPortfolioVisible] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedInvestorDetails, setSelectedInvestorDetails] =
    useState<Investor | null>(null);
  const [agentOpportunities, setAgentOpportunities] = useState<
    InvestmentOpportunity[]
  >([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading state for a smoother experience
    const timer = setTimeout(() => {
      setInvestors(getInvestors());
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Generate random opportunities when an investor is selected
  useEffect(() => {
    if (selectedInvestor) {
      generateRandomOpportunitiesForAgent();
      // 두 섹션을 모두 자동으로 확장하도록 수정
      setExpandedSection("both");
    }
  }, [selectedInvestor]);

  // Function to shuffle array - Fisher-Yates algorithm
  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Generate random investment opportunities for the selected agent
  const generateRandomOpportunitiesForAgent = () => {
    // Shuffle all opportunities and take the first 3
    const shuffled = shuffleArray(allInvestmentOpportunities);
    const selected = shuffled.slice(0, 3);

    // 만약 allocation이 설정되지 않은 경우 랜덤 값으로 설정 (합계 = 100%)
    let totalAllocation = 0;
    selected.forEach((opp, index) => {
      if (index < selected.length - 1) {
        // 마지막 아이템이 아닐 경우 랜덤 할당 (15-45% 사이)
        if (!opp.allocation) {
          const remaining = 100 - totalAllocation;
          const max = Math.min(
            45,
            remaining - (selected.length - index - 1) * 15
          );
          const min = Math.max(
            15,
            remaining - (selected.length - index - 1) * 45
          );
          opp.allocation = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        totalAllocation += opp.allocation || 0;
      } else {
        // 마지막 아이템은 남은 값으로 설정
        opp.allocation = 100 - totalAllocation;
      }
    });

    setAgentOpportunities(selected);
  };

  const handleSelect = (investorId: string) => {
    setSelectedInvestor(investorId);
    setPortfolioVisible(false); // Reset portfolio view when changing investors
    setExpandedSection(null); // Reset expanded sections
  };

  const handleViewPortfolio = () => {
    if (selectedInvestor) {
      setPortfolioVisible(true);
    }
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleOpportunitySelect = (opportunityId: string) => {
    setSelectedOpportunity(opportunityId);
    const opportunity =
      opportunityId === "ai-agent"
        ? { minInvestment: 20000 }
        : agentOpportunities.find((opp) => opp.id === opportunityId) ||
          allInvestmentOpportunities.find((opp) => opp.id === opportunityId);

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
      amount: investmentAmount,
    });

    // Reset and show success message
    setInvestmentModal(false);

    // Special message for AI Agent investment
    if (selectedOpportunity === "ai-agent") {
      setSuccessMessage(
        "🎉 Congratulations! You've successfully invested in our AI Agent technology. Welcome to the future!"
      );
    } else {
      setSuccessMessage("Investment successfully added to portfolio!");
    }

    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleViewDetails = (investorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const investor = getInvestorById(investorId);
    if (investor) {
      setSelectedInvestorDetails(investor);
      setDetailsModal(true);
    }
  };

  const getRiskColor = (riskTolerance: string) => {
    switch (riskTolerance) {
      case "low":
        return "bg-green-500/10 text-green-400 border border-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
      case "high":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
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
      console.error("Failed to get portfolio:", error);
      return null;
    }
  };

  const selectedInvestorData = selectedInvestor
    ? getInvestorById(selectedInvestor)
    : null;
  const portfolio = getSelectedInvestorPortfolio();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold gradient-text">
            Investor Launchpad
          </h1>
          <p className="text-gray-400">
            Select an investor profile to manage investments
          </p>
        </div>

        {successMessage && (
          <div
            className={`rounded-lg p-4 ${
              successMessage.includes("AI Agent")
                ? "bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-white"
                : "bg-green-500/10 border border-green-500/20 text-green-400"
            } transition-all duration-300`}
          >
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
              <h3 className="mt-4 text-lg font-medium text-white">
                No investors found
              </h3>
              <p className="mt-2 text-gray-400 max-w-md mx-auto">
                Start your investment journey by creating a new investor profile
                with custom risk tolerance and focus areas.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => (window.location.href = "/create")}
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
                              <div className="text-sm font-medium text-white flex items-center">
                                {investor.name}
                                {investor.details && (
                                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-[#00F5A0]/10 text-[#00F5A0]">
                                    <DocumentTextIcon className="h-3 w-3 mr-0.5" />
                                    Details
                                  </span>
                                )}
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
                            {investor.investmentFocus
                              .slice(0, 2)
                              .map((focus, idx) => (
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
                          <div className="flex space-x-2">
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
                            <button
                              className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white px-3 py-1 rounded-md text-sm transition-colors flex items-center group relative"
                              onClick={(e) => handleViewDetails(investor.id, e)}
                            >
                              <DocumentTextIcon className="h-4 w-4 mr-1" />
                              Details
                              {investor.details && (
                                <div className="absolute left-0 bottom-full mb-2 w-60 bg-[#1A1A1A] border border-[#3A3A3A] rounded-md p-2 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 shadow-lg">
                                  {investor.details.length > 80
                                    ? `${investor.details.substring(0, 80)}...`
                                    : investor.details}
                                </div>
                              )}
                            </button>
                          </div>
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
              <h2 className="text-xl font-semibold text-white">
                {selectedInvestorData.name}'s Investment Dashboard
              </h2>
              <div className="text-gray-400 text-sm flex items-center">
                <div className="h-3 w-3 rounded-full bg-[#00F5A0] mr-2"></div>
                <span>Active Agent</span>
              </div>
            </div>

            {/* Investment Categories Accordion */}
            <div className="space-y-4">
              {/* Investment Opportunities Section */}
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
                <button
                  className="w-full px-6 py-4 flex justify-between items-center border-b border-[#2A2A2A]"
                  onClick={() => toggleSection("opportunities")}
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-[#00F5A0]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                    <span className="text-white font-semibold">
                      Currently investing Projects
                    </span>
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                      {agentOpportunities.length}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${
                      expandedSection === "opportunities" ||
                      expandedSection === "both"
                        ? "rotate-180"
                        : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {(expandedSection === "opportunities" ||
                  expandedSection === "both") && (
                  <div className="p-6">
                    {/* 투자 비율 요약 섹션 추가 */}
                    <div className="mb-6">
                      <h3 className="text-white text-lg font-semibold mb-3">
                        Portfolio Allocation
                      </h3>
                      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
                        <div className="flex flex-col justify-between items-center">
                          {/* 바 차트 표현 */}
                          <div className="w-full space-y-4">
                            {agentOpportunities.map((opp, index) => {
                              const allocation =
                                opp.allocation ||
                                Math.floor(100 / agentOpportunities.length);
                              // 색상 배열
                              const colors = [
                                "from-[#00F5A0] to-[#00D9F5]",
                                "from-purple-500 to-blue-500",
                                "from-yellow-500 to-orange-500",
                              ];

                              return (
                                <div key={opp.id} className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                      <div
                                        className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                                          colors[index % colors.length]
                                        } mr-2`}
                                      ></div>
                                      <span className="text-white text-sm">
                                        {opp.name}
                                      </span>
                                    </div>
                                    <span className="text-[#00F5A0] font-medium">
                                      {allocation}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-[#2A2A2A] rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full bg-gradient-to-r ${
                                        colors[index % colors.length]
                                      }`}
                                      style={{ width: `${allocation}%` }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {agentOpportunities.map((opportunity, index) => {
                        // 색상 배열
                        const colors = [
                          "from-[#00F5A0] to-[#00D9F5]",
                          "from-purple-500 to-blue-500",
                          "from-yellow-500 to-orange-500",
                        ];

                        return (
                          <div
                            key={opportunity.id}
                            className="bg-[#222] border border-[#2A2A2A] rounded-xl overflow-hidden hover:border-[#00F5A0]/50 transition-all duration-300"
                          >
                            <div className="p-6">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="text-white font-semibold text-lg">
                                    {opportunity.name}
                                  </h3>
                                  <p className="text-gray-400 text-sm mb-2">
                                    {opportunity.category}
                                  </p>
                                </div>
                                <span
                                  className={`h-fit px-2 py-1 text-xs rounded-full ${getRiskColor(
                                    opportunity.riskLevel
                                  )}`}
                                >
                                  {opportunity.riskLevel}
                                </span>
                              </div>

                              {/* 비율 표시 배지 추가 */}
                              <div
                                className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${
                                  colors[index % colors.length]
                                } bg-opacity-10 text-white`}
                              >
                                <span className="text-white font-medium">
                                  Allocation:{" "}
                                  {opportunity.allocation ||
                                    Math.floor(100 / agentOpportunities.length)}
                                  %
                                </span>
                              </div>

                              <p className="text-gray-300 text-sm mt-4">
                                {opportunity.description}
                              </p>

                              <div className="mt-6 space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">
                                    Expected Return:
                                  </span>
                                  <span className="text-green-400 font-medium">
                                    {opportunity.expectedReturn}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">
                                    Min Investment:
                                  </span>
                                  <span className="text-white">
                                    $
                                    {opportunity.minInvestment.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">
                                    Progress:
                                  </span>
                                  <span className="text-white">
                                    {Math.round(
                                      (opportunity.totalRaised /
                                        opportunity.targetAmount) *
                                        100
                                    )}
                                    %
                                  </span>
                                </div>
                              </div>

                              <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full bg-gradient-to-r from-[#00F5A0] to-[#00D9F5]"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      Math.round(
                                        (opportunity.totalRaised /
                                          opportunity.targetAmount) *
                                          100
                                      )
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Agent Investment Section */}
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
                <button
                  className="w-full px-6 py-4 flex justify-between items-center border-b border-[#2A2A2A]"
                  onClick={() => toggleSection("ai-agent")}
                >
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mr-2">
                      <span className="text-white font-bold text-xs">AI</span>
                    </div>
                    <span className="text-white font-semibold gradient-text-special">
                      0g AI Agent Investment
                    </span>
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Premium
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${
                      expandedSection === "ai-agent" ||
                      expandedSection === "both"
                        ? "rotate-180"
                        : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {(expandedSection === "ai-agent" ||
                  expandedSection === "both") && (
                  <div className="p-6 gradient-border-enhanced">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mr-4">
                            <span className="text-white font-bold text-xl">
                              AI
                            </span>
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold gradient-text-special">
                              Invest in 0g AI Agent
                            </h2>
                            <p className="text-gray-400 text-sm">
                              Premium investment opportunity - Limited
                              availability
                            </p>
                          </div>
                        </div>
                        <p className="text-white">
                          Direct investment in our proprietary AI agent
                          technology. Become a stakeholder in the future of
                          intelligent autonomous systems that are
                          revolutionizing markets worldwide.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                          <div className="bg-[#242424] rounded-lg p-3">
                            <p className="text-gray-400 text-sm">
                              Expected Return
                            </p>
                            <p className="text-[#00F5A0] font-bold text-xl">
                              42%
                            </p>
                          </div>
                          <div className="bg-[#242424] rounded-lg p-3">
                            <p className="text-gray-400 text-sm">Risk Level</p>
                            <p className="text-yellow-400 font-medium">
                              Medium
                            </p>
                          </div>
                          <div className="bg-[#242424] rounded-lg p-3">
                            <p className="text-gray-400 text-sm">Minimum</p>
                            <p className="text-white font-medium">$20,000</p>
                          </div>
                          <div className="bg-[#242424] rounded-lg p-3">
                            <p className="text-gray-400 text-sm">
                              Funding Progress
                            </p>
                            <p className="text-white font-medium">68%</p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full md:w-auto flex flex-col space-y-4">
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div
                            className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                            style={{ width: "68%" }}
                          ></div>
                        </div>
                        <button
                          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg shadow-glow hover:shadow-glow-intense transition-all duration-300 text-lg"
                          onClick={() => {
                            if (!selectedInvestor) {
                              setSuccessMessage(
                                "Please select an investor profile first to invest in AI Agent"
                              );
                              setTimeout(() => setSuccessMessage(""), 3000);
                              return;
                            }
                            setSelectedOpportunity("ai-agent");
                            setInvestmentAmount(20000);
                            setInvestmentModal(true);
                          }}
                        >
                          Invest in AI Agent
                        </button>
                        <p className="text-center text-gray-400 text-sm">
                          Only 32% allocation remaining
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Investment Modal */}
        {investmentModal && selectedInvestor && selectedOpportunity && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div
              className={`bg-[#1A1A1A] border ${
                selectedOpportunity === "ai-agent"
                  ? "border-purple-500/30"
                  : "border-[#2A2A2A]"
              } rounded-xl p-6 max-w-md w-full`}
            >
              <h2 className="text-white text-xl font-semibold mb-4">
                {selectedOpportunity === "ai-agent"
                  ? "Invest in 0g AI Agent"
                  : "Make Investment"}
              </h2>

              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Investment Amount ($)
                </label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  className={`w-full bg-[#242424] border ${
                    selectedOpportunity === "ai-agent"
                      ? "border-purple-500/30 focus:border-purple-500"
                      : "border-[#333] focus:border-[#00F5A0]"
                  } rounded-lg px-4 py-3 text-white focus:outline-none`}
                  min={
                    selectedOpportunity === "ai-agent"
                      ? 20000
                      : agentOpportunities.find(
                          (o) => o.id === selectedOpportunity
                        )?.minInvestment || 0
                  }
                  max={selectedInvestorData?.maxInvestmentAmount || 1000000}
                />
              </div>

              {selectedOpportunity === "ai-agent" && (
                <div className="mb-6 bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-sm">
                  <p className="text-white">
                    By investing in 0g AI Agent technology, you're becoming a
                    direct stakeholder in our proprietary AI systems. This
                    investment grants you:
                  </p>
                  <ul className="mt-2 text-gray-300 space-y-1 list-disc pl-5">
                    <li>Premium access to future AI agent features</li>
                    <li>
                      Priority allocation in upcoming investment opportunities
                    </li>
                    <li>
                      Quarterly performance reports and technology insights
                    </li>
                  </ul>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setInvestmentModal(false)}
                  className="px-4 py-2 border border-[#333] text-white rounded-lg hover:bg-[#2A2A2A] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvest}
                  className={`px-4 py-2 font-semibold rounded-lg transition-all duration-300 ${
                    selectedOpportunity === "ai-agent"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-glow"
                      : "bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-black hover:from-[#00D9F5] hover:to-[#00F5A0]"
                  }`}
                >
                  Confirm Investment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {detailsModal && selectedInvestorDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-xl font-semibold">
                  Investor Details
                </h2>
                <button
                  onClick={() => setDetailsModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-[#00F5A0]/20 to-[#00D9F5]/20 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {selectedInvestorDetails.name.substring(0, 2)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-white font-semibold">
                        {selectedInvestorDetails.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${getRiskColor(
                          selectedInvestorDetails.riskTolerance
                        )}`}
                      >
                        {selectedInvestorDetails.riskTolerance} risk
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-gray-400 text-sm font-medium mb-1">
                    Focus Areas
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedInvestorDetails.investmentFocus.map(
                      (focus, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-xs rounded-full bg-[#333] text-white"
                        >
                          {focus}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-gray-400 text-sm font-medium mb-1">
                    Investment Range
                  </h4>
                  <p className="text-white">
                    $
                    {selectedInvestorDetails.minInvestmentAmount.toLocaleString()}{" "}
                    - $
                    {selectedInvestorDetails.maxInvestmentAmount.toLocaleString()}
                  </p>
                </div>

                <div>
                  <h4 className="text-gray-400 text-sm font-medium mb-1">
                    Description
                  </h4>
                  <p className="text-white text-sm">
                    {selectedInvestorDetails.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-gray-400 text-sm font-medium mb-1">
                    Additional Details
                  </h4>
                  <p className="text-white text-sm">
                    {selectedInvestorDetails.details}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
