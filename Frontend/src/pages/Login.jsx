import React from 'react';
import Navbar from '../components/Navbar';
import LoginForm from '../components/LoginForm';
import Footer from '../components/Footer';

const Login = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 flex flex-col font-inter">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 flex items-center justify-center px-4 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-blue-400/10 blur-3xl rounded-full -z-10 animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-indigo-400/10 blur-3xl rounded-full -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

                <LoginForm />
            </main>

            <Footer />
        </div>
    );
};

export default Login;
