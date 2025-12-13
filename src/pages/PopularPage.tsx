import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { posterUrl, tmdb } from "../api/tmdb";
import type { TmdbMovie } from "../api/tmdb";
import { useWishlist } from "../hooks/useWishlist";

type ViewMode = "table" | "infinite";

export default function PopularPage() {
    const [mode, setMode] = useState<ViewMode>("infinite");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [items, setItems] = useState<TmdbMovie[]>([]);
    const [loading, setLoading] = useState(false);

    const { isWished, toggle } = useWishlist();
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const fetchPage = async (p: number, replace = false) => {
        try {
            setLoading(true);
            const res = await tmdb.popular(p);
            setTotalPages(res.total_pages);
            setItems((prev) => (replace ? res.results : [...prev, ...res.results]));
        } catch (e: any) {
            toast.error(e?.message || "인기 영화를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 모드/페이지 초기화
    useEffect(() => {
        setItems([]);
        setPage(1);
        fetchPage(1, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    // Infinite Scroll
    useEffect(() => {
        if (mode !== "infinite") return;
        const el = sentinelRef.current;
        if (!el) return;

        const io = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && page < totalPages) {
                    const next = page + 1;
                    setPage(next);
                    fetchPage(next);
                }
            },
            { rootMargin: "200px" }
        );

        io.observe(el);
        return () => io.disconnect();
    }, [mode, page, totalPages, loading]);

    const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <div>
            <div className="popular__head">
                <h1>대세 콘텐츠</h1>
                <div className="popular__actions">
                    <button
                        className={`btn ${mode === "table" ? "btn--primary" : ""}`}
                        onClick={() => setMode("table")}
                    >
                        Table View
                    </button>
                    <button
                        className={`btn ${mode === "infinite" ? "btn--primary" : ""}`}
                        onClick={() => setMode("infinite")}
                    >
                        Infinite Scroll
                    </button>
                </div>
            </div>

            {/* Table View */}
            {mode === "table" && (
                <>
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

                    <div className="pager">
                        <button className="btn" disabled={page <= 1} onClick={() => fetchPage(page - 1, true) && setPage(page - 1)}>
                            이전
                        </button>
                        <span>{page} / {totalPages}</span>
                        <button className="btn" disabled={page >= totalPages} onClick={() => fetchPage(page + 1, true) && setPage(page + 1)}>
                            다음
                        </button>
                    </div>
                </>
            )}

            {/* Infinite Scroll */}
            {mode === "infinite" && (
                <>
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

                    {loading && <p style={{ opacity: 0.7, marginTop: 12 }}>Loading...</p>}
                    <div ref={sentinelRef} />
                </>
            )}

            <button className="toTop" onClick={goTop}>Top</button>
        </div>
    );
}
