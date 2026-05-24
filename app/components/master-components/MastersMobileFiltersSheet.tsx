import { Search, Shapes, Shield, ShieldCheck, ShieldOff } from "lucide-react";
import type { CategoryFilter, VerificationFilter } from "./types";
import { CATEGORY_OPTIONS, VERIFICATION_OPTIONS } from "./types";
import { useBodyScrollLock } from "@/app/lib/useBodyScrollLock";

type Props = {
    isOpen: boolean;
    search: string;
    categoryFilter: CategoryFilter;
    verificationFilter: VerificationFilter;
    onClose: () => void;
    onSearchChange: (value: string) => void;
    onCategorySelect: (value: CategoryFilter) => void;
    onVerificationSelect: (value: VerificationFilter) => void;
};

export function MastersMobileFiltersSheet({
    isOpen,
    search,
    categoryFilter,
    verificationFilter,
    onClose,
    onSearchChange,
    onCategorySelect,
    onVerificationSelect,
}: Props) {
    useBodyScrollLock(isOpen);

    if (!isOpen) return null;

    return (
        <div className="sm:hidden fixed inset-0 z-50">
            <button
                type="button"
                aria-label="Close filters"
                onClick={onClose}
                className="absolute inset-0 bg-black/40"
            />

            <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-4 pb-6 shadow-2xl max-h-[80vh] overflow-y-auto">
                <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300" />

                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">Master Filters</h3>
                    <button type="button" onClick={onClose} className="text-sm font-medium text-gray-500 px-2 py-1">
                        Close
                    </button>
                </div>

                <div className="mt-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Search</p>
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search masters..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Category</p>
                    <div className="space-y-2">
                        {CATEGORY_OPTIONS.map((option) => (
                            <button
                                key={option}
                                onClick={() => onCategorySelect(option)}
                                className={`w-full rounded-xl border px-3 py-3 text-left text-sm flex items-center gap-2 ${categoryFilter === option ? "border-gray-900 bg-gray-100 text-gray-900 font-semibold" : "border-gray-200 text-gray-700"}`}
                            >
                                <Shapes className="h-4 w-4" />
                                <span>{option}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Verification</p>
                    <div className="space-y-2">
                        {VERIFICATION_OPTIONS.map((option) => (
                            <button
                                key={option}
                                onClick={() => onVerificationSelect(option)}
                                className={`w-full rounded-xl border px-3 py-3 text-left text-sm flex items-center gap-2 ${verificationFilter === option ? "border-gray-900 bg-gray-100 text-gray-900 font-semibold" : "border-gray-200 text-gray-700"}`}
                            >
                                {option === "Verified" ? (
                                    <ShieldCheck className="h-4 w-4" />
                                ) : option === "Unverified" ? (
                                    <ShieldOff className="h-4 w-4" />
                                ) : (
                                    <Shield className="h-4 w-4" />
                                )}
                                <span>{option}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
