"use client";

import Image from "next/image";
import Link from "next/link";

export function NavbarBrand() {
    return (
        <div className="flex items-center gap-2 relative">
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
        </div>
    );
}
