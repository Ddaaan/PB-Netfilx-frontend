import MovieRow from "../components/movies/MovieRow";
import { tmdb } from "../api/tmdb";

export default function HomePage() {
    return (
        <div>
            <h1 style={{ marginBottom: 12 }}>홈</h1>

            <MovieRow title="현재 상영작" fetcher={() => tmdb.nowPlaying(1)} />
            <MovieRow title="인기 영화" fetcher={() => tmdb.popular(1)} />
            <MovieRow title="평점 높은 영화" fetcher={() => tmdb.topRated(1)} />
            <MovieRow title="개봉 예정작" fetcher={() => tmdb.upcoming(1)} />
        </div>
    );
}
