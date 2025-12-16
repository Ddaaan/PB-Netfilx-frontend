import { useState } from "react";
import { FaHeart, FaHeartBroken, FaTrashAlt } from "react-icons/fa";
import { useWishlist } from "../hooks/useWishlist";
import MovieDetailModal from "../components/movies/MovieDetailModal";

export default function WishlistPage() {
    const { items, clear } = useWishlist();
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <h1 className="page__title">
                    <FaHeart />
                    <span>내가 찜한 리스트</span>
                </h1>
                <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn--ghost" type="button" onClick={clear} disabled={items.length === 0}>
                        <FaTrashAlt /> 전체 삭제
                    </button>
                </div>
            </div>

            {items.length === 0 ? (
                <p className="wishlist__empty">
                    <FaHeartBroken /> 아직 찜한 영화가 없습니다.
                </p>
            ) : (
                <div className="grid">
                    {items.map((m) => (
                        <button key={m.id} type="button" className="card card--wishlist" onClick={() => setSelectedId(m.id)}>
                            <div className="poster">
                                {m.poster_path ? (
                                    <img src={m.poster_path} alt={m.title} />
                                ) : (
                                    <div className="poster__empty">No Image</div>
                                )}
                            </div>
                            <div className="card__title">{m.title}</div>
                            <span className="card__action">클릭하면 상세 정보를 확인할 수 있습니다.</span>
                        </button>
                    ))}
                </div>
            )}

            <MovieDetailModal movieId={selectedId} onClose={() => setSelectedId(null)} />
        </div>
    );
}
