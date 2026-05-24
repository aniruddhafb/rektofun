"use client";

import { useEffect } from "react";

let activeLocks = 0;
let scrollY = 0;
let previousBodyOverflow = "";
let previousBodyPosition = "";
let previousBodyTop = "";
let previousBodyWidth = "";
let previousHtmlOverflow = "";
let previousHtmlOverscrollBehavior = "";

export function useBodyScrollLock(locked: boolean) {
    useEffect(() => {
        if (!locked) return;

        if (activeLocks === 0) {
            scrollY = window.scrollY;
            previousBodyOverflow = document.body.style.overflow;
            previousBodyPosition = document.body.style.position;
            previousBodyTop = document.body.style.top;
            previousBodyWidth = document.body.style.width;
            previousHtmlOverflow = document.documentElement.style.overflow;
            previousHtmlOverscrollBehavior = document.documentElement.style.overscrollBehavior;

            document.documentElement.style.overflow = "hidden";
            document.documentElement.style.overscrollBehavior = "none";
            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = "100%";
        }

        activeLocks += 1;

        return () => {
            activeLocks = Math.max(0, activeLocks - 1);

            if (activeLocks === 0) {
                document.body.style.overflow = previousBodyOverflow;
                document.body.style.position = previousBodyPosition;
                document.body.style.top = previousBodyTop;
                document.body.style.width = previousBodyWidth;
                document.documentElement.style.overflow = previousHtmlOverflow;
                document.documentElement.style.overscrollBehavior = previousHtmlOverscrollBehavior;
                window.scrollTo(0, scrollY);
            }
        };
    }, [locked]);
}
