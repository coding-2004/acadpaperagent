import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ExternalLink, Calendar, User, Bookmark, Check } from 'lucide-react';
import SavePaperModal from './SavePaperModal';

const PaperCard = ({ paper }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const navigate = useNavigate();

    const handleSaveSuccess = () => {
        setIsSaved(true);
    };

    const handleNavigate = (e) => {
        // Prevent navigation if clicking on icons or buttons
        if (e.target.closest('button') || e.target.closest('a')) return;
        // Encode ID to handle DOIs with slashes
        navigate(`/papers/${encodeURIComponent(paper.id)}`, { state: { paper } });
    };


    return (
        <div
            onClick={handleNavigate}
            className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group cursor-pointer"
        >
            <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => !isSaved && setIsModalOpen(true)}
                            className={`p-2.5 rounded-xl transition-all ${isSaved
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 cursor-default'
                                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                }`}
                            title={isSaved ? "Saved" : "Save Paper"}
                        >
                            {isSaved ? <Check className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                        </button>
                        {paper.doi && (
                            <a
                                href={`https://doi.org/${paper.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                            >
                                <ExternalLink className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {paper.title}
                </h3>

                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        <span className="font-medium line-clamp-1">{paper.authors.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">{paper.publication_date}</span>
                    </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3">
                    {paper.abstract}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
                        Read Full Abstract
                    </button>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${isSaved
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                        }`}>
                        {isSaved ? 'Saved' : (paper.doi ? 'Research Paper' : 'Article')}
                    </span>
                </div>
            </div>

            <SavePaperModal
                paper={paper}
                isOpen={isModalOpen}
                onSave={handleSaveSuccess}
                onClose={() => {
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
};

export default PaperCard;
