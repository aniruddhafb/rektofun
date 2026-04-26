"use client";

import { useEffect } from "react";

interface CreateMarketModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateMarketModal({ isOpen, onClose }: CreateMarketModalProps) {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#f3e1d7] rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-[#f3e1d7] rounded-t-3xl px-6 pt-6 pb-4 border-b border-[#e8d5c8]">
                    <div className="flex items-center justify-between">
                        <div className="flex-1" />
                        <h2 className="cursor-pointer text-xl font-bold text-gray-900 flex-1 text-center whitespace-nowrap">Create Market</h2>
                        <div className="flex-1 flex justify-end">
                            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e8d5c8] hover:bg-[#dcc9bc] transition-colors">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-8 flex flex-col items-center justify-center gap-3">
                    <p className="text-center text-gray-700 text-lg font-medium">
                        Only admins can create new markets right now.
                    </p>
                    <p className="text-center text-sm text-gray-500">
                        Wallet-based market creation will need a replacement integration before this flow can be restored.
                    </p>
                </div>
            </div>
        </div>
    );
}
