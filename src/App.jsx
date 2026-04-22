import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import MovieGrid from "./components/MovieGrid";
import MovieCarousel from "./components/MovieCarousel";
import { useRecommendations } from "./hooks/useRecommendations";

export default function App() {
    const { movies, status, error, processInfo, fetchRecommendations } = useRecommendations();
    
    // isLoading stays true for both the initial trigger and the polling phase
    const isLoading = status === "LOADING";

    return (
        <div className="bg-gray-950 min-h-screen">
            <Hero>
                <SearchBar onSubmit={fetchRecommendations} loading={isLoading} />
                
                <MovieCarousel 
                    movies={movies} 
                    status={status} 
                    error={error} 
                    processInfo={processInfo} 
                />
            </Hero>
        </div>
    );
}