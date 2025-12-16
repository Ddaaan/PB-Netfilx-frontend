import { useMemo, useState } from "react";
import { FaHeart, FaPen, FaRegClock, FaUser } from "react-icons/fa";
import { storage } from "../utils/storage";
import { getLoginUser } from "../utils/auth";
import { useWishlist } from "../hooks/useWishlist";

const BIO_KEY = "profileBio";
const THEME_KEY = "profileTheme";

const themes = [
    { id: "sunset", name: "Sunset Glow", gradient: "linear-gradient(120deg,#f8a5c2,#fbc531)" },
    { id: "midnight", name: "Midnight", gradient: "linear-gradient(120deg,#485563,#29323c)" },
    { id: "neon", name: "Neon", gradient: "linear-gradient(120deg,#8e2de2,#4a00e0)" },
];

export default function ProfilePage() {
    const user = getLoginUser();
    const [bio, setBio] = useState(() => storage.get<string>(BIO_KEY, "TMDB 애호가, 넷플릭스 탐험가"));
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(bio);
    const [theme, setTheme] = useState(() => storage.get<string>(THEME_KEY, themes[0].id));

    const { items } = useWishlist();

    const selectedTheme = useMemo(() => themes.find((t) => t.id === theme) ?? themes[0], [theme]);

    const handleSave = () => {
        setBio(draft);
        storage.set(BIO_KEY, draft);
        setEditing(false);
    };

    const handleTheme = (id: string) => {
        setTheme(id);
        storage.set(THEME_KEY, id);
    };

    return (
        <div className="profile">
            <section className="profile__hero" style={{ backgroundImage: selectedTheme.gradient }}>
                <div className="profile__avatar">
                    <FaUser />
                </div>
                <div>
                    <h1>{user?.id || "Guest"}</h1>
                    <p>{bio}</p>
                    <div className="profile__actions">
                        {editing ? (
                            <>
                                <button className="btn btn--primary" type="button" onClick={handleSave}>
                                    저장
                                </button>
                                <button className="btn btn--ghost" type="button" onClick={() => setEditing(false)}>
                                    취소
                                </button>
                            </>
                        ) : (
                            <button className="btn btn--ghost" type="button" onClick={() => setEditing(true)}>
                                <FaPen /> 소개 수정
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {editing && (
                <section className="profile__panel">
                    <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="자기소개를 입력하세요." />
                </section>
            )}

            <section className="profile__panel">
                <h2>나의 즐겨찾기 테마</h2>
                <p className="profile__desc">대시보드와 Hero 배경에 적용되는 분위기를 선택하세요.</p>
                <div className="profile__themes">
                    {themes.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            className={`themeCard ${theme === t.id ? "is-active" : ""}`}
                            onClick={() => handleTheme(t.id)}
                            style={{ backgroundImage: t.gradient }}
                        >
                            {t.name}
                        </button>
                    ))}
                </div>
            </section>

            <section className="profile__panel">
                <div className="profile__panelHead">
                    <h2>
                        <FaHeart /> 최근 찜한 영화
                    </h2>
                    <span>{items.length} titles</span>
                </div>
                {items.length === 0 ? (
                    <p className="profile__empty">
                        <FaRegClock /> 아직 찜한 영화가 없습니다.
                    </p>
                ) : (
                    <div className="profile__wishlist">
                        {items.slice(0, 6).map((movie) => (
                            <div key={movie.id} className="profileMovie">
                                <div className="profileMovie__poster">
                                    {movie.poster_path ? (
                                        <img src={movie.poster_path} alt={movie.title} />
                                    ) : (
                                        <div className="poster__empty">No Image</div>
                                    )}
                                </div>
                                <div className="profileMovie__info">
                                    <div className="profileMovie__title">{movie.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
