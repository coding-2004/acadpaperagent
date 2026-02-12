import React from 'react';
import Navbar from '../components/Navbar';
import SignupForm from '../components/SignupForm';
import Footer from '../components/Footer';

const Signup = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 flex items-center justify-center px-4 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 blur-3xl rounded-full -z-10"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400/10 blur-3xl rounded-full -z-10"></div>

                <SignupForm />
            </main>

            <Footer />
        </div>
    );
};

export default Signup;
