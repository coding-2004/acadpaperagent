import React from 'react';
import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-1.5 bg-blue-600 rounded-lg">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">ScholarSync</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Empowering researchers with AI-driven discovery and organization tools.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-6">Product</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Features</a></li>
                            <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Integrations</a></li>
                            <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Pricing</a></li>
                            <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Changelog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-6">Resources</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Documentation</a></li>
                            <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Guides</a></li>
                            <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">API Reference</a></li>
                            <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Community</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-6">Company</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">About Us</a></li>
                            <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Blog</a></li>
                            <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Careers</a></li>
                            <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        © {new Date().getFullYear()} ScholarSync. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
