import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaperCard from '../components/PaperCard';
import { ArrowLeft, Search } from 'lucide-react';

const SearchResults = () => {
    const location = useLocation();
    const papers = location.state?.results || [];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 flex flex-col font-inter">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4 max-w-7xl mx-auto w-full">
                <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Search <span className="text-blue-600">Results</span>
                        </h1>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            Showing {papers.length} {papers.length === 1 ? 'paper' : 'papers'} found
                        </p>
                    </div>
                </div>

                {papers.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-[2.5rem] p-20 text-center border border-dashed border-gray-200 dark:border-gray-800">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No results found</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                            We couldn't find any papers matching your search. Try adjusting your query or selecting different databases.
                        </p>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/25"
                        >
                            Try Another Search
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {papers.map((paper, index) => (
                            <PaperCard key={index} paper={paper} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default SearchResults;
