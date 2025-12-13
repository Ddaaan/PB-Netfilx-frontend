import { useWishlist } from "../hooks/useWishlist";

export default function WishlistPage() {
    const { items, clear } = useWishlist();

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h1>내가 찜한 리스트</h1>
                <button className="btn" onClick={clear} disabled={items.length === 0}>
                    전체 삭제
                </button>
            </div>

            {items.length === 0 ? (
                <p style={{ opacity: 0.7 }}>아직 찜한 영화가 없습니다.</p>
            ) : (
                <div className="grid">
                    {items.map((m) => (
                        <div key={m.id} className="card">
                            <div className="poster">
                                {m.poster_path ? (
                                    <img src={m.poster_path} alt={m.title} />
                                ) : (
                                    <div className="poster__empty">No Image</div>
                                )}
                            </div>
                            <div className="card__title">{m.title}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
