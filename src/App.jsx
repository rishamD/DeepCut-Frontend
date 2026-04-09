// App.jsx
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import MovieGrid from "./components/MovieGrid";
import { useRecommendations } from "./hooks/useRecommendations";

export default function App() {
    const { movies, status, error, fetchRecommendations } = useRecommendations();
    const loading = status === "LOADING" || status === "PENDING";

    return (
        <div className="bg-gray-950 min-h-screen">
            <Hero>
                <SearchBar onSubmit={fetchRecommendations} loading={loading} />
                <MovieGrid movies={movies} status={status} error={error} />
            </Hero>
        </div>
    );
}