import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { posterUrl, tmdb } from "../api/tmdb";
import type { TmdbMovie } from "../api/tmdb";
import { tmdbExtra, type Genre } from "../api/tmdb";
import { useWishlist } from "../hooks/useWishlist";

type Sort = "popularity.desc" | "vote_average.desc" | "release_date.desc";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [genres, setGenres] = useState<Genre[]>([]);
    const [genreId, setGenreId] = useState<number | "">("");
    const [minVote, setMinVote] = useState<number>(0);
    const [sortBy, setSortBy] = useState<Sort>("popularity.desc");

    const [items, setItems] = useState<TmdbMovie[]>([]);
    const [loading, setLoading] = useState(false);

    const { isWished, toggle } = useWishlist();

    useEffect(() => {
        tmdbExtra.genres().then(setGenres).catch(() => {
            toast.error("장르 정보를 불러오지 못했습니다.");
        });
    }, []);

    const search = async () => {
        if (!query.trim()) {
            toast("검색어를 입력하세요");
            return;
        }
        try {
            setLoading(true);
            const res = await tmdb.search(query, 1);
            let list = res.results;

            if (genreId) {
                list = list.filter((m) => m.genre_ids?.includes(genreId));
            }
            list = list.filter((m) => (m.vote_average ?? 0) >= minVote);

            setItems(list);
        } catch (e: any) {
            toast.error(e?.message || "검색 실패");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setQuery("");
        setGenreId("");
        setMinVote(0);
        setSortBy("popularity.desc");
        setItems([]);
    };

    return (
        <div>
            <h1>찾아보기</h1>

            {/* Filters */}
            <div className="search__filters">
                <input
                    placeholder="영화 제목 검색"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <select value={genreId} onChange={(e) => setGenreId(Number(e.target.value) || "")}>
                    <option value="">전체 장르</option>
                    {genres.map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                </select>

                <select value={minVote} onChange={(e) => setMinVote(Number(e.target.value))}>
                    <option value={0}>전체 평점</option>
                    <option value={5}>5점 이상</option>
                    <option value={7}>7점 이상</option>
                    <option value={8}>8점 이상</option>
                </select>

                <button className="btn btn--primary" onClick={search}>검색</button>
                <button className="btn" onClick={reset}>초기화</button>
            </div>

            {loading && <p style={{ opacity: 0.7 }}>Loading...</p>}

            <div className="grid">
                {items.map((m) => {
                    const img = posterUrl(m.poster_path, "w342");
                    return (
                        <button
                            key={m.id}
                            className={`movieCard ${isWished(m.id) ? "is-wished" : ""}`}
                            onClick={() =>
                                toggle({ id: m.id, title: m.title, poster_path: posterUrl(m.poster_path, "w342") })
                            }
                        >
                            <div className="movieCard__poster">
                                {img ? <img src={img} alt={m.title} /> : <div className="movieCard__empty" />}
                            </div>
                            <div className="movieCard__meta">
                                <div className="movieCard__name">{m.title}</div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
