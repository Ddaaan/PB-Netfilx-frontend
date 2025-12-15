import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaFireAlt, FaHeart, FaHome, FaSearch, FaSignOutAlt } from "react-icons/fa";
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
                        <FaHome />
                        <span>홈</span>
                    </NavLink>
                    <NavLink to="/popular" className={({ isActive }) => (isActive ? "nav__item active" : "nav__item")}>
                        <FaFireAlt />
                        <span>대세 콘텐츠</span>
                    </NavLink>
                    <NavLink to="/search" className={({ isActive }) => (isActive ? "nav__item active" : "nav__item")}>
                        <FaSearch />
                        <span>찾아보기</span>
                    </NavLink>
                    <NavLink to="/wishlist" className={({ isActive }) => (isActive ? "nav__item active" : "nav__item")}>
                        <FaHeart />
                        <span>내가 찜한 리스트</span>
                    </NavLink>
                </nav>
            </div>

            <div className="header__right">
                {user && <span className="user">안녕하세요, {user.id}</span>}
                {user && (
                    <button className="btn btn--ghost" type="button" onClick={onLogout}>
                        <FaSignOutAlt />
                        <span>로그아웃</span>
                    </button>
                )}
            </div>
        </header>
    );
}
