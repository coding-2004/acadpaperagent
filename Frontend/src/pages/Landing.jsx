import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

const Landing = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
            <Navbar />
            <main>
                <Hero />
                <Features />
                {/* Additional sections like Testimonials or Pricing could go here */}
            </main>
            <Footer />
        </div>
    );
};

export default Landing;
