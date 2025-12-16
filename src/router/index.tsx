import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { RequireAuth } from "../utils/auth.tsx";

import SignInPage from "../pages/SignInPage";
import HomePage from "../pages/HomePage";
import PopularPage from "../pages/PopularPage";
import SearchPage from "../pages/SearchPage";
import WishlistPage from "../pages/WishlistPage";
import ProfilePage from "../pages/ProfilePage";

export function AppRouter() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/signin" element={<SignInPage />} />

                <Route
                    path="/"
                    element={
                        <RequireAuth>
                            <Layout />
                        </RequireAuth>
                    }
                >
                    <Route index element={<HomePage />} />
                    <Route path="popular" element={<PopularPage />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="wishlist" element={<WishlistPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </HashRouter>
    );
}
