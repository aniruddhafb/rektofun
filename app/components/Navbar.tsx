"use client";

import Image from "next/image";
import Link from "next/link";
import { useNavbar } from "@/app/hooks/useNavbar";
import {
    NavbarAuthSection,
    CreateProfileModal,
} from "@/app/components/navbar-components";
import { DepositModal } from "@/app/components/DepositModal";

export default function Navbar() {
    const {
        // UI state
        isDropdownOpen,
        setIsDropdownOpen,
        isDepositModalOpen,
        setIsDepositModalOpen,
        fundsModalMode,
        setFundsModalMode,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isMobileViewport,

        // Profile form state
        editUsername,
        setEditUsername,
        editBio,
        setEditBio,
        editProfileIndex,
        editInviteCode,
        setEditInviteCode,
        profileFormError,

        // User data
        userProfileData,
        displayAddress,
        displayUsername,

        // Connection state
        address,
        isConnected,

        // Handlers
        handleProfileSubmit,
        generateRandomUsername,
        randomizeProfile,
        handleConnect,
        handleLogout,
        profileHref,
    } = useNavbar();

    const usdcBalance = null; // fetched inside DepositModal / NavbarAuthSection independently

    return (
        <>
            {/* Simple Header - Logo, How it works, Social Icons, User Auth */}
            <nav className="fixed top-0 left-0 right-0 z-[40] bg-[#f3e1d7]/95 shadow-[0_2px_0_#111] backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Original Logo */}
                        <Link href="/" className="border-2 border-transparent px-2 py-1 transition-all hover:border-black hover:bg-white hover:shadow-[2px_2px_0_#111]">
                            <Image
                                src="/logos/mainlogo.png"
                                alt="REKTO"
                                width={220}
                                height={60}
                                className="h-6 sm:h-8 w-auto"
                                priority
                            />
                        </Link>

                        {/* Right side */}
                        <div className="flex items-center gap-4 sm:gap-6">
                            {/* How it works link - Desktop: text, Mobile: question mark icon */}
                            <a
                                href="https://rektofun.gitbook.io/rektofun/introduction/how-events-are-resolved"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-bold text-black hover:text-[#9945FF] transition-colors flex items-center gap-1"
                            >
                                {/* Desktop text */}
                                <span className="hidden sm:inline">How it works?</span>
                                {/* Mobile icon - Simple Question Mark */}
                                <span className="sm:hidden w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-[#9945FF] transition-colors font-bold text-lg leading-none">
                                    ?
                                </span>
                            </a>

                            {/* Social Icons */}
                            <div className="flex items-center gap-2 sm:gap-3">
                                {/* Twitter/X */}
                                <a
                                    href="https://x.com/Rektofun"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-[#9945FF] transition-colors"
                                    aria-label="Twitter"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>

                                {/* Discord */}
                                <a
                                    href="https://discord.gg/Uk22qDtzcQ"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-[#9945FF] transition-colors"
                                    aria-label="Discord"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                    </svg>
                                </a>
                            </div>

                            {/* User Auth Section */}
                            <NavbarAuthSection
                                authenticated={isConnected && !!address}
                                displayAddress={displayAddress || ""}
                                displayUsername={displayUsername}
                                displayProfileImage={userProfileData?.profileImage || null}
                                usdcBalance={usdcBalance}
                                isDropdownOpen={isDropdownOpen}
                                onAuth={handleConnect}
                                onCloseDropdown={() => setIsDropdownOpen(false)}
                                onLogout={handleLogout}
                                onMouseEnterDropdown={() => setIsDropdownOpen(true)}
                                onMouseLeaveDropdown={() => setIsDropdownOpen(false)}
                                onToggleDropdown={() => setIsDropdownOpen((prev) => !prev)}
                                onOpenDeposit={() => {
                                    setFundsModalMode("deposit");
                                    setIsDepositModalOpen(true);
                                }}
                                onOpenWithdraw={() => {
                                    setFundsModalMode("withdraw");
                                    setIsDepositModalOpen(true);
                                }}
                                profileHref={profileHref}
                                isMobileViewport={isMobileViewport}
                            />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Spacer for fixed header */}
            <div className="h-16" />

            {/* Deposit / Withdraw Modal */}
            <DepositModal
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)}
                initialMode={fundsModalMode}
            />

            {/* Create / Edit Profile Modal */}
            <CreateProfileModal
                isOpen={isProfileModalOpen}
                editProfileIndex={editProfileIndex}
                editUsername={editUsername}
                editBio={editBio}
                editInviteCode={editInviteCode}
                profileFormError={profileFormError}
                onRandomizeProfile={randomizeProfile}
                onRandomizeUsername={generateRandomUsername}
                onEditUsernameChange={setEditUsername}
                onEditBioChange={setEditBio}
                onEditInviteCodeChange={setEditInviteCode}
                onSubmit={handleProfileSubmit}
            />
        </>
    );
}
