import { Agent } from "../interfaces/Agent";

// Key for storing agents in localStorage
const AGENTS_STORAGE_KEY = "vc_agents";

// Get all agents from localStorage
export const getAgents = (): Agent[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const storedAgents = localStorage.getItem(AGENTS_STORAGE_KEY);
  return storedAgents ? JSON.parse(storedAgents) : [];
};

// Add a new agent to localStorage
export const addAgent = (agent: Agent): void => {
  if (typeof window === "undefined") {
    return;
  }

  const agents = getAgents();
  agents.push(agent);
  localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(agents));
};

// Generate a unique ID for a new agent
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Create a function to convert file to base64 for storing in localStorage
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
