import React from 'react';
import { ArrowRight, Search, Sparkles } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8 animate-bounce-subtle">
                    <Sparkles className="w-4 h-4" />
                    <span>New: AI-Powered Paper Summarization</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
                    Find Academic Papers <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                        Faster than Ever
                    </span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                    Access millions of research papers, generate instant AI summaries, and manage your citations with our powerful, all-in-one research assistant.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="group relative bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                        Start Your Research
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button className="flex items-center gap-2 px-8 py-4 rounded-full text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Search className="w-5 h-5" />
                        Try Live Demo
                    </button>
                </div>

                {/* Dashboard Preview Placeholder */}
                <div className="mt-20 relative max-w-5xl mx-auto">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25"></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden aspect-[16/9] flex items-center justify-center">
                        <div className="text-center p-8">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Smart Search Interface</h3>
                            <p className="text-gray-500 dark:text-gray-400">Preview of the Academic Paper Finder Dashboard</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
