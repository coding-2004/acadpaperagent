import React, { useState, useEffect } from 'react';
import { Book, FileText, Bookmark, Loader2, AlertCircle, RefreshCw, Search } from 'lucide-react';
import PaperCard from './PaperCard';

const PaperList = () => {
    const [papers, setPapers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPapers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/papers');
            if (!response.ok) {
                throw new Error('Failed to fetch saved papers');
            }
            const data = await response.json();
            setPapers(data.papers || []);
        } catch (err) {
            console.error('Error fetching papers:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPapers();

        // Optional: Listen for paper saved events to refresh the list
        const handlePaperSaved = () => fetchPapers();
        window.addEventListener('paperSaved', handlePaperSaved);

        return () => {
            window.removeEventListener('paperSaved', handlePaperSaved);
        };
    }, []);

    if (isLoading) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Crunching your library...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-[2.5rem] p-12 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">{error}</p>
                <button
                    onClick={fetchPapers}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-500/25"
                >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Bookmark className="w-6 h-6 text-blue-600" />
                    Your Saved Papers
                </h2>
                <div className="flex gap-2">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50 uppercase tracking-wider">
                        {papers.length} Papers Total
                    </span>
                    <button
                        onClick={fetchPapers}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                        title="Refresh List"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {papers.length === 0 ? (
                <div className="bg-white dark:bg-gray-950 border border-dashed border-gray-200 dark:border-gray-800/50 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center transition-all">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-6">
                        <FileText className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No papers saved yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
                        Search for academic papers using the search bar above and save them to your personal collection for quick access.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/25"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Start Searching
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {papers.map((paper) => (
                        <PaperCard key={paper.db_id} paper={paper} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaperList;
