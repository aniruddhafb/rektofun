import Image from "next/image";
import { BadgeCheck, UserPlus } from "lucide-react";
import type { Master } from "./types";

type Props = {
    master: Master;
    isOwnCard: boolean;
    isFollowing: boolean;
    isFollowLoading: boolean;
    canFollow: boolean;
    onViewProfile: (walletAddress: string) => void;
    onToggleFollow: (walletAddress: string) => void;
};

export function MasterCard({
    master,
    isOwnCard,
    isFollowing,
    isFollowLoading,
    canFollow,
    onViewProfile,
    onToggleFollow,
}: Props) {
    return (
        <article className="group mx-auto flex h-full w-full max-w-[400px] flex-col overflow-hidden rounded border border-gray-400 bg-white/70 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gray-300/80 hover:shadow-xl md:max-w-[350px]">
            <div className="relative h-[88px] overflow-hidden rounded-[8px] border border-[#d9d0ef]" style={{ background: master.banner }}>
                <div className="absolute inset-0 opacity-75 [background-image:linear-gradient(rgba(164,140,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(164,140,255,0.25)_1px,transparent_1px)] [background-size:24px_24px]" />
                <div className="absolute inset-0 opacity-65 [background-image:linear-gradient(0deg,transparent_0_58%,rgba(126,90,235,0.38)_58%_72%,transparent_72%_100%),linear-gradient(90deg,transparent_0_35%,rgba(126,90,235,0.4)_35%_48%,transparent_48%_100%)] [background-size:84px_84px] [background-position:0_0,14px_8px]" />
            </div>

            <div className="-mt-9 flex justify-center">
                <button
                    type="button"
                    onClick={() => onViewProfile(master.walletAddress)}
                    className="relative h-[80px] w-[80px] cursor-pointer rounded-full border-4 border-white bg-slate-100 shadow-[0_4px_12px_rgba(15,23,42,0.18)]"
                    aria-label={`View ${master.name}'s profile`}
                >
                    <Image src={master.avatarPath} alt={`${master.name} avatar`} fill sizes="80px" className="rounded-full object-cover" />
                    {master.verified ? (
                        <span className="absolute -bottom-1 -right-1 z-10 grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-[#2f7bff] text-white shadow-[0_3px_8px_rgba(47,123,255,0.45)]">
                            <BadgeCheck className="h-3.5 w-3.5" />
                        </span>
                    ) : null}
                </button>
            </div>

            <div className="mt-4 text-center">
                <h2 className="text-[21px] leading-tight font-black text-slate-900">{master.name}</h2>
                <p className="mt-1 text-base font-semibold text-slate-500">{master.username}</p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div>
                    <p className="text-[14px] leading-none font-black text-slate-900">{master.challenges}</p>
                    <p className="mt-1 text-[12px] font-semibold text-slate-500">Challenges</p>
                </div>
                <div>
                    <p className="text-[14px] leading-none font-black text-slate-900">+{master.wins}</p>
                    <p className="mt-1 text-[12px] font-semibold text-slate-500">Wins</p>
                </div>
                <div>
                    <p className="text-[14px] leading-none font-black text-slate-900">{master.rekts}</p>
                    <p className="mt-1 text-[12px] font-semibold text-slate-500">Rekts</p>
                </div>
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    onClick={() => onViewProfile(master.walletAddress)}
                    className="flex-1 cursor-pointer rounded-xl border border-[#e6e2f0] bg-white/80 px-3 py-3 text-sm font-bold text-[#5a4fff] transition hover:bg-[#f5f3ff]"
                >
                    View Profile
                </button>
                <button
                    onClick={() => onToggleFollow(master.walletAddress)}
                    disabled={!canFollow || isOwnCard || isFollowLoading}
                    title={!canFollow ? "Connect wallet to follow users" : isOwnCard ? "You cannot follow yourself" : ""}
                    className={`grid h-11 w-11 place-items-center rounded-xl border transition disabled:opacity-50 disabled:cursor-not-allowed ${isFollowing ? "cursor-pointer border-blue-600 bg-blue-500 text-white hover:bg-blue-700" : "cursor-pointer border-[#e6e2f0] bg-white/80 text-slate-500 hover:bg-slate-50"}`}
                >
                    {isFollowLoading ? <span className="text-[10px] font-bold">...</span> : <UserPlus className="h-4 w-4" />}
                </button>
            </div>
        </article>
    );
}
