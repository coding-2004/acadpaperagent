import React from 'react';
import { Search, Brain, FileText, Library } from 'lucide-react';

const features = [
    {
        title: 'Smart Search',
        description: 'Search across multiple academic databases simultaneously with advanced filtering options.',
        icon: Search,
        color: 'blue'
    },
    {
        title: 'AI Summaries',
        description: 'Get instant, easy-to-understand summaries of complex research papers using state-of-the-art AI.',
        icon: Brain,
        color: 'purple'
    },
    {
        title: 'Citation Manager',
        description: 'Automatically generate citations in APA, MLA, Chicago, and many other formats in one click.',
        icon: FileText,
        color: 'indigo'
    },
    {
        title: 'Reading Lists',
        description: 'Organize your research with custom folders, tags, and personalized reading recommendations.',
        icon: Library,
        color: 'emerald'
    }
];

const Features = () => {
    return (
        <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900/50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Everything you need for your research
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Our agent combines powerful search capabilities with advanced AI to streamline your academic workflow.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <feature.icon className={`w-6 h-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
