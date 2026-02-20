import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaperCard from '../components/PaperCard';
import { ArrowLeft, BookOpen, Loader2, AlertCircle, FileText } from 'lucide-react';

const ReadingListDetail = () => {
    const API_BASE = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const navigate = useNavigate();

    const [list, setList] = useState(null);
    const [papers, setPapers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch list details
            const listResponse = await fetch(`${API_BASE}/api/reading-lists/${id}`);
            if (!listResponse.ok) throw new Error("Reading list not found");
            const listData = await listResponse.json();
            setList(listData);

            // Fetch papers in this list
            const papersResponse = await fetch(`${API_BASE}/api/papers?reading_list_id=${id}`);
            if (!papersResponse.ok) throw new Error("Failed to fetch papers");
            const papersData = await papersResponse.json();
            setPapers(papersData.papers || []);

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Listen for updates (in case a paper is deleted from the list)
        const handleRefresh = () => fetchData();
        window.addEventListener('paperSaved', handleRefresh);
        return () => window.removeEventListener('paperSaved', handleRefresh);
    }, [id]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 flex flex-col font-inter">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4 max-w-7xl mx-auto w-full">
                <button
                    onClick={() => navigate('/reading-lists')}
                    className="flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors group mb-8"
                >
                    <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                    Back to Lists
                </button>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
                        <p className="text-xl font-bold text-gray-900 dark:text-white">Loading list details...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-[2.5rem] p-16 text-center">
                        <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error loading list</h3>
                        <p className="text-gray-500 dark:text-gray-400">{error}</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-12 bg-gray-50 dark:bg-gray-900/50 rounded-[3rem] p-10 border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-3xl rounded-full -mr-20 -mt-20"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-2xl">
                                        <BookOpen className="w-8 h-8" />
                                    </div>
                                    <h1 className="text-4xl font-black text-gray-900 dark:text-white">
                                        {list.name}
                                    </h1>
                                </div>
                                <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-3xl ml-2 mb-6">
                                    {list.description || "No description provided."}
                                </p>
                                <div className="flex flex-wrap gap-4 ml-2">
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm">
                                        {papers.length} Papers Collected
                                    </span>
                                    {list.created_at && (
                                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 shadow-sm">
                                            Created: {new Date(list.created_at).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {papers.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800 text-gray-400">
                                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-xl font-bold">This list is empty</h3>
                                <p className="mt-2">Papers saved to this list will appear here.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {papers.map(paper => (
                                    <PaperCard key={paper.db_id || paper.id} paper={paper} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ReadingListDetail;
