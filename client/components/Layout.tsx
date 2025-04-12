import { ReactNode } from "react";
import Navbar from "./Navbar";
import toast, { Toaster } from "react-hot-toast";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#0A0A0A] to-[#2A2A2A] opacity-100 z-0" />
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 py-8 pt-24">{children}</main>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1A1A1A",
              color: "#fff",
              border: "1px solid #2A2A2A",
            },
          }}
        />
      </div>
    </div>
  );
}
