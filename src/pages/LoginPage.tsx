import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import {signInWithEmail} from "../services/auth.service.ts";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const { error } = await signInWithEmail(email, password);
        if (error) {
            setError(error.message);
        }

        setIsLoading(false);
    };

    return (
        <div className="max-w-md mx-auto px-4 py-20 min-h-screen flex flex-col justify-center">
            <div className="text-center mb-8">
                <div className="mb-4 text-6xl text-gray-200">
                    <FontAwesomeIcon icon={faUserCircle} />
                </div>
                <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">
                    Вход в систему
                </h1>
                <p className="text-gray-600">Используйте свои учетные данные</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                    <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Пароль</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                        </div>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all ${isLoading ? 'opacity-70' : ''}`}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </div>

                <div className="text-center text-sm text-gray-500 pt-4">
                    <p>Ещё нет аккаунта?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                            Зарегистрироваться
                        </Link>
                    </p>
                    <p className="mt-2">
                        <Link to="/forgot-password" className="text-gray-600 hover:text-gray-800">
                            Забыли пароль?
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;