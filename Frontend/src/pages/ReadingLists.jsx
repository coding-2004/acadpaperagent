import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReadingListCard from '../components/ReadingListCard';
import CreateListModal from '../components/CreateListModal';
import { Plus, BookOpen, Loader2, AlertCircle } from 'lucide-react';

const ReadingLists = () => {
    const API_BASE = import.meta.env.VITE_API_URL;
    const [lists, setLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchLists = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE}/api/reading-lists`);
            if (!response.ok) throw new Error("Failed to fetch reading lists");
            const data = await response.json();
            setLists(data.lists || []);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLists();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this list? Saved papers will be unassigned.")) return;

        try {
            const response = await fetch(`${API_BASE}/api/reading-lists/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchLists();
            } else {
                alert("Failed to delete list");
            }
        } catch (err) {
            console.error(err);
            alert("Error deleting list");
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 flex flex-col font-inter">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <BookOpen className="w-10 h-10 text-purple-600" />
                            Reading Lists
                        </h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl">
                            Organize your research papers into custom collections for better workflow.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-purple-500/25"
                    >
                        <Plus className="w-5 h-5" />
                        Create New List
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-6" />
                        <p className="text-xl font-bold text-gray-900 dark:text-white">Loading your collections...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-[2.5rem] p-16 text-center">
                        <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Failed to load lists</h3>
                        <p className="text-gray-500 dark:text-gray-400">{error}</p>
                    </div>
                ) : lists.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
                        <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <BookOpen className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No lists created yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">Start by creating your first reading list.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Create List
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {lists.map(list => (
                            <ReadingListCard
                                key={list.id}
                                list={list}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </main>

            <CreateListModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchLists}
            />

            <Footer />
        </div>
    );
};

export default ReadingLists;
