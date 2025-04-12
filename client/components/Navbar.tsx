import Link from "next/link";
import { useState } from "react";
import { connectWallet } from "../utils/wallet";

const Navbar = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>("");

  const handleConnect = async () => {
    try {
      const { address } = await connectWallet();
      setAddress(address);
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
    <nav className="bg-[#111111] text-white">
      <div className="max-w-full px-4">
        <div className="flex items-center h-16 justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold flex items-center">
              <span className="text-white">VC Agent</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/invest" className="hover:text-gray-300">
                Invest
              </Link>
              <Link href="/create" className="hover:text-gray-300">
                Create
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search agents..."
                className="bg-[#222222] text-white px-4 py-2 rounded-lg w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            {!isConnected ? (
              <button
                onClick={handleConnect}
                className="bg-[#FF0099] hover:bg-[#FF1CAC] text-white px-4 py-2 rounded-lg font-medium"
              >
                Connect Wallet
              </button>
            ) : (
              <span className="text-[#FF0099]">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
