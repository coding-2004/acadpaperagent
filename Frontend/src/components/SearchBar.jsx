import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch, isLoading: externalLoading }) => {
    const API_BASE = import.meta.env.VITE_API_URL;
    const [query, setQuery] = useState('');
    const [selectedDatabases, setSelectedDatabases] = useState(['arxiv']);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    const isLoading = externalLoading || isSearching;

    const executeSearch = async (searchQuery) => {
        if (!searchQuery?.trim() || isLoading) return;

        setIsSearching(true);
        if (onSearch) onSearch(searchQuery);

        try {
            const response = await fetch(`${API_BASE}/api/search`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: searchQuery,
                    databases: selectedDatabases,
                }),
            });

            const data = await response.json();
            console.log("Search Results:", data);

            navigate("/search", { state: { results: data.results } });

        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        executeSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-11 pr-32 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl leading-5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-gray-900 dark:text-white shadow-sm font-inter"
                    placeholder="Search for academic papers, authors, or DOI..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className="absolute inset-y-2 right-2 flex">
                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 active:scale-95"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Search
                    </button>
                </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 items-center justify-center">
                <span className="text-xs text-gray-400 font-medium">Trending:</span>
                {['Quantum Computing', 'Climate Change', 'Neural Networks', 'Cybersecurity'].map((topic) => (
                    <button
                        key={topic}
                        type="button"
                        onClick={() => { setQuery(topic); executeSearch(topic); }}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        {topic}
                    </button>
                ))}
            </div>
        </form>
    );
};

export default SearchBar;
