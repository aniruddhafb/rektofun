"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSolanaWallet } from "../../lib/useSolanaWallet";

interface Coin {
    symbol: string;
    name: string;
    logo: string;
}

interface CreateMarketModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const coins: Coin[] = [
    { symbol: "BTC", name: "Bitcoin", logo: "/scribbles/btc.png" },
    { symbol: "ETH", name: "Ethereum", logo: "/scribbles/coins.png" },
    { symbol: "SOL", name: "Solana", logo: "/scribbles/sol.png" },
    { symbol: "PEPE", name: "Pepe", logo: "/scribbles/pepe.png" },
    { symbol: "BONK", name: "Bonk", logo: "/scribbles/doge.png" },
];

export function CreateMarketModal({ isOpen, onClose }: CreateMarketModalProps) {
    const { authenticated, login } = useSolanaWallet();

    const [selectedCoin, setSelectedCoin] = useState<Coin>(coins[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [marketName, setMarketName] = useState("");
    const [description, setDescription] = useState("");
    const [prizePool, setPrizePool] = useState(1);
    const [duration, setDuration] = useState({ hours: 24, minutes: 0 });
    const [isDurationPickerOpen, setIsDurationPickerOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [txError, setTxError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!isOpen) return null;

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

        setIsSubmitting(true);
        setTxError(null);

        try {
            // Simulate market creation
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("Market created:", {
                name: marketName,
                coin: selectedCoin.symbol,
                prizePool: prizePool,
                duration: duration,
            });
            onClose();
            setMarketName("");
            setDescription("");
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
                <div className="sticky top-0 bg-[#f3e1d7] rounded-t-3xl px-6 pt-6 pb-4 border-b border-[#e8d5c8]">
                    <div className="flex items-center justify-between">
                        <div className="flex-1" />
                        <h2 className="cursor-pointer text-2xl font-bold text-gray-900 flex-1 text-center">Create Market</h2>
                        <div className="flex-1 flex justify-end">
                            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e8d5c8] hover:bg-[#dcc9bc] transition-colors">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <p className="text-center text-gray-600 text-sm mt-1">Create a new challenge market for traders to join.</p>
                </div>

                <div className="px-6 py-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Market Name</label>
                        <input
                            type="text"
                            value={marketName}
                            onChange={(e) => setMarketName(e.target.value)}
                            placeholder="e.g., Bitcoin Challenge Markets"
                            className="w-full px-4 py-3 bg-[#faf0eb] border border-[#e8d5c8] rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d4b8a8]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what this market is about..."
                            rows={3}
                            className="w-full px-4 py-3 bg-[#faf0eb] border border-[#e8d5c8] rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d4b8a8] resize-none"
                        />
                    </div>

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

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Prize Pool (SOL)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">◎</span>
                            <input type="number" value={prizePool} onChange={(e) => setPrizePool(Number(e.target.value))} step="0.1" min="0.1" className="w-full pl-8 pr-4 py-3 bg-[#faf0eb] border border-[#e8d5c8] rounded-xl text-lg font-semibold text-gray-900 focus:outline-none focus:border-[#d4b8a8]" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Market Duration</label>
                        <button onClick={() => setIsDurationPickerOpen(true)} className="w-full flex items-center justify-between px-4 py-3 bg-[#faf0eb] border border-[#e8d5c8] rounded-xl hover:border-[#d4b8a8] transition-colors">
                            <span className="font-medium text-gray-900">{formatDuration(duration)}</span>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <div className="text-center py-2">
                        <p className="text-gray-700">
                            Prize pool of <span className="font-bold text-gray-900">◎{prizePool}</span> for {selectedCoin.symbol} challenges
                        </p>
                    </div>

                    {txError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                            ⚠️ {txError}
                        </div>
                    )}

                    <button
                        onClick={handleCreate}
                        disabled={isSubmitting || !marketName.trim()}
                        className="w-full py-4 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 rounded-full text-gray-900 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all border-2 border-amber-400/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {isSubmitting ? "Creating Market…" : !authenticated ? "Connect Wallet to Create" : "CREATE MARKET"}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Your market will be visible to all traders once created.
                    </p>
                </div>

                {isDurationPickerOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsDurationPickerOpen(false)} />
                        <div className="relative bg-[#f3e1d7] rounded-2xl w-full max-w-sm p-6 shadow-2xl">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Select Duration</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">Days</label>
                                    <input
                                        type="number"
                                        value={Math.floor(duration.hours / 24)}
                                        onChange={(e) => setDuration({ ...duration, hours: Number(e.target.value) * 24 + (duration.hours % 24) })}
                                        min="0"
                                        max="30"
                                        className="w-full px-4 py-3 bg-white border border-[#e8d5c8] rounded-xl text-gray-900 focus:outline-none focus:border-[#d4b8a8]"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">Hours</label>
                                    <input
                                        type="number"
                                        value={duration.hours % 24}
                                        onChange={(e) => setDuration({ ...duration, hours: Math.floor(duration.hours / 24) * 24 + Number(e.target.value) })}
                                        min="0"
                                        max="23"
                                        className="w-full px-4 py-3 bg-white border border-[#e8d5c8] rounded-xl text-gray-900 focus:outline-none focus:border-[#d4b8a8]"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">Minutes</label>
                                    <input
                                        type="number"
                                        value={duration.minutes}
                                        onChange={(e) => setDuration({ ...duration, minutes: Number(e.target.value) })}
                                        min="0"
                                        max="59"
                                        className="w-full px-4 py-3 bg-white border border-[#e8d5c8] rounded-xl text-gray-900 focus:outline-none focus:border-[#d4b8a8]"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setIsDurationPickerOpen(false)} className="flex-1 py-3 bg-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-300 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={() => setIsDurationPickerOpen(false)} className="flex-1 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-colors">
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}