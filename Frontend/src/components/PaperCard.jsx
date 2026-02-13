import React from 'react';
import { FileText, ExternalLink, Calendar, User } from 'lucide-react';

const PaperCard = ({ paper }) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group">
            <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                    </div>
                    {paper.doi && (
                        <a
                            href={`https://doi.org/${paper.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </a>
                    )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                    {paper.title}
                </h3>

                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{paper.authors.join(', ')}</span>
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
                    <span className="text-xs font-bold px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full uppercase tracking-wider">
                        {paper.doi ? 'Research Paper' : 'Article'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PaperCard;
