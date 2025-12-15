import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getLoginUser, logout } from "../../utils/auth.tsx";

export default function Header() {
    const navigate = useNavigate();
    const user = getLoginUser();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 16);
        handleScroll();

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const onLogout = () => {
        logout();
        navigate("/signin");
    };

    return (
        <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
            <div className="header__left">
                <Link to="/" className="logo" aria-label="PBFLIX 홈으로 이동">
                    PBFLIX
                </Link>

                <nav className="nav">
                    <NavLink to="/" end className={({ isActive }) => (isActive ? "nav__item active" : "nav__item")}>
                        홈
                    </NavLink>
                    <NavLink to="/popular" className={({ isActive }) => (isActive ? "nav__item active" : "nav__item")}>
                        대세 콘텐츠
                    </NavLink>
                    <NavLink to="/search" className={({ isActive }) => (isActive ? "nav__item active" : "nav__item")}>
                        찾아보기
                    </NavLink>
                    <NavLink to="/wishlist" className={({ isActive }) => (isActive ? "nav__item active" : "nav__item")}>
                        내가 찜한 리스트
                    </NavLink>
                </nav>
            </div>

            <div className="header__right">
                {user && <span className="user">안녕하세요, {user.id}</span>}
                <button className="btn" type="button" onClick={onLogout}>
                    로그아웃
                </button>
            </div>
        </header>
    );
}
