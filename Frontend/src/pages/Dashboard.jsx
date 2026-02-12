import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import PaperList from '../components/PaperList';

const Dashboard = () => {
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (query) => {
        setIsSearching(true);
        console.log('Searching for:', query);
        // Simulate API call delay
        setTimeout(() => {
            setIsSearching(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 flex flex-col font-inter">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4 max-w-7xl mx-auto w-full relative">
                {/* Decorative background elements */}
                <div className="absolute top-20 right-0 w-96 h-96 bg-blue-400/5 blur-3xl rounded-full -z-10 animate-pulse"></div>
                <div className="absolute bottom-40 left-0 w-72 h-72 bg-indigo-400/5 blur-3xl rounded-full -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

                <section className="mb-16">
                    <div className="text-center mb-10 max-w-2xl mx-auto">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                            Literature <span className="text-blue-600">Discovery</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            Search millions of academic papers across multiple databases using AI-powered insights.
                        </p>
                    </div>

                    <SearchBar onSearch={handleSearch} isLoading={isSearching} />
                </section>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent mb-16"></div>

                <section>
                    <PaperList />
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
