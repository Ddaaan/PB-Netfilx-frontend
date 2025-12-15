import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowUp, FaSpinner, FaStream, FaTable } from "react-icons/fa";
import { posterUrl, tmdb } from "../api/tmdb";
import type { TmdbMovie } from "../api/tmdb";
import { useWishlist } from "../hooks/useWishlist";
import { useLockScroll } from "../hooks/useLockScroll";

type ViewMode = "table" | "infinite";
const TABLE_PAGE_SIZE = 8;

export default function PopularPage() {
    const [mode, setMode] = useState<ViewMode>("infinite");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [items, setItems] = useState<TmdbMovie[]>([]);
    const [loading, setLoading] = useState(false);

    const { isWished, toggle } = useWishlist();
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useLockScroll(mode === "table");

    const fetchPage = async (p: number, replace = false) => {
        try {
            setLoading(true);
            const res = await tmdb.popular(p);
            setTotalPages(res.total_pages);
            const processed = mode === "table" ? res.results.slice(0, TABLE_PAGE_SIZE) : res.results;
            setItems((prev) => (replace ? processed : [...prev, ...processed]));
        } catch (e: any) {
            toast.error(e?.message || "인기 영화를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setItems([]);
        setPage(1);
        fetchPage(1, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

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

    const changePage = (next: number) => {
        const safe = Math.min(Math.max(next, 1), totalPages);
        if (safe === page) return;
        setPage(safe);
        fetchPage(safe, true);
    };

    return (
        <div>
            <div className="popular__head">
                <div>
                    <h1>대세 콘텐츠</h1>
                    <p className="popular__sub">테이블/무한 스크롤 뷰를 선택해 TMDB 인기 영화를 탐색하세요.</p>
                </div>
                <div className="popular__actions">
                    <button
                        type="button"
                        className={`btn ${mode === "table" ? "btn--primary" : ""}`}
                        onClick={() => setMode("table")}
                    >
                        <FaTable />
                        <span>Table View</span>
                    </button>
                    <button
                        type="button"
                        className={`btn ${mode === "infinite" ? "btn--primary" : ""}`}
                        onClick={() => setMode("infinite")}
                    >
                        <FaStream />
                        <span>Infinite Scroll</span>
                    </button>
                </div>
            </div>

            {mode === "table" && (
                <>
                    <div className="popular__tableWrapper">
                        <table className="popular__table">
                            <thead>
                                <tr>
                                    <th>포스터</th>
                                    <th>제목</th>
                                    <th>평균 평점</th>
                                    <th>개봉일</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((m) => {
                                    const img = posterUrl(m.poster_path, "w185");
                                    return (
                                        <tr key={m.id}>
                                            <td>
                                                <button
                                                    type="button"
                                                    className={`movieThumb ${isWished(m.id) ? "is-wished" : ""}`}
                                                    onClick={() =>
                                                        toggle({
                                                            id: m.id,
                                                            title: m.title,
                                                            poster_path: posterUrl(m.poster_path, "w342"),
                                                        })
                                                    }
                                                >
                                                    {img ? <img src={img} alt={m.title} /> : <span>이미지 없음</span>}
                                                </button>
                                            </td>
                                            <td>{m.title}</td>
                                            <td>{m.vote_average ? m.vote_average.toFixed(1) : "-"}</td>
                                            <td>{m.release_date ?? "-"}</td>
                                            <td>{isWished(m.id) ? "추천됨" : "찜하기"}</td>
                                        </tr>
                                    );
                                })}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: "center", opacity: 0.7 }}>
                                            데이터를 불러오는 중입니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pager">
                        <button className="btn" type="button" disabled={page <= 1} onClick={() => changePage(page - 1)}>
                            이전 페이지
                        </button>
                        <span className="pager__page">
                            {page} / {totalPages}
                        </span>
                        <button className="btn" type="button" disabled={page >= totalPages} onClick={() => changePage(page + 1)}>
                            다음 페이지
                        </button>
                    </div>
                </>
            )}

            {mode === "infinite" && (
                <>
                    <div className="grid">
                        {items.map((m) => {
                            const img = posterUrl(m.poster_path, "w342");
                            return (
                                <button
                                    type="button"
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
                                        <div className="movieCard__desc">
                                            {m.overview ? m.overview.slice(0, 60) + "..." : "상세 설명 없음"}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {loading && (
                        <p className="popular__loading">
                            <FaSpinner className="icon-spin" /> Loading...
                        </p>
                    )}
                    <div ref={sentinelRef} />
                    <button className="toTop" type="button" onClick={goTop}>
                        <FaArrowUp />
                    </button>
                </>
            )}
        </div>
    );
}
