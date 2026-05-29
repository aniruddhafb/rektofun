"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { useSolanaWallet } from "@/app/lib/useSolanaWallet";
import { USDC_MINT, USDC_MULTIPLIER, getReadonlyConnection } from "@/app/lib/rektofun-program";
import { useBodyScrollLock } from "@/app/lib/useBodyScrollLock";

type FundsMode = "deposit" | "withdraw";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: FundsMode;
}

export function DepositModal({ isOpen, onClose, initialMode = "deposit" }: DepositModalProps) {
  const { publicKey, usdcBalance, sendTransaction, refreshBalances } = useSolanaWallet();
  const walletAddress = publicKey?.toBase58() ?? null;
  const [mode, setMode] = useState<FundsMode>(initialMode);
  const [copied, setCopied] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const resetWithdrawForm = useCallback(() => {
    setRecipientAddress("");
    setAmountInput("");
    setIsSubmitting(false);
    setError(null);
    setTxSignature(null);
  }, []);

  const handleClose = useCallback(() => {
    resetWithdrawForm();
    onClose();
  }, [onClose, resetWithdrawForm]);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, handleClose]);

  const parsedAmount = useMemo(() => Number.parseFloat(amountInput), [amountInput]);

  if (!isOpen) return null;

  const handleModeChange = (nextMode: FundsMode) => {
    setMode(nextMode);
    setCopied(false);
    setError(null);
    setTxSignature(null);
  };

  const handleCopy = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWithdraw = async () => {
    setError(null);
    setTxSignature(null);

    if (!publicKey || !walletAddress) {
      setError("Wallet not connected.");
      return;
    }

    const recipient = recipientAddress.trim();
    if (!recipient) {
      setError("Please enter a recipient Solana wallet address.");
      return;
    }

    let recipientPubkey: PublicKey;
    try {
      recipientPubkey = new PublicKey(recipient);
    } catch {
      setError("Invalid recipient Solana wallet address.");
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid USDC amount.");
      return;
    }

    const amountMicro = Math.floor(parsedAmount * USDC_MULTIPLIER);
    if (amountMicro <= 0) {
      setError("Amount is too small. Minimum is 0.000001 USDC.");
      return;
    }

    if (usdcBalance !== null && parsedAmount > usdcBalance) {
      setError("Insufficient USDC balance.");
      return;
    }

    try {
      setIsSubmitting(true);
      const connection = getReadonlyConnection();
      const senderUsdcAta = await getAssociatedTokenAddress(USDC_MINT, publicKey, false);
      const recipientUsdcAta = await getAssociatedTokenAddress(USDC_MINT, recipientPubkey, false);

      const tx = new Transaction();
      const recipientAtaInfo = await connection.getAccountInfo(recipientUsdcAta);
      if (!recipientAtaInfo) {
        tx.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            recipientUsdcAta,
            recipientPubkey,
            USDC_MINT
          )
        );
      }

      tx.add(
        createTransferInstruction(
          senderUsdcAta,
          recipientUsdcAta,
          publicKey,
          BigInt(amountMicro),
          [],
          TOKEN_PROGRAM_ID
        )
      );

      const signature = await sendTransaction(tx);
      setTxSignature(signature);
      await refreshBalances();
      setAmountInput("");
    } catch (withdrawError: unknown) {
      console.error("[DepositModal] Withdraw failed:", withdrawError);
      setError(
        withdrawError instanceof Error
          ? withdrawError.message
          : "Withdraw failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative z-10 w-full max-w-md mx-4 bg-[#f3e1d7] rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {mode === "deposit" ? "Deposit Funds" : "Withdraw Funds"}
            </h2>
            <button
              onClick={handleClose}
              className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-white/50 hover:bg-white/80 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-5 grid grid-cols-2 p-1">
            <button
              type="button"
              onClick={() => handleModeChange("deposit")}
              className={`cursor-pointer rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${mode === "deposit"
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-700 hover:bg-white/60"
                }`}
            >
              Deposit
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("withdraw")}
              className={`cursor-pointer rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${mode === "withdraw"
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-700 hover:bg-white/60"
                }`}
            >
              Withdraw
            </button>
          </div>

          <div className="bg-white/60 rounded-2xl p-4 mb-4">
            <p className="text-xs font-medium text-black mb-2">YOUR CURRENT USDC BALANCE</p>
            <p className="text-lg font-semibold text-gray-900">
              {usdcBalance !== null ? `$${usdcBalance.toFixed(2)}` : "$0.00"}
            </p>
          </div>

          {mode === "deposit" ? (
            <>
              <p className="text-xs font-semibold text-black text-center mb-4">
                Only deposit USDC on Solana Chain to this address.
              </p>

              <div className="bg-white/60 rounded-2xl p-4 mb-4">
                <p className="text-xs font-medium text-black mb-2">YOUR WALLET ADDRESS</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono text-gray-800 truncate flex-1">
                    {walletAddress ? `${walletAddress}` : "No wallet connected"}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-shrink-0 p-2 rounded-full bg-[#f3e1d7] hover:bg-[#e8d4c5] transition-colors"
                  >
                    {copied ? (
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-white/60 rounded-2xl p-4 mb-4">
                <p className="text-xs font-medium text-black mb-2">As we are live on devnet to deposit funds on devnet visit <a href="https://faucet.solana.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">faucet.solana.com</a> For $SOL and
                  <a href="https://faucet.circle.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline"> faucet.circle.com</a> For $USDC
                </p>
              </div>

            </>
          ) : (
            <>
              <div className="bg-white/60 rounded-2xl p-4 mb-4">
                <label className="block text-xs font-medium text-black mb-2">RECIPIENT SOLANA ADDRESS</label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Enter destination wallet address"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div className="bg-white/60 rounded-2xl p-4 mb-4">
                <label className="block text-xs font-medium text-black mb-2">AMOUNT (USDC)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.000001"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

              {txSignature && (
                <p className="text-sm text-green-700 mb-3 break-all">
                  Success. Tx:{" "}
                  <a
                    href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    {txSignature}
                  </a>
                </p>
              )}

              <button
                type="button"
                onClick={handleWithdraw}
                disabled={isSubmitting}
                className="cursor-pointer w-full py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-500 text-white font-medium rounded-xl transition-colors"
              >
                {isSubmitting ? "Processing..." : "Withdraw USDC"}
              </button>

            </>
          )}
        </div>
      </div>
    </div>
  );
}
