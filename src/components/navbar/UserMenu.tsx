import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUserCircle, faSignOutAlt, faWallet, faPlus, faCoins} from '@fortawesome/free-solid-svg-icons';
import {getCurrentUser, onAuthStateChange, signInWithEmail, signOut} from "../../services/auth.service.js";
import type {User} from "@supabase/supabase-js";
import {Link} from "react-router-dom";
import {getUserBalance, getUserEssentials} from "../../services/users.service.ts";
import type {UserEssentials} from "../../types/userProfile.ts";

export const UserMenu = () => {
    const [user, setUser] = useState<User | null>(null);
    const [essentials, setEssentials] = useState<UserEssentials | null>(null);
    const [balance, setBalance] = useState(0); // Добавлено состояние для баланса
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLoading(true);
        getCurrentUser().then(async (user) => {
            setUser(user);

            if (user === null) {
                setLoading(false)
                return;
            }

            const details = await getUserEssentials(user.id);

            if (details === null) {
                setLoading(false)
                return;
            }

            setEssentials(details);

            const userBalance = await getUserBalance(user.id);

            setBalance(userBalance ?? 0);
            setLoading(false);
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
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors overflow-hidden"
                aria-label="Меню пользователя"
            >
                {essentials?.picture ? (
                    <img
                        src={essentials?.picture}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <FontAwesomeIcon
                        icon={faUserCircle}
                        className="text-xl text-gray-600"
                    />
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-10 overflow-hidden">
                    {user ? (
                        <>
                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                        {essentials?.picture ? (
                                            <img
                                                src={essentials?.picture}
                                                alt="User avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faUserCircle}
                                                className="text-gray-500 text-2xl"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/user/${user.id}`}>
                                            <p className="text-sm font-medium text-gray-900 truncate">{essentials?.name}</p>
                                        </Link>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-500 flex items-center">
                                        <FontAwesomeIcon icon={faWallet} className="mr-2 text-gray-400" />
                                        Баланс
                                    </span>
                                    <span className="text-base font-semibold text-gray-900">{balance.toLocaleString()} <FontAwesomeIcon icon={faCoins} /></span>
                                </div>
                                <Link to={'blog/1'}>
                                    <button
                                        className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 text-sm font-medium rounded-md text-gray-700 flex items-center justify-center space-x-1 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                                        <span>Пополнить баланс</span>
                                    </button>
                                </Link>
                            </div>

                            <div className="p-2">
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-2 px-3 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-colors"
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-gray-500" />
                                    Выйти из аккаунта
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="p-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Вход в аккаунт</h3>
                            <form onSubmit={handleLogin} className="space-y-3">
                                {error && (
                                    <div className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded">
                                        {error}
                                    </div>
                                )}
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full text-sm px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Пароль"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full text-sm px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                                >
                                    Войти
                                </button>
                            </form>
                            <div className="mt-3 text-center">
                                <button
                                    type="button"
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    onClick={() => alert('Форма регистрации')}
                                >
                                    Создать новый аккаунт
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserMenu;