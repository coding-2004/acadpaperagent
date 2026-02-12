import React from 'react';
import { BookOpen, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="fixed w-full z-50 top-0 left-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            ScholarSync
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Features</a>
                        <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">About</a>
                        <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Search</a>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95">
                            Get Started
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-in slide-in-from-top duration-300">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a href="#features" className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md">Features</a>
                        <a href="#" className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md">About</a>
                        <a href="#" className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md">Search</a>
                        <button className="w-full mt-2 bg-blue-600 text-white px-3 py-3 rounded-md text-base font-semibold">
                            Get Started
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
