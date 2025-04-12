import { ethers } from 'ethers';

const ZERO_G_RPC = 'https://evmrpc-testnet.0g.ai';
const ZERO_G_CHAIN_ID = 16600;
const ZERO_G_CHAIN_NAME = '0G-Newton-Testnet';
const ZERO_G_SYMBOL = 'A0GI';

export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error('No Ethereum provider found');
  }

  // Request account access
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  // Switch to 0G network
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${ZERO_G_CHAIN_ID.toString(16)}` }],
    });
  } catch (error: any) {
    // If the network is not added, add it
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${ZERO_G_CHAIN_ID.toString(16)}`,
            chainName: ZERO_G_CHAIN_NAME,
            nativeCurrency: {
              name: ZERO_G_SYMBOL,
              symbol: ZERO_G_SYMBOL,
              decimals: 18,
            },
            rpcUrls: [ZERO_G_RPC],
          },
        ],
      });
    } else {
      throw error;
    }
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const address = await signer.getAddress();

  return {
    address,
    provider,
    signer,
  };
}; 