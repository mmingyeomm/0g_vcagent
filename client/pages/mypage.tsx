import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import {
  getInvestments,
  Investment,
  getPortfolioByInvestorId,
  Portfolio,
} from "../utils/portfolioStorage";
import { getInvestors, Investor } from "../utils/investorStorage";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronDownIcon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

// Investment opportunity interface
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
  allocation?: number;
}

// Project interface
interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  allocation: number;
  expectedReturn: number;
  riskLevel: string;
  minInvestment: number;
  progress: number;
}

export default function MyPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [aiAgents, setAiAgents] = useState<Investor[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedAgentForVote, setSelectedAgentForVote] =
    useState<Investor | null>(null);
  const [voteConfirmation, setVoteConfirmation] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showCreatePromptModal, setShowCreatePromptModal] = useState(false);
  const [newPromptText, setNewPromptText] = useState("");
  const [promptCreationConfirmation, setPromptCreationConfirmation] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    // Get all investors (AI agents)
    const allInvestors = getInvestors();
    setAiAgents(allInvestors);

    // Define projects for investments
    const defaultProjects: Project[] = [
      {
        id: "1",
        name: "Smart City Infrastructure",
        category: "Infrastructure",
        description: "IoT solutions for urban development and smart cities",
        allocation: 18,
        expectedReturn: 18,
        riskLevel: "low",
        minInvestment: 40000,
        progress: 54,
      },
      {
        id: "2",
        name: "Blockchain Supply Chain",
        category: "Logistics",
        description: "Decentralized supply chain management solutions",
        allocation: 41,
        expectedReturn: 32,
        riskLevel: "medium",
        minInvestment: 20000,
        progress: 46,
      },
      {
        id: "3",
        name: "Sustainable Agriculture Tech",
        category: "Agriculture",
        description:
          "AI-driven solutions for sustainable farming and agriculture",
        allocation: 41,
        expectedReturn: 22,
        riskLevel: "medium",
        minInvestment: 30000,
        progress: 49,
      },
    ];

    setProjects(defaultProjects);

    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const handleAgentSelect = (agentId: string) => {
    if (selectedAgent === agentId) {
      setSelectedAgent(null);
    } else {
      setSelectedAgent(agentId);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage > 0) return "text-green-400";
    if (percentage < 0) return "text-red-400";
    return "text-gray-400";
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
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

  // Generate random performance percentage
  const getRandomPerformance = (min: number, max: number) => {
    return +(Math.random() * (max - min) + min).toFixed(2);
  };

  const handleVoteButtonClick = (agent: Investor) => {
    setSelectedAgentForVote(agent);
    setShowVoteModal(true);
    setVoteConfirmation(null);
  };

  const closeVoteModal = () => {
    setShowVoteModal(false);
    setSelectedAgentForVote(null);

    // Clear vote confirmation after a delay
    setTimeout(() => {
      setVoteConfirmation(null);
    }, 3000);
  };

  const handleVote = (vote: "yes" | "no") => {
    // Handle the vote logic here
    console.log(`Voted ${vote} for agent ${selectedAgentForVote?.name}`);
    setVoteConfirmation({
      message: `성공적으로 ${vote === "yes" ? "찬성" : "반대"} 투표하였습니다.`,
      type: "success",
    });

    // Close modal after a short delay to show the confirmation
    setTimeout(() => {
      closeVoteModal();
    }, 1500);
  };

  const openCreatePromptModal = () => {
    setShowCreatePromptModal(true);
    setNewPromptText("");
    setPromptCreationConfirmation(null);
  };

  const closeCreatePromptModal = () => {
    setShowCreatePromptModal(false);
  };

  const handleCreatePrompt = () => {
    if (!newPromptText.trim()) {
      setPromptCreationConfirmation({
        message: "프롬프트 내용을 입력해주세요.",
        type: "error",
      });
      return;
    }

    console.log("New prompt created:", newPromptText);
    setPromptCreationConfirmation({
      message:
        "프롬프트 업데이트가 성공적으로 생성되었습니다. 심사 후 투표가 진행됩니다.",
      type: "success",
    });

    // Close modal immediately to show confirmation at top of page
    closeCreatePromptModal();

    // Clear prompt creation confirmation after a delay
    setTimeout(() => {
      setPromptCreationConfirmation(null);
    }, 5000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0A0A] text-white pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                My AI Agent Dashboard
              </h1>
              <p className="text-gray-400">
                View the performance of your AI agents
              </p>
            </div>
          </div>

          {/* Prompt Creation Confirmation - at the top of the page */}
          {promptCreationConfirmation && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                promptCreationConfirmation.type === "success"
                  ? "bg-green-500/20 border border-green-500/30 text-green-400"
                  : "bg-red-500/20 border border-red-500/30 text-red-400"
              } animate-fade-in`}
            >
              {promptCreationConfirmation.message}
            </div>
          )}

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00F5A0] mx-auto"></div>
              <p className="mt-4 text-gray-400">
                Loading your AI agent data...
              </p>
            </div>
          ) : (
            <>
              {/* AI Agent List */}
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden gradient-border mb-8">
                <div className="px-6 py-4 border-b border-[#2A2A2A]">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <ChartBarIcon className="w-5 h-5 mr-2 text-[#00F5A0]" />
                    <span>My AI Agents</span>
                  </h2>
                </div>

                <div className="divide-y divide-[#2A2A2A]">
                  {aiAgents.map((agent) => {
                    const performance = getRandomPerformance(15, 30);

                    return (
                      <div key={agent.id}>
                        <div className="px-6 py-4">
                          <div
                            className="flex justify-between items-center cursor-pointer hover:bg-[#222] pb-4"
                            onClick={() => handleAgentSelect(agent.id)}
                          >
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] flex items-center justify-center mr-3">
                                <span className="text-white font-bold">
                                  {agent.name.substring(0, 2)}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white">
                                  {agent.name}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                  {agent.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-8">
                              <div className="text-right">
                                <p className="text-gray-400 text-xs">
                                  Invested
                                </p>
                                <p className="text-white font-medium">
                                  {formatCurrency(agent.maxInvestmentAmount)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-400 text-xs">
                                  Performance
                                </p>
                                <p
                                  className={`font-medium ${getPerformanceColor(
                                    performance
                                  )}`}
                                >
                                  +{performance.toFixed(2)}%
                                </p>
                              </div>
                              <ChevronDownIcon
                                className={`w-5 h-5 text-gray-400 transition-transform ${
                                  selectedAgent === agent.id
                                    ? "transform rotate-180"
                                    : ""
                                }`}
                              />
                            </div>
                          </div>

                          {/* Vote Button */}
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVoteButtonClick(agent);
                              }}
                              className="text-sm bg-[#242424] hover:bg-[#333] text-[#00F5A0] font-medium py-2 px-4 rounded-lg border border-[#333] transition-colors"
                            >
                              Vote for prompt update
                            </button>
                          </div>
                        </div>

                        {/* Projects List (expanded) */}
                        {selectedAgent === agent.id && (
                          <div className="bg-[#1A1A1A] p-6 border-t border-[#2A2A2A]">
                            <h3 className="text-lg font-medium text-white mb-6">
                              Investment Projects
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {projects.map((project) => (
                                <div
                                  key={project.id}
                                  className="bg-[#242424] border border-[#333] rounded-lg overflow-hidden"
                                >
                                  <div className="px-5 py-4 flex justify-between items-center">
                                    <h4 className="text-lg font-medium text-white">
                                      {project.name}
                                    </h4>
                                    <span
                                      className={`px-2 py-1 text-xs rounded-full ${getRiskColor(
                                        project.riskLevel
                                      )}`}
                                    >
                                      {project.riskLevel}
                                    </span>
                                  </div>

                                  <div className="px-5 py-3 border-t border-[#333] text-sm text-gray-400">
                                    {project.category}
                                  </div>

                                  <div className="px-5 py-3">
                                    <div className="bg-gradient-to-r from-[#00F5A0]/20 to-[#00D9F5]/20 px-3 py-2 rounded-lg mb-4">
                                      <p className="text-white text-sm">
                                        {project.description}
                                      </p>
                                    </div>

                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-green-400 font-medium bg-[#00F5A0]/10 px-2 py-1 rounded-lg">
                                        Allocation: {project.allocation}%
                                      </span>
                                    </div>

                                    <div className="space-y-4">
                                      <div>
                                        <div className="flex justify-between text-sm mb-1">
                                          <span className="text-gray-400">
                                            Expected Return:
                                          </span>
                                          <span className="text-green-400">
                                            {project.expectedReturn}%
                                          </span>
                                        </div>
                                      </div>

                                      <div>
                                        <div className="flex justify-between text-sm mb-1">
                                          <span className="text-gray-400">
                                            Min Investment:
                                          </span>
                                          <span className="text-white">
                                            {formatCurrency(
                                              project.minInvestment
                                            )}
                                          </span>
                                        </div>
                                      </div>

                                      <div>
                                        <div className="flex justify-between text-sm mb-1">
                                          <span className="text-gray-400">
                                            Progress:
                                          </span>
                                          <span className="text-white">
                                            {project.progress}%
                                          </span>
                                        </div>
                                        <div className="w-full bg-[#333] rounded-full h-2 overflow-hidden">
                                          <div
                                            className="h-2 rounded-full bg-gradient-to-r from-[#00F5A0] to-[#00D9F5]"
                                            style={{
                                              width: `${project.progress}%`,
                                            }}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Vote Modal */}
        {showVoteModal && selectedAgentForVote && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl w-full max-w-lg overflow-hidden transform transition-all animate-scale-in">
              <div className="p-6 border-b border-[#2A2A2A] flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">
                  Vote for Prompt Update
                </h3>
                <button
                  onClick={closeVoteModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {voteConfirmation ? (
                  <div
                    className={`p-4 mb-6 rounded-lg ${
                      voteConfirmation.type === "success"
                        ? "bg-green-500/20 border border-green-500/20 text-green-400"
                        : "bg-red-500/20 border border-red-500/20 text-red-400"
                    } animate-fade-in text-center`}
                  >
                    {voteConfirmation.message}
                  </div>
                ) : (
                  <>
                    <div className="bg-[#242424] p-4 rounded-lg mb-6 border border-[#333]">
                      <p className="text-white">
                        "Increase the importance of the DeFi section by 10%."
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-gray-400 text-sm mb-3">
                        Your Voting Power
                      </h4>
                      <div className="bg-[#242424] p-4 rounded-lg border border-[#333]">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">
                            Your Voting Power:
                          </span>
                          <span className="text-white font-medium">
                            {formatCurrency(
                              selectedAgentForVote.maxInvestmentAmount
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">
                            Total Voting Power:
                          </span>
                          <span className="text-white font-medium">
                            {formatCurrency(100000)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Your Percentage:
                          </span>
                          <span className="text-[#00F5A0] font-medium">
                            {(
                              (selectedAgentForVote.maxInvestmentAmount /
                                100000) *
                              100
                            ).toFixed(2)}
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4 mb-6">
                      <button
                        onClick={() => handleVote("yes")}
                        className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 font-medium py-3 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all transform hover:scale-105"
                      >
                        Vote Yes
                      </button>
                      <button
                        onClick={() => handleVote("no")}
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 font-medium py-3 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-all transform hover:scale-105"
                      >
                        Vote No
                      </button>
                    </div>

                    <div className="bg-[#242424] p-4 rounded-lg border border-[#333]">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Due Date:</span>
                        <span className="text-white">
                          {new Date(
                            Date.now() + 3 * 24 * 60 * 60 * 1000
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        투표는 7일 동안 진행됩니다.
                      </p>
                    </div>
                  </>
                )}

                {/* Create New Prompt Update Button (inside vote modal) */}
                <div className="mt-6 pt-6 border-t border-[#2A2A2A] flex justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeVoteModal();
                      openCreatePromptModal();
                    }}
                    className="flex items-center text-sm bg-[#242424] hover:bg-[#333] text-[#00F5A0] font-medium py-2 px-4 rounded-lg border border-[#333] transition-colors"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create New Prompt Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Prompt Modal */}
        {showCreatePromptModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl w-full max-w-lg overflow-hidden transform transition-all animate-scale-in">
              <div className="p-6 border-b border-[#2A2A2A] flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">
                  Create New Prompt Update
                </h3>
                <button
                  onClick={closeCreatePromptModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <label
                    htmlFor="promptText"
                    className="block text-gray-400 text-sm mb-2"
                  >
                    Prompt Update Content
                  </label>
                  <textarea
                    id="promptText"
                    rows={4}
                    className="w-full bg-[#242424] border border-[#333] rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00F5A0]/50"
                    placeholder="Enter your prompt update suggestion..."
                    value={newPromptText}
                    onChange={(e) => setNewPromptText(e.target.value)}
                  ></textarea>
                </div>

                <div className="bg-[#242424] p-4 rounded-lg border border-[#333] mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Voting Period:</span>
                    <span className="text-white">7 days</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    투표는 7일 동안 진행됩니다.
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleCreatePrompt}
                    className="bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-black font-medium py-2 px-6 rounded-lg transition-all transform hover:scale-105 hover:shadow-glow"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
