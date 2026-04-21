"use client";

/**
 * useSolanaWallet
 *
 * Bridges Privy's embedded/external Solana wallet to the Anchor program client.
 * Returns a wallet adapter compatible with getRektoProgram().
 */

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { PublicKey, Transaction, Connection } from "@solana/web3.js";
import { useMemo } from "react";
import { getRektoProgram, RPC_ENDPOINT } from "./rektofun-program";
import type { Program } from "@anchor-lang/core";

export interface SolanaWalletAdapter {
  publicKey: PublicKey;
  signTransaction: (tx: Transaction) => Promise<Transaction>;
  signAllTransactions: (txs: Transaction[]) => Promise<Transaction[]>;
}

export function useSolanaWallet() {
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();

  // Pick the first Solana wallet (chain type = "solana")
  const solanaWallet = wallets.find(
    (w) => (w as any).chainType === "solana" || (w as any).type === "solana"
  );

  const adapter: SolanaWalletAdapter | null = useMemo(() => {
    if (!solanaWallet?.address) return null;
    const address = solanaWallet.address;
    return {
      publicKey: new PublicKey(address),
      signTransaction: async (tx: Transaction) => {
        const connection = new Connection(RPC_ENDPOINT, "confirmed");
        const { blockhash } = await connection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;
        tx.feePayer = new PublicKey(address);
        const signed = await (solanaWallet as any).signTransaction(tx);
        return signed as Transaction;
      },
      signAllTransactions: async (txs: Transaction[]) => {
        const connection = new Connection(RPC_ENDPOINT, "confirmed");
        const { blockhash } = await connection.getLatestBlockhash();
        return Promise.all(
          txs.map(async (tx) => {
            tx.recentBlockhash = blockhash;
            tx.feePayer = new PublicKey(address);
            const signed = await (solanaWallet as any).signTransaction(tx);
            return signed as Transaction;
          })
        );
      },
    };
  }, [solanaWallet]);

  const program: Program | null = useMemo(() => {
    if (!adapter) return null;
    try {
      return getRektoProgram(adapter);
    } catch {
      return null;
    }
  }, [adapter]);

  /**
   * Send a pre-built transaction via the Solana wallet.
   * Returns the transaction signature.
   */
  async function sendTransaction(tx: Transaction): Promise<string> {
    if (!adapter || !solanaWallet) throw new Error("Wallet not connected");
    const connection = new Connection(RPC_ENDPOINT, "confirmed");
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = adapter.publicKey;

    const signed = await (solanaWallet as any).signTransaction(tx);
    const rawTx = (signed as any).serialize();
    const sig = await connection.sendRawTransaction(rawTx, {
      skipPreflight: false,
    });
    await connection.confirmTransaction(
      { signature: sig, blockhash, lastValidBlockHeight },
      "confirmed"
    );
    return sig;
  }

  return {
    authenticated,
    login,
    solanaWallet,
    adapter,
    program,
    sendTransaction,
    publicKey: adapter?.publicKey ?? null,
  };
}
