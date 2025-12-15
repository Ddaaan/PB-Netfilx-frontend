import { useWishlist } from "../hooks/useWishlist";

export default function WishlistPage() {
    const { items, clear, toggle } = useWishlist();

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <h1>내가 찜한 리스트</h1>
                <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn" type="button" onClick={clear} disabled={items.length === 0}>
                        전체 삭제
                    </button>
                </div>
            </div>

            {items.length === 0 ? (
                <p style={{ opacity: 0.7 }}>아직 찜한 영화가 없습니다.</p>
            ) : (
                <div className="grid">
                    {items.map((m) => (
                        <button key={m.id} type="button" className="card card--wishlist" onClick={() => toggle(m)}>
                            <div className="poster">
                                {m.poster_path ? (
                                    <img src={m.poster_path} alt={m.title} />
                                ) : (
                                    <div className="poster__empty">No Image</div>
                                )}
                            </div>
                            <div className="card__title">{m.title}</div>
                            <span className="card__action">클릭하면 추천 목록에서 제거됩니다.</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
