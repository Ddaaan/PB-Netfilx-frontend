import { useEffect, useMemo, useState } from "react";
import { storage } from "../utils/storage";

export interface WishMovie {
    id: number;
    title: string;
    poster_path: string | null;
}

const KEY = "movieWishlist";

export function useWishlist() {
    const [items, setItems] = useState<WishMovie[]>(() =>
        storage.get<WishMovie[]>(KEY, [])
    );

    // 변경 시 localStorage 동기화
    useEffect(() => {
        storage.set(KEY, items);
    }, [items]);

    const idSet = useMemo(() => new Set(items.map((m) => m.id)), [items]);

    const isWished = (id: number) => idSet.has(id);

    const toggle = (movie: WishMovie) => {
        setItems((prev) => {
            const exists = prev.some((m) => m.id === movie.id);
            return exists
                ? prev.filter((m) => m.id !== movie.id)
                : [movie, ...prev];
        });
    };

    const clear = () => setItems([]);

    return { items, isWished, toggle, clear };
}
