import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RelatedPapers = ({ paperId }) => {
    const API_BASE = import.meta.env.VITE_API_URL;
    const [relatedPapers, setRelatedPapers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!paperId) return;

        const fetchRelated = async () => {
            setLoading(true);
            setError(null);

            try {
                const encodedId = encodeURIComponent(paperId);
                const response = await fetch(`${API_BASE}/api/papers/${encodedId}/related`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to fetch related papers');
                }

                const data = await response.json();
                if (data.success) {
                    setRelatedPapers(data.related || []);
                } else {
                    throw new Error(data.error || 'Invalid response');
                }
            } catch (err) {
                console.error("Related Papers Error:", err);
                setError(err.message || 'Failed to find related papers');
            } finally {
                setLoading(false);
            }
        };

        fetchRelated();
    }, [paperId]);

    const handlePaperClick = (id) => {
        // Navigate to the related paper
        navigate(`/papers/${encodeURIComponent(id)}`);
    };

    if (!paperId) return null;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 p-10 md:p-16 shadow-2xl shadow-blue-500/5 mt-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">Related Research</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">AI-curated recommendations</p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
                        Analyzing semantic similarities...
                    </p>
                </div>
            ) : error ? (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-800">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="font-medium text-sm">{error}</p>
                </div>
            ) : relatedPapers.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
                    No related papers found in your library.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedPapers.map((paper) => (
                        <div
                            key={paper.id}
                            onClick={() => handlePaperClick(paper.id)}
                            className="group relative flex flex-col p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${paper.similarity >= 90 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    paper.similarity >= 75 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                        'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                                    }`}>
                                    {paper.similarity}% Match
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {paper.title}
                            </h3>

                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-4 line-clamp-2 flex-grow">
                                {paper.reason}
                            </p>

                            <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold text-sm mt-auto group-hover:translate-x-1 transition-transform">
                                View Paper <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RelatedPapers;
