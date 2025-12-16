import { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaClock, FaExternalLinkAlt, FaHeart, FaRegHeart, FaStar, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { posterUrl, tmdb } from "../../api/tmdb";
import type { TmdbMovieDetail } from "../../api/tmdb";
import { useWishlist } from "../../hooks/useWishlist";
import { useLockScroll } from "../../hooks/useLockScroll";

type Props = {
    movieId: number | null;
    onClose: () => void;
};

export default function MovieDetailModal({ movieId, onClose }: Props) {
    const [detail, setDetail] = useState<TmdbMovieDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const { isWished, toggle } = useWishlist();

    const wished = useMemo(() => (movieId ? isWished(movieId) : false), [isWished, movieId]);
    useLockScroll(Boolean(movieId));

    useEffect(() => {
        if (!movieId) {
            setDetail(null);
            return;
        }
        setLoading(true);
        tmdb.detail(movieId)
            .then(setDetail)
            .catch((e) => {
                toast.error(e?.message || "영화 상세 정보를 불러오지 못했습니다.");
            })
            .finally(() => setLoading(false));
    }, [movieId]);

    if (!movieId) return null;

    const poster = detail?.poster_path ? posterUrl(detail.poster_path, "w342") : null;
    const backdrop = detail?.backdrop_path ? posterUrl(detail.backdrop_path, "w500") : null;

    return (
        <div className="modal">
            <div className="modal__overlay" onClick={onClose} />
            <div className="modal__content">
                <button className="modal__close" type="button" onClick={onClose} aria-label="닫기">
                    <FaTimes />
                </button>

                {loading || !detail ? (
                    <div className="modal__loading">Loading...</div>
                ) : (
                    <>
                        <div className="modal__poster" style={{ backgroundImage: backdrop ? `url(${backdrop})` : undefined }}>
                            {poster ? <img src={poster} alt={detail.title} /> : <div className="movieCard__empty" />}
                        </div>

                        <div className="modal__body">
                            <h2 className="modal__title">{detail.title}</h2>
                            {detail.tagline && <p className="modal__tagline">{detail.tagline}</p>}

                            <div className="modal__meta">
                                {detail.vote_average && (
                                    <div>
                                        <FaStar /> {detail.vote_average.toFixed(1)}
                                    </div>
                                )}
                                {detail.release_date && (
                                    <div>
                                        <FaCalendarAlt /> {detail.release_date}
                                    </div>
                                )}
                                {detail.runtime && (
                                    <div>
                                        <FaClock /> {detail.runtime}분
                                    </div>
                                )}
                            </div>

                            {detail.genres && detail.genres.length > 0 && (
                                <div className="modal__genres">
                                    {detail.genres.map((g) => (
                                        <span key={g.id} className="genreChip">
                                            {g.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <p className="modal__overview">{detail.overview || "소개 문구가 없습니다."}</p>

                            <div className="modal__actions">
                                <button
                                    className={`btn ${wished ? "btn--ghost" : "btn--primary"}`}
                                    type="button"
                                    onClick={() => toggle({ id: detail.id, title: detail.title, poster_path: poster })}
                                >
                                    {wished ? (
                                        <>
                                            <FaHeart /> 찜에서 제거
                                        </>
                                    ) : (
                                        <>
                                            <FaRegHeart /> 추천 목록에 추가
                                        </>
                                    )}
                                </button>

                                {detail.homepage && (
                                    <a className="btn btn--ghost" href={detail.homepage} target="_blank" rel="noreferrer">
                                        <FaExternalLinkAlt /> 공식 사이트
                                    </a>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
