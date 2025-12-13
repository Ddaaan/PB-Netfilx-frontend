import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AppRouter } from "./router";
import { restoreSessionFromStorage } from "./utils/auth";

export default function App() {
    useEffect(() => {
        restoreSessionFromStorage();
    }, []);

    return (
        <>
            <AppRouter />
            <Toaster position="top-right" />
        </>
    );
}
