import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, WalletIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Create", href: "/create" },
  { name: "Invest", href: "/invest" },
  { name: "My Page", href: "/mypage" },
];

export default function Navbar() {
  const router = useRouter();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const handleConnect = () => {
    // Mock wallet connection
    setWalletConnected(true);
    setWalletAddress(
      "0x" +
        Math.random().toString(16).substring(2, 10) +
        "..." +
        Math.random().toString(16).substring(2, 6)
    );
  };

  const handleDisconnect = () => {
    setWalletConnected(false);
    setWalletAddress("");
  };

  return (
    <Disclosure
      as="nav"
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0A]/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <div className="relative w-8 h-8 mr-2">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] opacity-70"></div>
                    <div className="relative flex items-center justify-center w-full h-full rounded-full bg-[#1A1A1A] text-xl font-bold text-white">
                      I
                    </div>
                  </div>
                  <div className="hidden sm:flex sm:items-center">
                    <span className="text-xl font-bold gradient-text">
                      Investor Launchpad
                    </span>
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[#00F5A0]/10 text-[#00F5A0] border border-[#00F5A0]/20">
                      BETA
                    </span>
                  </div>
                </div>
                <div className="hidden sm:ml-8 sm:flex sm:space-x-2 sm:items-center">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        router.pathname === item.href
                          ? "gradient-text font-medium"
                          : "text-gray-300 hover:text-white hover:bg-[#2A2A2A]/60",
                        "px-3 py-2 rounded-lg text-sm transition-all duration-150 relative"
                      )}
                      aria-current={
                        router.pathname === item.href ? "page" : undefined
                      }
                    >
                      {item.name}
                      {router.pathname === item.href && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00F5A0] to-[#00D9F5]"></span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {!walletConnected ? (
                  <button
                    onClick={handleConnect}
                    className="relative px-4 py-2 rounded-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] opacity-10 hover:opacity-15 transition-opacity duration-200"></div>
                    <div className="absolute inset-0 border border-[#00F5A0]/20 rounded-lg"></div>
                    <div className="relative flex items-center text-white">
                      <WalletIcon className="h-4 w-4 mr-2" />
                      <span>Connect Wallet</span>
                    </div>
                  </button>
                ) : (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full items-center text-sm focus:outline-none focus:ring-1 focus:ring-[#00F5A0] px-3 py-2">
                        <div className="relative px-3 py-2 rounded-lg overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-[#00F5A0]/10 to-[#00D9F5]/10 rounded-lg"></div>
                          <div className="relative flex items-center text-white">
                            <div className="h-3 w-3 bg-green-400 rounded-full mr-2"></div>
                            <span className="text-sm">{walletAddress}</span>
                          </div>
                        </div>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-150"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] shadow-lg ring-1 ring-[#00F5A0]/5 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleDisconnect}
                                className={classNames(
                                  active ? "bg-[#2A2A2A]" : "",
                                  "w-full text-left block px-4 py-2 text-sm text-gray-300 hover:text-white"
                                )}
                              >
                                Disconnect
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile connect wallet button */}
                {!walletConnected ? (
                  <button
                    onClick={handleConnect}
                    className="relative inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:bg-[#2A2A2A] hover:text-white mr-2"
                  >
                    <WalletIcon className="h-5 w-5" />
                  </button>
                ) : (
                  <div className="relative inline-flex items-center justify-center p-2 rounded-lg mr-2">
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                  </div>
                )}
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:bg-[#2A2A2A] hover:text-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden bg-[#1A1A1A]/95 backdrop-blur-md">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    router.pathname === item.href
                      ? "bg-[#2A2A2A]/70 text-white"
                      : "text-gray-300 hover:bg-[#2A2A2A] hover:text-white",
                    "block px-3 py-2 rounded-lg text-base font-medium"
                  )}
                  aria-current={
                    router.pathname === item.href ? "page" : undefined
                  }
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              {walletConnected && (
                <div className="px-3 py-2 mt-2 border-t border-[#2A2A2A]">
                  <div className="flex items-center text-gray-300 text-sm">
                    <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                    {walletAddress}
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="mt-2 w-full flex justify-center px-4 py-2 text-sm font-medium rounded-lg text-gray-300 bg-[#2A2A2A] hover:bg-[#3A3A3A] hover:text-white"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
