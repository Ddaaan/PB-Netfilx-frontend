import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { posterUrl } from "../../api/tmdb";
import type { TmdbMovie } from "../../api/tmdb";
import { useWishlist } from "../../hooks/useWishlist";

type Props = {
    title: string;
    fetcher: () => Promise<{ results: TmdbMovie[] }>;
};

export default function MovieRow({ title, fetcher }: Props) {
    const [movies, setMovies] = useState<TmdbMovie[] | null>(null);
    const [loading, setLoading] = useState(false);

    const { isWished, toggle } = useWishlist();

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        fetcher()
            .then((data) => {
                if (!mounted) return;
                setMovies(data.results.slice(0, 12));
            })
            .catch((e) => {
                toast.error(e?.message || "영화 목록을 불러오지 못했어요.");
                setMovies([]);
            })
            .finally(() => setLoading(false));

        return () => {
            mounted = false;
        };
    }, [fetcher]);

    return (
        <section className="row">
            <div className="row__head">
                <h2 className="row__title">{title}</h2>
                {loading && (
                    <span className="row__loading">
                        <FaSpinner className="icon-spin" /> 불러오는 중
                    </span>
                )}
            </div>

            <div className="row__list">
                {(movies ?? Array.from({ length: 10 })).map((m: any, idx: number) => {
                    const id = m?.id ?? -idx;
                    const wished = m?.id ? isWished(m.id) : false;
                    const img = m?.poster_path ? posterUrl(m.poster_path, "w342") : null;

                    return (
                        <button
                            type="button"
                            key={id}
                            className={`movieCard ${wished ? "is-wished" : ""}`}
                            onClick={() => {
                                if (!m?.id) return;
                                toggle({ id: m.id, title: m.title, poster_path: posterUrl(m.poster_path, "w342") });
                            }}
                            title={m?.title || "loading"}
                        >
                            <div className="movieCard__poster">
                                {img ? <img src={img} alt={m.title} /> : <div className="movieCard__empty" />}
                            </div>
                            <div className="movieCard__meta">
                                <div className="movieCard__name">{m?.title ?? "불러오는 중..."}</div>
                                <div className="movieCard__desc">{m?.overview ? m.overview.slice(0, 60) + "..." : ""}</div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
