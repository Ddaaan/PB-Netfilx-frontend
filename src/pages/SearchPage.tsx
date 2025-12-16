import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFilter, FaHistory, FaRedo, FaSearch, FaSpinner } from "react-icons/fa";
import { posterUrl, tmdb } from "../api/tmdb";
import type { TmdbMovie } from "../api/tmdb";
import { tmdbExtra, type Genre } from "../api/tmdb";
import { useWishlist } from "../hooks/useWishlist";
import { storage } from "../utils/storage";
import MovieDetailModal from "../components/movies/MovieDetailModal";

type SortOption = "popularity" | "vote" | "release";

type SearchPreset = {
    query: string;
    genreId: number | "";
    minVote: number;
    sortBy: SortOption;
};

const HISTORY_KEY = "searchHistory";
const HISTORY_LIMIT = 5;

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [genres, setGenres] = useState<Genre[]>([]);
    const [genreId, setGenreId] = useState<number | "">("");
    const [minVote, setMinVote] = useState<number>(0);
    const [sortBy, setSortBy] = useState<SortOption>("popularity");

    const [items, setItems] = useState<TmdbMovie[]>([]);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<SearchPreset[]>(() => storage.get<SearchPreset[]>(HISTORY_KEY, []));
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const { isWished } = useWishlist();

    useEffect(() => {
        tmdbExtra.genres().then(setGenres).catch(() => {
            toast.error("장르 정보를 불러오지 못했습니다.");
        });
    }, []);

    const search = async () => {
        const text = query.trim();
        if (!text) {
            toast("검색어를 입력하세요");
            return;
        }
        try {
            setLoading(true);
            const res = await tmdb.search(text, 1);
            let list = res.results.slice();

            if (genreId) {
                list = list.filter((m) => m.genre_ids?.includes(genreId));
            }
            list = list.filter((m) => (m.vote_average ?? 0) >= minVote);

            list.sort((a, b) => {
                if (sortBy === "vote") return (b.vote_average ?? 0) - (a.vote_average ?? 0);
                if (sortBy === "release") {
                    return (b.release_date ?? "").localeCompare(a.release_date ?? "");
                }
                return (b.popularity ?? 0) - (a.popularity ?? 0);
            });

            setItems(list);

            const preset: SearchPreset = { query: text, genreId, minVote, sortBy };
            setHistory((prev) => {
                const filtered = prev.filter((p) => p.query !== preset.query);
                const next = [preset, ...filtered].slice(0, HISTORY_LIMIT);
                storage.set(HISTORY_KEY, next);
                return next;
            });
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
        setItems([]);
        setSortBy("popularity");
    };

    const loadPreset = (preset: SearchPreset) => {
        setQuery(preset.query);
        setGenreId(preset.genreId);
        setMinVote(preset.minVote);
        setSortBy(preset.sortBy);
        toast("이전에 검색한 조건을 불러왔어요.");
    };

    const clearHistory = () => {
        setHistory([]);
        storage.remove(HISTORY_KEY);
    };

    return (
        <div>
            <h1 className="page__title">
                <FaSearch />
                <span>찾아보기</span>
            </h1>
            {history.length > 0 && (
                <div className="search__history">
                    <div className="search__historyHead">
                        <span>
                            <FaHistory /> 최근 검색
                        </span>
                        <button className="link" type="button" onClick={clearHistory}>
                            전체지우기
                        </button>
                    </div>
                    <div className="search__historyList">
                        {history.map((preset) => (
                            <button
                                key={`${preset.query}-${preset.genreId}-${preset.minVote}-${preset.sortBy}`}
                                className="chip"
                                type="button"
                                onClick={() => loadPreset(preset)}
                            >
                                {preset.query}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="search__filters">
                <div className="search__filtersHead">
                    <FaFilter />
                    <span>필터 옵션</span>
                </div>
                <div className="search__inputs">
                    <input
                        placeholder="영화 제목 검색"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="search__selects">
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

                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
                            <option value="popularity">인기순</option>
                            <option value="vote">평점순</option>
                            <option value="release">최신 개봉</option>
                        </select>
                    </div>
                </div>

                <div className="search__actions">
                    <button className="btn btn--ghost" type="button" onClick={reset}>
                        <FaRedo /> 초기화
                    </button>
                    <button className="btn btn--primary" type="button" onClick={search}>
                        <FaSearch /> 검색
                    </button>
                </div>
            </div>

            {loading && (
                <p className="search__loading">
                    <FaSpinner className="icon-spin" /> Loading...
                </p>
            )}

            <div className="grid">
                {items.map((m) => {
                    const img = posterUrl(m.poster_path, "w342");
                    return (
                        <button
                            key={m.id}
                            className={`movieCard ${isWished(m.id) ? "is-wished" : ""}`}
                            onClick={() => setSelectedId(m.id)}
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

            <MovieDetailModal movieId={selectedId} onClose={() => setSelectedId(null)} />
        </div>
    );
}
