import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getAgents } from "../utils/agentStorage";
import { Agent } from "../interfaces/Agent";

const Home = () => {
  const [userAgents, setUserAgents] = useState<Agent[]>([]);

  // Hardcoded featured agents
  const featuredAgents = [
    {
      id: "1",
      name: "Code Assistant Pro",
      description:
        "Expert programming assistant that helps with coding and debugging",
      price: 0.1,
      sales: 150,
      revenue: 15,
      imageUrl: "/images/code-assistant.png",
      chain: "ETH",
      type: "HOT COLLECTION",
    },
    {
      id: "2",
      name: "Writing Master",
      description: "Professional writing assistant for content creation",
      price: 0.08,
      sales: 200,
      revenue: 16,
      imageUrl: "/images/writing-helper.png",
      chain: "SOL",
      type: "HOT COLLECTION",
    },
    {
      id: "3",
      name: "Data Analyst AI",
      description: "AI agent specialized in data analysis and visualization",
      price: 0.15,
      sales: 120,
      revenue: 18,
      imageUrl: "/images/data-analyst.png",
      chain: "BTC",
      type: "HOT COLLECTION",
    },
    {
      id: "4",
      name: "Marketing Expert",
      description: "AI-powered marketing strategy and content generator",
      price: 0.12,
      sales: 180,
      revenue: 21.6,
      imageUrl: "/images/marketing-expert.png",
    },
    {
      id: "5",
      name: "Design Assistant",
      description: "Creative AI helper for graphic and UI design",
      price: 0.09,
      sales: 160,
      revenue: 14.4,
      imageUrl: "/images/design-assistant.png",
    },
    {
      id: "6",
      name: "Research Helper",
      description: "Academic research and paper writing assistant",
      price: 0.11,
      sales: 140,
      revenue: 15.4,
      imageUrl: "/images/research-helper.png",
    },
  ];

  // Load user-created agents from localStorage on component mount
  useEffect(() => {
    const loadedAgents = getAgents();
    setUserAgents(loadedAgents);
  }, []);

  // Combine featured and user-created agents
  const allAgents = [...userAgents, ...featuredAgents];

  const topCollections = [
    {
      id: "1",
      name: "Code Assistant Pro",
      floor: 42.5,
      topOffer: "--",
      floorChange: "--",
      volume: "4.1K",
      sales: 3,
      listed: "10.4%",
      chain: "ETH",
      imageUrl: "/images/code-assistant.png",
    },
    {
      id: "2",
      name: "Writing Master",
      floor: 38,
      topOffer: 0.021,
      floorChange: "+2.7%",
      volume: "4M",
      sales: "11.7K",
      listed: "7.4%",
      chain: "POL",
      imageUrl: "/images/writing-helper.png",
    },
    {
      id: "3",
      name: "Data Analyst AI",
      floor: 14.3,
      topOffer: 13.87,
      floorChange: "+0.4%",
      volume: "178.9",
      sales: 12,
      listed: "3%",
      chain: "ETH",
      imageUrl: "/images/data-analyst.png",
    },
    {
      id: "4",
      name: "Marketing Expert",
      floor: 29.8,
      topOffer: 27.5,
      floorChange: "+1.8%",
      volume: "2.3K",
      sales: 125,
      listed: "5.2%",
      chain: "SOL",
      imageUrl: "/images/marketing-expert.png",
    },
    {
      id: "5",
      name: "Design Assistant",
      floor: 18.6,
      topOffer: 17.9,
      floorChange: "+3.2%",
      volume: "980",
      sales: 52,
      listed: "8.7%",
      chain: "ETH",
      imageUrl: "/images/design-assistant.png",
    },
    {
      id: "6",
      name: "Research Helper",
      floor: 22.4,
      topOffer: 21.0,
      floorChange: "+0.9%",
      volume: "1.5K",
      sales: 78,
      listed: "6.3%",
      chain: "BTC",
      imageUrl: "/images/research-helper.png",
    },
    {
      id: "7",
      name: "Financial Advisor",
      floor: 51.2,
      topOffer: 48.7,
      floorChange: "+4.5%",
      volume: "3.7K",
      sales: 42,
      listed: "4.1%",
      chain: "ETH",
      imageUrl: "/images/code-assistant.png",
    },
    {
      id: "8",
      name: "Travel Planner",
      floor: 15.8,
      topOffer: 14.9,
      floorChange: "+2.1%",
      volume: "890",
      sales: 63,
      listed: "9.2%",
      chain: "SOL",
      imageUrl: "/images/writing-helper.png",
    },
    {
      id: "9",
      name: "Recipe Generator",
      floor: 12.4,
      topOffer: 11.8,
      floorChange: "+1.2%",
      volume: "650",
      sales: 97,
      listed: "12.5%",
      chain: "POL",
      imageUrl: "/images/data-analyst.png",
    },
    {
      id: "10",
      name: "Fitness Coach",
      floor: 35.9,
      topOffer: 33.2,
      floorChange: "+5.7%",
      volume: "2.8K",
      sales: 104,
      listed: "3.8%",
      chain: "BTC",
      imageUrl: "/images/marketing-expert.png",
    },
  ];

  const topEarners = [...allAgents]
    .filter((agent) => "revenue" in agent)
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section with CTA */}
      <div className="bg-black border-b border-[#2a1237] shadow-md">
        <div className="w-full max-w-[1920px] mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#c83ddd] to-[#8742f5]">
              AI Agent Marketplace
            </h1>
            <div className="flex space-x-4">
              <Link
                href="/trade"
                className="bg-[#1a1a1a] hover:bg-[#252525] text-white px-6 py-2 rounded-lg font-medium transition-colors border border-[#2a1237]"
              >
                Trade
              </Link>
              <Link
                href="/create"
                className="bg-[#1a1a1a] hover:bg-[#252525] text-white px-6 py-2 rounded-lg font-medium transition-colors border border-[#2a1237]"
              >
                Create
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Collections Slider */}
      <div className="py-12 bg-[#0a0a0a]">
        <div className="w-full max-w-[1920px] mx-auto px-6 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Featured Agents
          </h2>

          {userAgents.length > 0 && (
            <p className="text-gray-400 mt-2">
              Including {userAgents.length} user-created agent(s)
            </p>
          )}
        </div>

        <div className="relative w-full max-w-[1920px] mx-auto overflow-hidden px-6">
          {/* Left Arrow */}
          <button
            onClick={() => {
              const container = document.getElementById("agent-container");
              if (container) {
                container.scrollBy({ left: -420, behavior: "smooth" });
              }
            }}
            className="absolute left-8 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center border border-[#2a1237] hover:bg-[#2a1237] transition-colors"
            aria-label="Previous"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Agent Cards Container */}
          <div
            id="agent-container"
            className="flex overflow-x-auto scroll-smooth gap-6 no-scrollbar pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {allAgents.map((agent) => {
              // Prepare data for rendering - ensure both user and featured agents have the same structure
              const agentDisplay = {
                id: agent.id,
                name: agent.name,
                imageUrl: agent.imageUrl,
                type: "type" in agent ? agent.type : "USER CREATED",
                chain: "chain" in agent ? agent.chain : "ETH",
              };

              return (
                <div
                  key={agentDisplay.id}
                  className="flex-none w-[320px] bg-[#121212] rounded-xl overflow-hidden hover:shadow-[0_0_15px_rgba(74,32,120,0.4)] transition-all duration-300 cursor-pointer transform hover:scale-[1.02] border border-[#2a1237]"
                >
                  <div className="h-[320px] relative">
                    <img
                      src={agentDisplay.imageUrl}
                      alt={agentDisplay.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                      <h3 className="text-xl font-bold text-white">
                        {agentDisplay.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-3">
                        {agentDisplay.type && (
                          <span className="text-xs font-medium text-white px-2 py-1 bg-[#2a1237] rounded-full">
                            {agentDisplay.type}
                          </span>
                        )}
                        <span className="text-xs font-medium px-2 py-1 bg-[#2a1237] rounded-full text-white">
                          {agentDisplay.chain}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => {
              const container = document.getElementById("agent-container");
              if (container) {
                container.scrollBy({ left: 420, behavior: "smooth" });
              }
            }}
            className="absolute right-8 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center border border-[#2a1237] hover:bg-[#2a1237] transition-colors"
            aria-label="Next"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Top Collections Table */}
      <div className="w-full max-w-[1920px] mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Top AI Agents
          </h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm bg-[#1a1a1a] text-white rounded-lg hover:bg-[#252525] transition-colors border border-[#2a1237]">
              1d
            </button>
            <button className="px-4 py-2 text-sm bg-[#1a1a1a] text-white rounded-lg hover:bg-[#252525] transition-colors border border-[#2a1237]">
              7d
            </button>
            <button className="px-4 py-2 text-sm bg-[#1a1a1a] text-white rounded-lg hover:bg-[#252525] transition-colors border border-[#2a1237]">
              30d
            </button>
          </div>
        </div>
        <div className="bg-[#121212] rounded-xl overflow-hidden shadow-lg border border-[#2a1237]">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-[#2a1237]">
                <th className="px-6 py-4 text-left text-xs font-medium text-[#a370db] uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#a370db] uppercase tracking-wider">
                  Collection
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#a370db] uppercase tracking-wider">
                  Floor
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#a370db] uppercase tracking-wider">
                  Top Offer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#a370db] uppercase tracking-wider">
                  Floor 1d %
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#a370db] uppercase tracking-wider">
                  Volume
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#a370db] uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#a370db] uppercase tracking-wider">
                  Listed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a1237]">
              {topCollections.map((collection, index) => (
                <tr
                  key={collection.id}
                  className="hover:bg-[#1a1a1a] cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-12 rounded-full border border-[#2a1237]"
                        src={collection.imageUrl}
                        alt=""
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {collection.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-white">
                      {collection.floor} {collection.chain}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {collection.topOffer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">
                    {collection.floorChange}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {collection.volume} {collection.chain}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {collection.sales}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {collection.listed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
