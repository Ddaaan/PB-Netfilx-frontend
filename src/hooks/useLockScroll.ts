import { useEffect } from "react";

/**
 * Locks the <body> scroll when active.
 * Useful for modal/table views that must remain fixed.
 */
export function useLockScroll(active: boolean) {
    useEffect(() => {
        if (!active || typeof document === "undefined") return;
        const allowLock = typeof window === "undefined" ? true : window.innerWidth >= 768;
        if (!allowLock) return;

        const { style } = document.body;
        const prevOverflow = style.overflow;
        const prevPadding = style.paddingRight;
        const scrollbarWidth =
            typeof window !== "undefined" ? window.innerWidth - document.documentElement.clientWidth : 0;

        if (scrollbarWidth > 0) {
            style.paddingRight = `${scrollbarWidth}px`;
        }
        style.overflow = "hidden";

        return () => {
            style.overflow = prevOverflow;
            style.paddingRight = prevPadding;
        };
    }, [active]);
}
