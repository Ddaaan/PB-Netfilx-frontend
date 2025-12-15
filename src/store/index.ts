import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer, { WISHLIST_STORAGE_KEY } from "./wishlistSlice";
import { storage } from "../utils/storage";

export const store = configureStore({
    reducer: {
        wishlist: wishlistReducer,
    },
});

store.subscribe(() => {
    const state = store.getState();
    storage.set(WISHLIST_STORAGE_KEY, state.wishlist);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
