import { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [stats] = useState({
    totalInvestors: 12,
    totalInvestments: 45,
    totalValue: '$1.2M',
    activeInvestors: 8,
  });

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
              Create automated investors that make smart investment decisions for you.
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
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-white">
                  {value}
                </dd>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#2A2A2A]">
            <h3 className="text-lg leading-6 font-medium text-white">
              Recent Activity
            </h3>
          </div>
          <div className="divide-y divide-[#2A2A2A]">
            {[1, 2, 3].map((item) => (
              <li key={item} className="px-6 py-4 hover:bg-[#2A2A2A]/50 transition-colors">
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
          </div>
        </div>
      </div>
    </Layout>
  );
}
