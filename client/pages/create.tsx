import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import {
  addAgent,
  generateUniqueId,
  fileToBase64,
} from "../utils/agentStorage";
import { Agent } from "../interfaces/Agent";

const Create = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prompt: "",
    commission: "",
    vaultAddress: "",
    image: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      alert("Please select an image for your agent");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert the image file to base64 for storage
      const imageBase64 = await fileToBase64(formData.image);

      // Create a new agent object
      const newAgent: Agent = {
        id: generateUniqueId(),
        name: formData.name,
        description: formData.description,
        prompt: formData.prompt,
        commission: formData.commission,
        creator: "Current User", // In a real app, this would be the user's wallet address
        vaultAddress: formData.vaultAddress,
        imageUrl: imageBase64,
        createdAt: new Date(),
      };

      // Add the new agent to localStorage
      addAgent(newAgent);

      // Redirect to the home page
      router.push("/");
    } catch (error) {
      console.error("Error creating agent:", error);
      alert("Failed to create agent. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Create AI Agent</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prompt
            </label>
            <textarea
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commission (%)
            </label>
            <div className="relative">
              <input
                type="number"
                name="commission"
                value={formData.commission}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                min="0"
                max="100"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                %
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vault Address
            </label>
            <input
              type="string"
              name="vaultAddress"
              value={formData.vaultAddress}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Agent"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;
