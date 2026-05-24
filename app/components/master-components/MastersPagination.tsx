import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { PAGE_SIZE_OPTIONS } from "./types";

type Props = {
    currentStart: number;
    currentEnd: number;
    totalItems: number;
    safeCurrentPage: number;
    totalPages: number;
    pageButtons: Array<number | string>;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (size: number) => void;
};

export function MastersPagination({
    currentStart,
    currentEnd,
    totalItems,
    safeCurrentPage,
    totalPages,
    pageButtons,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
}: Props) {
    return (
        <div className="mt-10 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <p className="hidden text-sm font-medium text-slate-500 md:block">
                Showing {currentStart}-{currentEnd} of {totalItems}
            </p>

            <nav className="flex items-center justify-center gap-1.5">
                <button
                    onClick={() => onPageChange(Math.max(1, safeCurrentPage - 1))}
                    disabled={safeCurrentPage === 1}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {pageButtons.map((item) =>
                    typeof item === "number" ? (
                        <button
                            key={item}
                            onClick={() => onPageChange(item)}
                            className={`grid h-9 min-w-9 place-items-center rounded-lg px-2 text-sm font-semibold transition ${safeCurrentPage === item ? "bg-indigo-600 text-white shadow-[0_8px_18px_rgba(79,70,229,0.35)]" : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}
                        >
                            {item}
                        </button>
                    ) : (
                        <span key={item} className="px-1 text-slate-400">
                            ...
                        </span>
                    ),
                )}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, safeCurrentPage + 1))}
                    disabled={safeCurrentPage === totalPages}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </nav>

            <div className="flex justify-center md:justify-end">
                <label className="relative inline-flex items-center">
                    <span className="sr-only">Items per page</span>
                    <select
                        value={itemsPerPage}
                        onChange={(event) => onItemsPerPageChange(Number(event.target.value))}
                        className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-semibold text-slate-600 outline-none transition hover:border-slate-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                    >
                        {PAGE_SIZE_OPTIONS.map((size) => (
                            <option key={size} value={size}>
                                {size} per page
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
                </label>
            </div>
        </div>
    );
}
