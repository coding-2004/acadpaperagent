import React, { useState, useEffect } from 'react';
import { Quote, Check, Copy, ChevronDown, Loader2 } from 'lucide-react';

const CitationView = ({ paper }) => {
    const [selectedFormat, setSelectedFormat] = useState('APA');
    const [citationText, setCitationText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const formats = ['APA', 'MLA', 'Chicago', 'Harvard', 'IEEE', 'BibTeX'];

    useEffect(() => {
        if (!paper?.id) return;

        const fetchCitation = async () => {
            setLoading(true);
            setError(null);
            setCitationText('');

            try {
                // Encode paper ID to handle special characters (like slashes in DOIs/IDs)
                const encodedId = encodeURIComponent(paper.id);
                const response = await fetch(`http://127.0.0.1:8000/api/papers/${encodedId}/citation?format=${selectedFormat}`);

                if (!response.ok) {
                    throw new Error('Failed to generate citation');
                }

                const data = await response.json();
                if (data.success) {
                    setCitationText(data.citation);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (err) {
                console.error("Citation Error:", err);
                setError('Failed to generate citation. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCitation();
    }, [paper, selectedFormat]);

    const handleCopy = () => {
        if (!citationText) return;
        navigator.clipboard.writeText(citationText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!paper) return null;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 p-10 md:p-16 shadow-2xl shadow-blue-500/5 mt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl">
                        <Quote className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Citations</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Cite this paper in your research</p>
                    </div>
                </div>

                {/* Format Selector */}
                <div className="relative">
                    <select
                        value={selectedFormat}
                        onChange={(e) => setSelectedFormat(e.target.value)}
                        className="appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white py-3 pl-4 pr-10 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                        disabled={loading}
                    >
                        {formats.map(format => (
                            <option key={format} value={format}>{format}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
            </div>

            <div className="group bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-300 min-h-[120px] relative">
                <div className="flex justify-between items-start gap-4 mb-3">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        {selectedFormat} Output
                    </span>

                    {!loading && !error && citationText && (
                        <button
                            onClick={handleCopy}
                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all"
                            title="Copy to clipboard"
                        >
                            {copied ? (
                                <Check className="w-4 h-4 text-green-500" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </button>
                    )}
                </div>

                <div className="font-mono text-sm text-gray-600 dark:text-gray-300 break-words whitespace-pre-wrap">
                    {loading ? (
                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 animate-pulse py-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Generating citation with AI...</span>
                        </div>
                    ) : error ? (
                        <span className="text-red-500 dark:text-red-400 font-medium">
                            {error}
                        </span>
                    ) : (
                        citationText
                    )}
                </div>
            </div>
        </div>
    );
};

export default CitationView;
