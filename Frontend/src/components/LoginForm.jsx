import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
        if (errors.firebase) {
            setErrors((prev) => ({ ...prev, firebase: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            console.log('User logged in successfully');
            navigate('/dashboard');
        } catch (error) {
            console.error('Firebase login error:', error);
            const newErrors = {};

            switch (error.code) {
                case 'auth/invalid-credential':
                    newErrors.firebase = 'Invalid email or password';
                    break;
                case 'auth/user-not-found':
                    newErrors.email = 'User not found';
                    break;
                case 'auth/wrong-password':
                    newErrors.password = 'Incorrect password';
                    break;
                case 'auth/too-many-requests':
                    newErrors.firebase = 'Too many failed attempts. Please try again later.';
                    break;
                default:
                    newErrors.firebase = 'An unexpected error occurred. Please try again.';
            }
            setErrors(newErrors);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-md transition-all">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-inter">Welcome Back</h2>
                <p className="text-gray-500 dark:text-gray-400">Log in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {errors.firebase && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm animate-in fade-in transition-all">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errors.firebase}</span>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-inter">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white`}
                        />
                    </div>
                    {errors.email && (
                        <div className="flex items-center gap-1 mt-2 text-red-500 text-xs font-medium animate-in slide-in-from-top-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.email}</span>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-inter">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border ${errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white`}
                        />
                    </div>
                    {errors.password && (
                        <div className="flex items-center gap-1 mt-2 text-red-500 text-xs font-medium animate-in slide-in-from-top-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.password}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end">
                    <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                        Forgot password?
                    </a>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        'Log In'
                    )}
                </button>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;

