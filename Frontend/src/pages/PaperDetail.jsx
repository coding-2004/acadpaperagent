import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaperDetail from '../components/PaperDetail';
import CitationView from '../components/CitationView';
import { ArrowLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const PaperDetailPage = () => {
    const { id } = useParams();
    // Decode ID to handle DOIs
    const decodedId = decodeURIComponent(id);
    const navigate = useNavigate();
    const location = useLocation();

    // Initialize with state if available (for search results)
    const [paper, setPaper] = useState(location.state?.paper || null);
    const [isLoading, setIsLoading] = useState(!location.state?.paper);
    const [error, setError] = useState(null);

    const fetchPaperDetail = async () => {
        // If we already have paper data from state (e.g. search result), don't fetch
        if (paper && paper.id === decodedId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/papers/${encodeURIComponent(decodedId)}`);
            if (!response.ok) {
                if (response.status === 404) throw new Error('Paper not found or access denied');
                if (response.status === 403) throw new Error('You do not have permission to view this paper');
                throw new Error('Failed to fetch paper details');
            }
            const data = await response.json();
            setPaper(data.paper);
        } catch (err) {
            console.error('Error fetching paper detail:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch if we don't have the paper data loaded for this ID
        if (!paper || paper.id !== decodedId) {
            fetchPaperDetail();
        }
    }, [decodedId]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 flex flex-col font-inter">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4 max-w-5xl mx-auto w-full">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-10 group"
                >
                    <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                    Back to previous page
                </button>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
                        <p className="text-xl font-bold text-gray-900 dark:text-white">Retrieving full paper details...</p>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">This won't take long.</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-[3rem] p-16 text-center">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-8 text-red-600 dark:text-red-400">
                            <AlertCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Detail View Unavailable</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed">{error}</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={fetchPaperDetail}
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-500/25"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Retry Connection
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                ) : paper && (
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <PaperDetail paper={paper} />
                        <CitationView paper={paper} />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default PaperDetailPage;
