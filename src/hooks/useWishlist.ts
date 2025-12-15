import { useMemo } from "react";
import type { WishMovie } from "../types/wishlist";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clear as clearAction, toggle as toggleAction } from "../store/wishlistSlice";

export function useWishlist() {
    const items = useAppSelector((state) => state.wishlist);
    const dispatch = useAppDispatch();

    const idSet = useMemo(() => new Set(items.map((m) => m.id)), [items]);

    const isWished = (id: number) => idSet.has(id);
    const toggle = (movie: WishMovie) => dispatch(toggleAction(movie));
    const clear = () => dispatch(clearAction());

    return { items, isWished, toggle, clear };
}
