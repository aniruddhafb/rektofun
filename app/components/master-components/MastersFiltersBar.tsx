import { ChevronDown, Search, Shapes, Shield, ShieldCheck, ShieldOff } from "lucide-react";
import type { RefObject } from "react";
import type { CategoryFilter, VerificationFilter } from "./types";
import { CATEGORY_OPTIONS, VERIFICATION_OPTIONS } from "./types";

type Props = {
    search: string;
    categoryFilter: CategoryFilter;
    verificationFilter: VerificationFilter;
    isCategoryOpen: boolean;
    isVerificationOpen: boolean;
    categoryRef: RefObject<HTMLDivElement | null>;
    verificationRef: RefObject<HTMLDivElement | null>;
    onSearchChange: (value: string) => void;
    onCategoryToggle: () => void;
    onVerificationToggle: () => void;
    onCategorySelect: (value: CategoryFilter) => void;
    onVerificationSelect: (value: VerificationFilter) => void;
    onOpenMobileFilters: () => void;
};

export function MastersFiltersBar({
    search,
    categoryFilter,
    verificationFilter,
    isCategoryOpen,
    isVerificationOpen,
    categoryRef,
    verificationRef,
    onSearchChange,
    onCategoryToggle,
    onVerificationToggle,
    onCategorySelect,
    onVerificationSelect,
    onOpenMobileFilters,
}: Props) {
    return (
        <div className="max-w-7xl pb-8">
            <div className="flex flex-col items-stretch gap-3 sm:gap-4 lg:flex-row lg:items-center">
                <div className="relative hidden sm:block w-full lg:max-w-md lg:flex-1">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search masters..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full rounded-2xl bg-white/60 py-3 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:rounded-full sm:py-2.5"
                    />
                </div>

                <button
                    type="button"
                    onClick={onOpenMobileFilters}
                    className="sm:hidden w-full border border-gray-300 cursor-pointer flex items-center justify-between px-4 py-3 bg-white/60 rounded-2xl text-sm text-gray-700 hover:bg-white/80 transition-colors"
                >
                    <span>Filters</span>
                    <span className="text-xs text-gray-500 truncate max-w-[65%] text-right">
                        {categoryFilter} • {verificationFilter}
                    </span>
                </button>

                <div className="hidden sm:grid sm:grid-cols-2 w-full items-stretch gap-3 lg:w-auto">
                    <div className="relative w-full min-w-0" ref={categoryRef}>
                        <button
                            onClick={onCategoryToggle}
                            className="w-full cursor-pointer justify-between rounded-2xl border border-gray-300 bg-white/60 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-white/80 sm:rounded-full sm:py-2.5 flex items-center gap-2"
                        >
                            <span className="min-w-0 truncate flex items-center gap-2">
                                <Shapes className="h-4 w-4" />
                                {categoryFilter}
                            </span>
                            <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isCategoryOpen ? (
                            <div className="absolute left-0 top-full z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-100 bg-white py-2 shadow-lg sm:min-w-[14rem] sm:w-auto">
                                {CATEGORY_OPTIONS.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => onCategorySelect(option)}
                                        className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${categoryFilter === option ? "font-semibold text-black" : "text-gray-700 hover:bg-gray-50"}`}
                                    >
                                        <Shapes className="h-4 w-4" />
                                        <span>{option}</span>
                                    </button>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <div className="relative w-full min-w-0" ref={verificationRef}>
                        <button
                            onClick={onVerificationToggle}
                            className="w-full cursor-pointer justify-between rounded-2xl border border-gray-300 bg-white/60 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-white/80 sm:rounded-full sm:py-2.5 flex items-center gap-2"
                        >
                            <span className="min-w-0 truncate flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                {verificationFilter}
                            </span>
                            <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isVerificationOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isVerificationOpen ? (
                            <div className="absolute left-0 top-full z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-100 bg-white py-2 shadow-lg sm:min-w-[14rem] sm:w-auto">
                                {VERIFICATION_OPTIONS.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => onVerificationSelect(option)}
                                        className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${verificationFilter === option ? "font-semibold text-black" : "text-gray-700 hover:bg-gray-50"}`}
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
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
