import { ethers } from 'ethers';

export interface GiftWallet {
  address: string;
  privateKey: string;
}

export function createGiftWallet(): GiftWallet {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}

export function getWalletFromPrivateKey(privateKey: string): ethers.Wallet {
  return new ethers.Wallet(privateKey);
}

// Helper to format the magic link
export function generateLink(baseUrl: string, privateKey: string): string {
  // We use the hash fragment so the key is never sent to the server
  return `${baseUrl}/claim#k=${privateKey}`;
}

export function parseLink(url: string): string | null {
  try {
    const hash = url.split('#')[1];
    const params = new URLSearchParams(hash);
    return params.get('k');
  } catch (e) {
    return null;
  }
}
