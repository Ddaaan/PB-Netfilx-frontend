import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { WishMovie } from "../types/wishlist";
import { storage } from "../utils/storage";

export const WISHLIST_STORAGE_KEY = "movieWishlist";

const initialState: WishMovie[] = storage.get<WishMovie[]>(WISHLIST_STORAGE_KEY, []);

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        toggle: (state, action: PayloadAction<WishMovie>) => {
            const index = state.findIndex((movie) => movie.id === action.payload.id);
            if (index >= 0) {
                state.splice(index, 1);
            } else {
                state.unshift(action.payload);
            }
        },
        clear: () => [],
    },
});

export const { toggle, clear } = wishlistSlice.actions;
export default wishlistSlice.reducer;
