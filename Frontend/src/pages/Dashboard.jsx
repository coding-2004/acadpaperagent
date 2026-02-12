import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 flex flex-col font-inter">
            <Navbar />
            <main className="flex-grow pt-32 pb-20 px-4 max-w-7xl mx-auto w-full">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">User Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Welcome to your ScholarSync dashboard! You have successfully logged in.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                            <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Saved Papers</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Your collection of bookmarked research papers.</p>
                        </div>
                        <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                            <h3 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Search History</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Recent searches you've performed.</p>
                        </div>
                        <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                            <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-2">AI Insights</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Automated summaries of your paper collections.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;
