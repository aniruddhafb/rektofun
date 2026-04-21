"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSolanaWallet } from "../lib/useSolanaWallet";
import {
  buildCreateChallengeTx,
  buildAcceptChallengeTx,
  fetchAllChallenges,
  lamportsToSol,
  formatTimeRemaining,
  type OnChainChallenge,
  type CreateChallengeArgs,
} from "../lib/rektofun-program";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Coin {
  symbol: string;
  name: string;
  logo: string;
}

const coins: Coin[] = [
  { symbol: "BTC", name: "Bitcoin", logo: "/scribbles/btc.png" },
  { symbol: "ETH", name: "Ethereum", logo: "/scribbles/coins.png" },
  { symbol: "SOL", name: "Solana", logo: "/scribbles/sol.png" },
  { symbol: "PEPE", name: "Pepe", logo: "/scribbles/pepe.png" },
  { symbol: "BONK", name: "Bonk", logo: "/scribbles/doge.png" },
];

const filterOptions = ["All", "Active", "Ending Soon", "High Stakes", "My Bets"];
const assetOptions = ["All Assets", "SOL", "BTC", "ETH", "DOGE", "PEPE", "SHIB"];

// ─── Date Picker Modal ────────────────────────────────────────────────────────

function DatePickerModal({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  if (!isOpen) return null;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const isSelected = (day: number) =>
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === currentMonth &&
    selectedDate.getFullYear() === currentYear;

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-[#f3e1d7] rounded-2xl p-6 shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
              else setCurrentMonth(currentMonth - 1);
            }}
            className="p-2 hover:bg-[#e8d5c8] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-semibold text-gray-900">{months[currentMonth]} {currentYear}</span>
          <button
            onClick={() => {
              if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
              else setCurrentMonth(currentMonth + 1);
            }}
            className="p-2 hover:bg-[#e8d5c8] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="text-center text-xs text-gray-500 font-medium py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div key={index} className="aspect-square">
              {day && (
                <button
                  onClick={() => { onSelectDate(new Date(currentYear, currentMonth, day)); onClose(); }}
                  className={`w-full h-full rounded-lg text-sm font-medium transition-colors ${
                    isSelected(day) ? "bg-emerald-500 text-white"
                    : isToday(day) ? "bg-amber-300 text-gray-900"
                    : "hover:bg-[#e8d5c8] text-gray-700"
                  }`}
                >
                  {day}
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 pt-4 border-t border-[#e8d5c8]">
          <button onClick={() => { onSelectDate(new Date()); onClose(); }} className="text-sm text-emerald-600 font-medium hover:text-emerald-700">Today</button>
          <button onClick={onClose} className="text-sm text-gray-600 font-medium hover:text-gray-800">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Duration Picker Modal ────────────────────────────────────────────────────

function DurationPickerModal({
  isOpen,
  onClose,
  selectedDuration,
  onSelectDuration,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedDuration: { hours: number; minutes: number };
  onSelectDuration: (duration: { hours: number; minutes: number }) => void;
}) {
  const [hours, setHours] = useState(selectedDuration.hours);
  const [minutes, setMinutes] = useState(selectedDuration.minutes);

  if (!isOpen) return null;

  const maxHours = 7 * 24;

  const formatDuration = () => {
    if (hours === 0 && minutes === 0) return "Select duration";
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    let result = "";
    if (days > 0) result += `${days}d `;
    if (remainingHours > 0) result += `${remainingHours}h `;
    if (minutes > 0) result += `${minutes}m`;
    return result.trim();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-[#f3e1d7] rounded-2xl p-6 shadow-2xl w-full max-w-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Challenge Duration</h3>
        <p className="text-sm text-gray-600 text-center mb-6">Max duration: 7 days</p>
        <div className="bg-[#faf0eb] rounded-xl p-4 mb-6 text-center">
          <span className="text-2xl font-bold text-gray-900">{formatDuration()}</span>
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Hours</label>
          <div className="flex items-center gap-3">
            <button onClick={() => hours > 0 && setHours(hours - 1)} className="w-10 h-10 rounded-lg bg-[#e8d5c8] hover:bg-[#dcc9bc] flex items-center justify-center text-gray-700 font-bold">-</button>
            <input type="number" value={hours} onChange={(e) => { const v = Number(e.target.value); if (v >= 0 && v <= maxHours) setHours(v); }} className="flex-1 text-center py-2 bg-[#faf0eb] border border-[#e8d5c8] rounded-lg text-lg font-semibold" min={0} max={maxHours} />
            <button onClick={() => hours < maxHours && setHours(hours + 1)} className="w-10 h-10 rounded-lg bg-[#e8d5c8] hover:bg-[#dcc9bc] flex items-center justify-center text-gray-700 font-bold">+</button>
          </div>
        </div>
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Minutes</label>
          <div className="flex items-center gap-3">
            <button onClick={() => minutes >= 5 && setMinutes(minutes - 5)} className="w-10 h-10 rounded-lg bg-[#e8d5c8] hover:bg-[#dcc9bc] flex items-center justify-center text-gray-700 font-bold">-</button>
            <input type="number" value={minutes} onChange={(e) => { const v = Number(e.target.value); if (v >= 0 && v < 60) setMinutes(v); }} className="flex-1 text-center py-2 bg-[#faf0eb] border border-[#e8d5c8] rounded-lg text-lg font-semibold" min={0} max={59} step={5} />
            <button onClick={() => minutes < 55 && setMinutes(minutes + 5)} className="w-10 h-10 rounded-lg bg-[#e8d5c8] hover:bg-[#dcc9bc] flex items-center justify-center text-gray-700 font-bold">+</button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[15, 30, 60, 120, 240, 480].map((mins) => (
            <button key={mins} onClick={() => { setHours(Math.floor(mins / 60)); setMinutes(mins % 60); }} className="py-2 px-3 bg-[#faf0eb] border border-[#e8d5c8] rounded-lg text-sm font-medium text-gray-700 hover:bg-[#e8d5c8] transition-colors">
              {mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h`}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-[#e8d5c8] rounded-xl text-gray-700 font-medium hover:bg-[#dcc9bc] transition-colors">Cancel</button>
          <button onClick={() => { onSelectDuration({ hours, minutes }); onClose(); }} className="flex-1 py-3 bg-emerald-500 rounded-xl text-white font-medium hover:bg-emerald-600 transition-colors">Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ─── Create Challenge Modal ───────────────────────────────────────────────────

function CreateChallengeModal({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const { authenticated, login, program, sendTransaction, publicKey } = useSolanaWallet();

  const [selectedCoin, setSelectedCoin] = useState<Coin>(coins[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [betAmount, setBetAmount] = useState(0.1); // SOL
  const [predictionDirection, setPredictionDirection] = useState("Above");
  const [isDirectionDropdownOpen, setIsDirectionDropdownOpen] = useState(false);
  const [predictionPrice, setPredictionPrice] = useState("66500");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [duration, setDuration] = useState({ hours: 4, minutes: 0 });
  const [isDurationPickerOpen, setIsDurationPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [txSig, setTxSig] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const formatDuration = (dur: { hours: number; minutes: number }) => {
    if (dur.hours === 0 && dur.minutes === 0) return "Select duration";
    const days = Math.floor(dur.hours / 24);
    const remainingHours = dur.hours % 24;
    let result = "";
    if (days > 0) result += `${days}d `;
    if (remainingHours > 0) result += `${remainingHours}h `;
    if (dur.minutes > 0) result += `${dur.minutes}m`;
    return result.trim();
  };

  async function handleCreate() {
    if (!authenticated) { login(); return; }
    if (!program || !publicKey) { setTxError("Solana wallet not ready. Please wait or reconnect."); return; }

    setIsSubmitting(true);
    setTxError(null);
    setTxSig(null);

    try {
      const now = Math.floor(Date.now() / 1000);
      const expiryDurationSecs = duration.hours * 3600 + duration.minutes * 60;
      const expiresAt = now + expiryDurationSecs;
      // Resolve 1 hour after expiry (oracle has time to check price)
      const resolvesAt = expiresAt + 3600;

      const args: CreateChallengeArgs = {
        asset: selectedCoin.symbol,
        betAmountSol: betAmount,
        targetPriceUsdCents: Math.round(Number(predictionPrice) * 100),
        directionAbove: predictionDirection === "Above",
        expiresAt,
        resolvesAt,
      };

      const tx = await buildCreateChallengeTx(program, publicKey, args);
      const sig = await sendTransaction(tx);
      setTxSig(sig);
      onCreated();
      setTimeout(onClose, 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTxError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#f3e1d7] rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#f3e1d7] rounded-t-3xl px-6 pt-6 pb-4 border-b border-[#e8d5c8]">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <h2 className="text-2xl font-bold text-gray-900 flex-1 text-center">Create Challenge</h2>
            <div className="flex-1 flex justify-end">
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e8d5c8] hover:bg-[#dcc9bc] transition-colors">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-center text-gray-600 text-sm mt-1">Set your terms and invite degenerates to challenge you.</p>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Select Coin */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Coin</label>
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full flex items-center justify-between px-4 py-3 bg-[#faf0eb] border border-[#e8d5c8] rounded-xl hover:border-[#d4b8a8] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center overflow-hidden">
                    <Image src={selectedCoin.logo} alt={selectedCoin.symbol} width={24} height={24} className="w-6 h-6 object-contain" />
                  </div>
                  <span className="font-semibold text-gray-900">{selectedCoin.symbol}</span>
                </div>
                <svg className={`w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#faf0eb] border border-[#e8d5c8] rounded-xl shadow-lg z-10 overflow-hidden">
                  {coins.map((coin) => (
                    <button key={coin.symbol} onClick={() => { setSelectedCoin(coin); setIsDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f3e1d7] transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center overflow-hidden">
                        <Image src={coin.logo} alt={coin.symbol} width={24} height={24} className="w-6 h-6 object-contain" />
                      </div>
                      <span className="font-medium text-gray-900">{coin.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bet Amount (SOL) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Bet Amount (SOL)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">◎</span>
              <input type="number" value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value))} step="0.01" min="0.01" className="w-full pl-8 pr-4 py-3 bg-[#faf0eb] border border-[#e8d5c8] rounded-xl text-lg font-semibold text-gray-900 focus:outline-none focus:border-[#d4b8a8]" />
            </div>
          </div>

          {/* Predict Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Predict Price</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <button onClick={() => setIsDirectionDropdownOpen(!isDirectionDropdownOpen)} className="w-full flex items-center justify-between px-4 py-3 bg-[#faf0eb] border border-[#e8d5c8] rounded-xl hover:border-[#d4b8a8] transition-colors">
                  <span className="font-semibold text-gray-900">{selectedCoin.name} {predictionDirection}</span>
                  <svg className={`w-5 h-5 text-gray-500 transition-transform ${isDirectionDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDirectionDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#faf0eb] border border-[#e8d5c8] rounded-xl shadow-lg z-10 overflow-hidden">
                    {["Above", "Below"].map((dir) => (
                      <button key={dir} onClick={() => { setPredictionDirection(dir); setIsDirectionDropdownOpen(false); }} className="w-full px-4 py-3 text-left hover:bg-[#f3e1d7] transition-colors font-medium text-gray-900">
                        {selectedCoin.name} {dir}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative w-32">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
                <input type="number" value={predictionPrice} onChange={(e) => setPredictionPrice(e.target.value)} className="w-full pl-8 pr-4 py-3 bg-[#faf0eb] border border-[#e8d5c8] rounded-xl text-lg font-semibold text-gray-900 focus:outline-none focus:border-[#d4b8a8]" placeholder="66500" />
              </div>
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">End Date</label>
            <button onClick={() => setIsDatePickerOpen(true)} className="w-full flex items-center justify-between px-4 py-3 bg-[#faf0eb] border border-[#e8d5c8] rounded-xl hover:border-[#d4b8a8] transition-colors">
              <span className="font-medium text-gray-900">{formatDate(selectedDate)}</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Challenge Expiry */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Challenge Expiry</label>
            <button onClick={() => setIsDurationPickerOpen(true)} className="w-full flex items-center justify-between px-4 py-3 bg-[#faf0eb] border border-[#e8d5c8] rounded-xl hover:border-[#d4b8a8] transition-colors">
              <span className="font-medium text-gray-900">{formatDuration(duration)}</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Win Summary */}
          <div className="text-center py-2">
            <p className="text-gray-700">
              You win <span className="font-bold text-gray-900">◎{(betAmount * 2 * 0.98).toFixed(3)}</span> if {selectedCoin.symbol} closes {predictionDirection.toLowerCase()} ${Number(predictionPrice).toLocaleString()} in {formatDuration(duration)}
            </p>
            <p className="text-xs text-gray-500 mt-1">2% platform fee applies</p>
          </div>

          {/* Error / Success */}
          {txError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              ⚠️ {txError}
            </div>
          )}
          {txSig && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-700">
              ✅ Challenge created!{" "}
              <a href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="underline">View on Explorer</a>
            </div>
          )}

          {/* Create Button */}
          <button
            onClick={handleCreate}
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 rounded-full text-gray-900 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all border-2 border-amber-400/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isSubmitting ? "Creating on-chain…" : !authenticated ? "Connect Wallet to Create" : "CREATE CHALLENGE"}
          </button>

          <p className="text-center text-sm text-gray-600">
            You can&apos;t cancel your challenge once it&apos;s accepted, so bet wisely!
          </p>
        </div>
      </div>

      <DatePickerModal isOpen={isDatePickerOpen} onClose={() => setIsDatePickerOpen(false)} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <DurationPickerModal isOpen={isDurationPickerOpen} onClose={() => setIsDurationPickerOpen(false)} selectedDuration={duration} onSelectDuration={setDuration} />
    </div>
  );
}

// ─── Challenge Card ───────────────────────────────────────────────────────────

function ChallengeCard({ challenge, onRekt }: { challenge: OnChainChallenge; onRekt: (c: OnChainChallenge) => void }) {
  const betSol = lamportsToSol(challenge.betAmount);
  const timeLeft = formatTimeRemaining(challenge.expiresAt);
  const isExpired = challenge.expiresAt < Math.floor(Date.now() / 1000);
  const targetPrice = Number(challenge.targetPriceUsdCents) / 100;

  const assetLogo = coins.find((c) => c.symbol === challenge.asset)?.logo ?? "/scribbles/coins.png";

  return (
    <div className="bg-[#f8ede7] rounded-2xl p-4 shadow-sm border border-white/50 hover:shadow-lg transition-shadow block">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden">
            <Image src={assetLogo} alt={challenge.asset} width={32} height={32} className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base leading-tight">
              {challenge.asset} {challenge.direction} ${targetPrice.toLocaleString()}?
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 font-mono">
              {challenge.creator.toBase58().slice(0, 8)}…
            </p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          challenge.status === "Open" ? "bg-emerald-100 text-emerald-700"
          : challenge.status === "Active" ? "bg-blue-100 text-blue-700"
          : challenge.status === "Settled" ? "bg-gray-100 text-gray-600"
          : "bg-red-100 text-red-600"
        }`}>
          {challenge.status}
        </span>
      </div>

      <div className="border-t border-gray-200 my-3" />

      {/* Bet Info */}
      <div className="text-center mb-3">
        <p className="text-xl font-bold text-gray-900">
          <span className="text-emerald-600">◎{betSol.toFixed(3)}</span>{" "}
          <span className="text-gray-700">Bet on {challenge.asset} {challenge.direction} ${targetPrice.toLocaleString()}</span>
        </p>
      </div>

      {/* Prize pool */}
      <div className="flex justify-between text-sm text-gray-500 mb-3">
        <span>Prize pool: <span className="font-semibold text-gray-800">◎{(betSol * 2 * 0.98).toFixed(3)}</span></span>
        <span>Target: <span className="font-semibold text-gray-800">${targetPrice.toLocaleString()}</span></span>
      </div>

      {/* CTA Button */}
      {challenge.status === "Open" && !isExpired ? (
        <button
          onClick={() => onRekt(challenge)}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 rounded-xl text-gray-900 font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all border-2 border-amber-400/50 flex items-center justify-center gap-2"
        >
          REKT HIM <span className="text-xl">😈</span>
        </button>
      ) : (
        <div className="w-full py-2.5 px-4 bg-gray-100 rounded-xl text-gray-500 font-bold text-base text-center">
          {isExpired ? "Expired" : challenge.status}
        </div>
      )}

      <p className="text-center text-xs text-gray-600 mt-1.5">
        {isExpired ? "Challenge expired" : <>Expires in <span className="font-medium text-gray-900">{timeLeft}</span></>}
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ChallengesPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeAsset, setActiveAsset] = useState("All Assets");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [challenges, setChallenges] = useState<OnChainChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rektTarget, setRektTarget] = useState<OnChainChallenge | null>(null);
  const [rektTxSig, setRektTxSig] = useState<string | null>(null);
  const [rektError, setRektError] = useState<string | null>(null);
  const [isRekting, setIsRekting] = useState(false);

  const { authenticated, login, program, sendTransaction, publicKey } = useSolanaWallet();

  const loadChallenges = useCallback(async () => {
    if (!program) return;
    setIsLoading(true);
    try {
      const data = await fetchAllChallenges(program);
      setChallenges(data);
    } catch (err) {
      console.error("Failed to load challenges:", err);
    } finally {
      setIsLoading(false);
    }
  }, [program]);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  async function handleRekt(challenge: OnChainChallenge) {
    if (!authenticated) { login(); return; }
    if (!program || !publicKey) { setRektError("Wallet not ready"); return; }

    setRektTarget(challenge);
    setRektError(null);
    setRektTxSig(null);
    setIsRekting(true);

    try {
      const tx = await buildAcceptChallengeTx(program, publicKey, challenge.publicKey, challenge.creator);
      const sig = await sendTransaction(tx);
      setRektTxSig(sig);
      await loadChallenges();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setRektError(msg);
    } finally {
      setIsRekting(false);
    }
  }

  // Filter challenges
  const filtered = challenges.filter((c) => {
    if (activeAsset !== "All Assets" && c.asset !== activeAsset) return false;
    if (activeFilter === "Active") return c.status === "Active";
    if (activeFilter === "My Bets" && publicKey)
      return c.creator.equals(publicKey) || c.challenger.equals(publicKey);
    if (activeFilter === "High Stakes") return lamportsToSol(c.betAmount) >= 1;
    if (activeFilter === "Ending Soon") {
      const diff = c.expiresAt - Math.floor(Date.now() / 1000);
      return diff > 0 && diff < 3600;
    }
    return true;
  });

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Challenges</h1>
            <p className="text-gray-600 mt-1">Battle other traders in PvP prediction markets</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center px-6 py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Challenge
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === filter ? "bg-black text-white" : "bg-white/60 text-gray-700 hover:bg-white/80"}`}>
                {filter}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 lg:ml-auto">
            {assetOptions.map((asset) => (
              <button key={asset} onClick={() => setActiveAsset(asset)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeAsset === asset ? "bg-gray-800 text-white" : "bg-white/60 text-gray-700 hover:bg-white/80"}`}>
                {asset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rekt feedback banner */}
      {(rektTxSig || rektError) && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-4">
          {rektTxSig && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-700">
              ✅ You just REKT {rektTarget?.creator.toBase58().slice(0, 8)}…!{" "}
              <a href={`https://explorer.solana.com/tx/${rektTxSig}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="underline">View on Explorer</a>
            </div>
          )}
          {rektError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              ⚠️ {rektError}
            </div>
          )}
        </div>
      )}

      {/* Challenges Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        {isLoading ? (
          <div className="text-center py-16 text-gray-500">Loading on-chain challenges…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">No challenges found on-chain yet.</p>
            <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
              Be the first to create one!
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((challenge) => (
              <ChallengeCard
                key={challenge.publicKey.toBase58()}
                challenge={challenge}
                onRekt={handleRekt}
              />
            ))}
          </div>
        )}

        {/* Loading overlay for rekt action */}
        {isRekting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
              <div className="text-4xl mb-4">😈</div>
              <p className="text-lg font-bold text-gray-900">Sending REKT transaction…</p>
              <p className="text-sm text-gray-500 mt-2">Please approve in your wallet</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Challenge Modal */}
      <CreateChallengeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={loadChallenges}
      />
    </div>
  );
}
