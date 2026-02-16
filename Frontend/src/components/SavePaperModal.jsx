import React, { useState, useEffect } from 'react';
import { X, Bookmark, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const SavePaperModal = ({ paper, isOpen, onClose, onSave }) => {
    const [readingLists, setReadingLists] = useState([]);
    const [selectedList, setSelectedList] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchReadingLists();
            setStatus('idle');
            setSelectedList('');
        }
    }, [isOpen]);

    const fetchReadingLists = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/reading-lists');
            const data = await response.json();
            setReadingLists(data);
        } catch (error) {
            console.error('Error fetching reading lists:', error);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        setStatus('loading');
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/papers/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paper: paper,
                    reading_list_id: selectedList ? parseInt(selectedList) : null,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setStatus('success');
                if (onSave) onSave();
                // Dispatch event to refresh PaperList
                window.dispatchEvent(new Event('paperSaved'));
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                throw new Error(data.detail || 'Failed to save paper');
            }
        } catch (error) {
            console.error('Save error:', error);
            setStatus('error');
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                                <Bookmark className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Save Paper</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">Paper to save:</p>
                        <p className="text-gray-900 dark:text-white font-bold leading-tight">{paper.title}</p>
                    </div>

                    {status === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in-95 duration-300">
                            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Saved Successfully!</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">This paper has been added to your collection.</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 mb-8">
                                <div>
                                    <label htmlFor="reading-list" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Select Reading List (Optional)
                                    </label>
                                    <select
                                        id="reading-list"
                                        value={selectedList}
                                        onChange={(e) => setSelectedList(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-gray-900 dark:text-white font-medium"
                                    >
                                        <option value="">None (General Collection)</option>
                                        {readingLists.map((list) => (
                                            <option key={list.id} value={list.id}>
                                                {list.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {status === 'error' && (
                                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p className="text-sm font-medium">{errorMessage}</p>
                                </div>
                            )}

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Bookmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    )}
                                    {isLoading ? 'Saving...' : 'Confirm Save'}
                                </button>
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-white dark:bg-transparent border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SavePaperModal;
