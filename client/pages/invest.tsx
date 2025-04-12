import { useState, useEffect } from "react";
import { Agent } from "../interfaces/Agent";
import Navbar from "../components/Navbar";
import { getAgents } from "../utils/agentStorage";
import Link from "next/link";

const Trade = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Code Assistant",
      description: "Helps with coding and debugging",
      prompt: "You are an expert programming assistant...",
      creator: "0x123...",
      vaultAddress: "0x123...",
      commission: "10",
      imageUrl: "/images/code-assistant.png",
      createdAt: new Date(),
    },
    // Add more sample agents
  ]);

  // Load user-created agents from localStorage
  useEffect(() => {
    const userAgents = getAgents();
    if (userAgents.length > 0) {
      // Combine with default agents
      setAgents((prevAgents) => [...userAgents, ...prevAgents]);
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Trade AI Agents</h1>

        {agents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <img
                  src={agent.imageUrl}
                  alt={agent.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-bold mb-2">{agent.name}</h2>
                <p className="text-gray-600 mb-4">{agent.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    {agent.vaultAddress}
                  </span>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No agents found</p>
            <Link
              href="/create"
              className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Create an Agent
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trade;
