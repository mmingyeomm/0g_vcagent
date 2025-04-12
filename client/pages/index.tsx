import { useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { ArrowRightIcon, TrophyIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [stats] = useState({
    totalInvestors: 12,
    totalInvestments: 45,
    totalValue: "$1.2M",
    activeInvestors: 8,
  });

  // Dummy data for top profitable investments
  const [topProfitableInvestments] = useState([
    {
      id: 1,
      name: "AI Healthcare Platform",
      profit: 42.8,
      category: "Healthcare",
    },
    {
      id: 2,
      name: "Renewable Energy Storage",
      profit: 36.5,
      category: "Energy",
    },
    { id: 3, name: "Quantum Computing", profit: 31.2, category: "Technology" },
    {
      id: 4,
      name: "Fintech Payment Solution",
      profit: 28.7,
      category: "Finance",
    },
    {
      id: 5,
      name: "Sustainable Agriculture",
      profit: 24.9,
      category: "Agriculture",
    },
  ]);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-[#1A1A1A] p-8 border border-[#2A2A2A]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00F5A0]/10 to-[#00D9F5]/10" />
          <div className="relative">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] bg-clip-text text-transparent mb-4">
              Welcome to Investor Launchpad
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Create automated investors that make smart investment decisions
              for you.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] hover:from-[#00D9F5] hover:to-[#00F5A0] transition-all duration-300"
            >
              Create New Investor
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(stats).map(([key, value]) => (
            <div
              key={key}
              className="relative overflow-hidden rounded-xl bg-[#1A1A1A] p-6 border border-[#2A2A2A]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F5A0]/5 to-[#00D9F5]/5" />
              <div className="relative">
                <dt className="text-sm font-medium text-gray-400 truncate">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-white">
                  {value}
                </dd>
              </div>
            </div>
          ))}
        </div>
        {/* Top Profitable Investments */}
        <div className="rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#2A2A2A]">
            <h3 className="text-lg leading-6 font-medium text-white flex items-center">
              <TrophyIcon className="w-5 h-5 mr-2 text-yellow-400" />
              Top Profitable Investments
            </h3>
          </div>
          <ul className="divide-y divide-[#2A2A2A]">
            {topProfitableInvestments.map((investment, index) => (
              <li
                key={investment.id}
                className="px-6 py-4 hover:bg-[#2A2A2A]/50 transition-colors list-none"
              >
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full 
                    ${
                      index === 0
                        ? "bg-yellow-400/20 text-yellow-400"
                        : index === 1
                        ? "bg-gray-400/20 text-gray-400"
                        : index === 2
                        ? "bg-amber-700/20 text-amber-700"
                        : "bg-[#2A2A2A] text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-white truncate">
                        {investment.name}
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <span className="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-md bg-[#00F5A0]/10 text-[#00F5A0]">
                          +{investment.profit}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      {investment.category}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-6 py-3 border-t border-[#2A2A2A] bg-[#1A1A1A]/80">
            <Link
              href="/invest"
              className="flex justify-center items-center text-sm text-[#00F5A0] hover:text-[#00D9F5] transition-colors"
            >
              View All Investments
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#2A2A2A]">
            <h3 className="text-lg leading-6 font-medium text-white">
              Recent Activity
            </h3>
          </div>
          <ul className="divide-y divide-[#2A2A2A]">
            {[1, 2, 3, 5, 6, 7, 8, 9, 10].map((item) => (
              <li
                key={item}
                className="px-6 py-4 hover:bg-[#2A2A2A]/50 transition-colors list-none"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-[#00F5A0] truncate">
                    Investor #{item} made a new investment
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#00F5A0]/10 text-[#00F5A0]">
                      Completed
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="flex items-center text-sm text-gray-400">
                      <p>Invested $10,000 in Project X</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0">
                    <p>2 hours ago</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
