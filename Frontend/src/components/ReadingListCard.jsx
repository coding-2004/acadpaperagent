import React from 'react';
import { Book, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReadingListCard = ({ list, onDelete }) => {
    const navigate = useNavigate();

    return (
        <div className="group relative flex flex-col p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-blue-500/5 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Book className="w-6 h-6" />
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(list.id);
                    }}
                    className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    title="Delete List"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                {list.name}
            </h3>

            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2 h-10">
                {list.description || "No description provided."}
            </p>

            <div className="mt-auto flex items-center justify-between">
                <span className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {list.paper_count} {list.paper_count === 1 ? 'Paper' : 'Papers'}
                </span>

                <button
                    onClick={() => navigate(`/reading-lists/${list.id}`)}
                    className="flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400 hover:gap-3 transition-all"
                >
                    View List <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default ReadingListCard;
