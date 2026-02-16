import React, { useState } from 'react';
import { Quote, Copy, Check } from 'lucide-react';

const CitationView = ({ paper }) => {
    const [copied, setCopied] = useState(false);

    // Basic format: Author(s). (Year). Title. DOI
    const citation = `${paper.authors.join(', ')}. (${paper.publication_date}). ${paper.title}. DOI: ${paper.doi}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(citation);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800/50 p-8 mt-12">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                        <Quote className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Citation</h3>
                </div>
                <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${copied
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Citation'}
                </button>
            </div>

            <div className="relative group">
                <p className="text-gray-700 dark:text-gray-300 font-serif italic leading-relaxed text-lg border-l-4 border-blue-500/20 pl-6 py-2">
                    {citation}
                </p>
                <div className="absolute top-0 right-0 py-2 text-[10px] font-black uppercase tracking-widest text-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    Standard Citation
                </div>
            </div>
        </div>
    );
};

export default CitationView;
