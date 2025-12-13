import { Link, NavLink, useNavigate } from "react-router-dom";
import { getLoginUser, logout } from "../../utils/auth.tsx";

export default function Header() {
    const navigate = useNavigate();
    const user = getLoginUser();

    const onLogout = () => {
        logout();
        navigate("/signin");
    };

    return (
        <header className="header">
        <div className="header__left">
        <Link to="/" className="logo">
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
    찜 목록
    </NavLink>
    </nav>
    </div>

    <div className="header__right">
    {user && <span className="user">🙂 {user.id}</span>}
    <button className="btn" onClick={onLogout}>
        로그아웃
        </button>
        </div>
        </header>
);
}
