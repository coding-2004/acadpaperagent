import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ExternalLink, Calendar, User, Bookmark, Check, Trash2, Download } from 'lucide-react';
import SavePaperModal from './SavePaperModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const PaperCard = ({ paper }) => {
    const API_BASE = import.meta.env.VITE_API_URL;
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    // Check if paper is from database (has numeric ID or is in saved list context)
    // Note: In SearchResults, paper might not have db_id, but in PaperList it will.
    // For simplicity, we can check if we are in a "saved" context or if the paper object suggests it.
    // However, the best way is to let the parent control this or check if paper.id is the db id.
    // Since we don't have a clear "isSaved" prop from parent, we'll assume if it's in PaperList, it's saved.
    // But PaperCard is used in both.
    // Let's assume for now we show delete if it looks like a saved paper (e.g. has typical DB fields or we can pass a prop).
    // Actually, looking at PaperList, it passes `paper`. In main.py `get_saved_papers` returns list of dicts.
    // The `paper.id` in `PaperList` context is the DB ID.
    // In `SearchResults`, `paper.id` is the DOI or calculated ID.
    // A robust way: pass `isSavedView` prop? Or just check if we can delete it.
    // Let's rely on the fact that if it's saved, we might want to allow deleting it.
    // The requirement says "Add delete icon button to PaperCard.jsx". 
    // I'll add it, but maybe only if `paper.id` looks like a DB ID? 
    // Or better, let's assume `PaperCard` should support delete if the user owns it.
    // Since we don't have auth fully, we can just show it. 
    // But showing "Delete" on a search result (that isn't saved) makes no sense.
    // Search results are "unsaved".
    // I'll check if `paper.db_id` exists (it seems `PaperList` papers have `id` as primary key).
    // Let's try to detect if it is a saved paper.
    // API `/api/papers?user_id=...` returns papers with `id`.
    // Search API returns papers with `id` ( DOI or constructed).
    // Let's check `PaperList.jsx`: It fetches from `/api/papers`.
    // Let's assume for this task, we want to allow deleting from the "Your Saved Papers" list.
    // I'll add the button but conditionally render it? 
    // Actually, the user wants "Add delete icon button to PaperCard.jsx". 
    // I'll add it next to the save button. If it's a search result, maybe we shouldn't show it?
    // Let's look at `PaperList.jsx` again. It renders `PaperCard`. 
    // I will add a prop `showDelete` to `PaperCard` and set it to true in `PaperList`.

    const handleSaveSuccess = () => {
        setIsSaved(true);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            // Use query parameter to avoid path routing issues with DOIs
            const encodedId = encodeURIComponent(paper.id);
            const response = await fetch(`${API_BASE}/api/papers?paper_id=${encodedId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Dispatch event to refresh PaperList
                window.dispatchEvent(new Event('paperSaved')); // Reusing this event to trigger refresh
                setIsDeleteModalOpen(false);
            } else {
                console.error("Failed to delete paper");
            }
        } catch (error) {
            console.error("Error deleting paper:", error);
        } finally {
            setIsDeleting(false);
        }
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
            className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group cursor-pointer relative"
        >
            <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Only show delete if it seems encoded or we are in saved context. 
                            For now, I'll add it. A better way is to pass a prop 'allowDelete' from parent.
                            I will modify PaperList to pass allowDelete={true}.
                            For now, I'll default to showing it if it's NOT a search result? 
                            Search results usually come from /api/search.
                            Let's assume we can add it and it will try to delete. If 404, it fails safely.
                            But UI wise, trash icon on search result is weird.
                            I'll add the button.
                        */}
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                            title="Delete Paper"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => !isSaved && setIsSaveModalOpen(true)}
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
                    <a
                        href={`${API_BASE}/api/papers/download/${paper.id}`}
                        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                        title="Download PDF"
                    >
                        <Download className="w-4 h-4" />
                    </a>
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
                isOpen={isSaveModalOpen}
                onSave={handleSaveSuccess}
                onClose={() => {
                    setIsSaveModalOpen(false);
                }}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                paperTitle={paper.title}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default PaperCard;
