import React from 'react';
import { FileText, Calendar, User, ExternalLink, Bookmark, Download } from 'lucide-react';

const PaperDetail = ({ paper }) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 p-10 md:p-16 shadow-2xl shadow-blue-500/5 relative overflow-hidden transition-all duration-300">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full -mr-20 -mt-20"></div>

            <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <div className="px-5 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Research Paper
                    </div>
                    {paper.reading_list_id && (
                        <div className="px-5 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            <Bookmark className="w-4 h-4" />
                            List #{paper.reading_list_id}
                        </div>
                    )}
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-8 leading-tight tracking-tight">
                    {paper.title}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 py-8 border-y border-gray-100 dark:border-gray-800/50">
                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Authors</h4>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400">
                                <User className="w-5 h-5" />
                            </div>
                            <p className="text-lg font-bold text-gray-700 dark:text-gray-200">
                                {paper.authors.join(', ')}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Publication Date</h4>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <p className="text-lg font-bold text-gray-700 dark:text-gray-200">
                                {paper.publication_date}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Abstract</h4>
                        {paper.doi && (
                            <div className="flex gap-4">
                                <a
                                    href={`http://127.0.0.1:8000/api/papers/download/${paper.id}`}
                                    className="flex items-center gap-2 text-sm font-bold text-green-600 dark:text-green-400 hover:underline"
                                >
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </a>
                                <a
                                    href={`https://doi.org/${paper.doi}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    View on DOI.org
                                </a>
                            </div>
                        )}
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/30 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-gray-800/50">
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium font-inter italic">
                            {paper.abstract}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-600 font-bold uppercase tracking-widest">
                    <span>Paper ID: {paper.id}</span>
                    <span className="w-1.5 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></span>
                    <span>DOI: {paper.doi}</span>
                </div>
            </div>
        </div>
    );
};

export default PaperDetail;
