import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
    const location = useLocation();

    return (
        <div className="app">
            <Header />
            <main className="container">
                <div key={location.pathname} className="page">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
