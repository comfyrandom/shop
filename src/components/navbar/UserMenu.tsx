import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import {getCurrentUser, getName, onAuthStateChange, signInWithEmail, signOut} from "../../services/auth.service.js";
import type {User} from "@supabase/supabase-js";

export const UserMenu = () => {
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLoading(true);
        getCurrentUser().then((user) => {
            setUser(user);

            if (user === null) {
                setLoading(false)
                return;
            }

            getName(user.id).then((name) => {
                setUsername(name);
                setLoading(false);
            })
        });

        const { data: { subscription } } = onAuthStateChange((user) => {
            setUser(user);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handleLogin = async (e: React.FormEvent)  => {
        e.preventDefault();
        setError('');
        const { error } = await signInWithEmail(email, password);
        if (error) {
            setError(error.message);
        } else {
            setShowDropdown(false);
            setEmail('');
            setPassword('');
        }
    };

    const handleLogout = async () => {
        await signOut();
        setUser(null);
        setShowDropdown(false);
    };

    if (loading) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
                aria-label="Меню пользователя"
                aria-expanded={showDropdown}
            >
                <FontAwesomeIcon
                    icon={faUserCircle}
                    className="text-xl text-blue-600"
                />
            </button>

            {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 z-10">
                    {user ? (
                        <div className="p-4 space-y-4">
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                    <FontAwesomeIcon
                                        icon={faUserCircle}
                                        className="text-purple-600"
                                    />
                                </div>
                                <div>
                                    <div className="font-medium text-blue-600 truncate">{username}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg flex items-center justify-center transition-colors duration-300"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                                Выйти
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} className="p-4 space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
                                    {error}
                                </div>
                            )}
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-2.5 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Пароль"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-2.5 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center transition-colors duration-300"
                            >
                                Войти
                            </button>
                            <div className="text-center pt-2">
                                <span className="text-xs text-gray-500">Нет аккаунта?</span>
                                <button
                                    type="button"
                                    className="text-xs text-blue-500 hover:text-blue-700 ml-1 font-medium"
                                    onClick={() => {
                                        alert('Функция регистрации будет реализована позже');
                                    }}
                                >
                                    Зарегистрироваться
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};