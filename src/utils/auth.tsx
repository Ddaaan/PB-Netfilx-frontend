import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { storage } from "./storage";

export interface User {
    id: string;       // email
    password: string; // TMDB API Key로 사용
}

const USERS_KEY = "users";
const LOGIN_KEY = "loginUser";

export function getUsers(): User[] {
    return storage.get<User[]>(USERS_KEY, []);
}

export function saveUsers(users: User[]) {
    storage.set(USERS_KEY, users);
}

export function getLoginUser(): User | null {
    return storage.get<User | null>(LOGIN_KEY, null);
}

export function setLoginUser(user: User) {
    storage.set(LOGIN_KEY, user);
    // 과제 조건: 비밀번호를 TMDB Key로 저장
    localStorage.setItem("TMDb-Key", user.password);
}

export function logout() {
    storage.remove(LOGIN_KEY);
    localStorage.removeItem("TMDb-Key");
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
    const user = getLoginUser();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }
    return <>{children}</>;
}
