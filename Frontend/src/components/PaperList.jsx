import React from 'react';
import { Book, FileText, Bookmark } from 'lucide-react';

const PaperList = () => {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Bookmark className="w-6 h-6 text-blue-600" />
                    Your Saved Papers
                </h2>
                <div className="flex gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        0 Papers Total
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-800 rounded-3xl p-16 flex flex-col items-center justify-center text-center transition-all">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
                    <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No papers saved yet</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
                    Search for academic papers using the search bar above and save them to your personal collection for quick access.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25">
                        Start Searching
                    </button>
                    <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 dark:border-gray-700 text-base font-semibold rounded-2xl text-gray-600 dark:text-gray-300 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                        Learn How
                    </button>
                </div>
            </div>

            {/* Placeholder for future list items */}
            {/* 
            <div className="space-y-4 mt-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/4"></div>
                    </div>
                ))}
            </div> 
            */}
        </div>
    );
};

export default PaperList;
