"use client";

import { ChevronDown } from "lucide-react";
import { statusFilterOptions, modeFilterOptions } from "./types";

interface FilterBarProps {
    selectedStatus: string;
    onStatusChange: (status: string) => void;
    selectedMode: string;
    onModeChange: (mode: string) => void;
    statusOpen: boolean;
    onStatusOpenChange: (open: boolean) => void;
    modeOpen: boolean;
    onModeOpenChange: (open: boolean) => void;
}

export function FilterBar({
    selectedStatus,
    onStatusChange,
    selectedMode,
    onModeChange,
    statusOpen,
    onStatusOpenChange,
    modeOpen,
    onModeOpenChange,
}: FilterBarProps) {
    return (
        <div className="grid grid-cols-1 sm:flex sm:items-center sm:justify-end gap-2 w-full">
            {/* Status Filter Dropdown */}
            <div className="relative w-full sm:w-auto min-w-0">
                <button
                    onClick={() => {
                        onStatusOpenChange(!statusOpen);
                        if (modeOpen) onModeOpenChange(false);
                    }}
                    className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-3 sm:py-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-sm"
                >
                    <span className="text-gray-700 font-medium truncate">{selectedStatus}</span>
                    <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-gray-500 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Status Dropdown Menu */}
                {statusOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => onStatusOpenChange(false)}
                        />
                        <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-1 w-full sm:w-48 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto">
                            {statusFilterOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        onStatusChange(option);
                                        onStatusOpenChange(false);
                                    }}
                                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-sm ${selectedStatus === option
                                        ? "bg-amber-50 text-amber-700"
                                        : "text-gray-700"
                                        }`}
                                >
                                    <span className="font-medium truncate">{option}</span>
                                    {selectedStatus === option && (
                                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Mode Filter Dropdown */}
            <div className="relative w-full sm:w-auto min-w-0">
                <button
                    onClick={() => {
                        onModeOpenChange(!modeOpen);
                        if (statusOpen) onStatusOpenChange(false);
                    }}
                    className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-3 sm:py-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-sm"
                >
                    <span className="text-gray-700 font-medium truncate">{selectedMode}</span>
                    <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-gray-500 transition-transform ${modeOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Mode Dropdown Menu */}
                {modeOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => onModeOpenChange(false)}
                        />
                        <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-1 w-full sm:w-44 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto">
                            {modeFilterOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        onModeChange(option);
                                        onModeOpenChange(false);
                                    }}
                                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-sm ${selectedMode === option
                                        ? "bg-amber-50 text-amber-700"
                                        : "text-gray-700"
                                        }`}
                                >
                                    <span className="font-medium truncate">{option}</span>
                                    {selectedMode === option && (
                                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
