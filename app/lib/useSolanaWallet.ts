"use client";

/**
 * Placeholder wallet hook used while wallet integration is disabled.
 */

import { Transaction } from "@solana/web3.js";
import type { Program } from "@anchor-lang/core";

export interface SolanaWalletAdapter {
  publicKey: never;
  signTransaction: (tx: Transaction) => Promise<Transaction>;
  signAllTransactions: (txs: Transaction[]) => Promise<Transaction[]>;
}

export function useSolanaWallet() {
  async function sendTransaction(tx: Transaction): Promise<string> {
    void tx;
    throw new Error("Wallet integration is currently unavailable.");
  }

  return {
    authenticated: false,
    login: () => undefined,
    solanaWallet: null,
    adapter: null as SolanaWalletAdapter | null,
    program: null as Program | null,
    sendTransaction,
    publicKey: null,
  };
}
