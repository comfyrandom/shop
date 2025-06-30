import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope,
    faGlobe, faSave
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faDiscord, faTwitter, faDeviantart, faTelegram } from '@fortawesome/free-brands-svg-icons';
import SectionCard from "../components/product-editor/SectionCard.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../hooks/useAuth.ts";
import {getUserProfile} from "../services/users.service.ts";
import {ErrorCard, LoadingCard, WarningCard} from "../components/common/StatusCards.tsx";
import {toast, type ToastOptions} from "react-toastify";
import type {UserProfile} from "../types/userProfile.ts";
import {updateProfile} from "../services/profile.service.ts";

const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true
};

const EditProfilePage: React.FC = () => {
    const { alias } = useParams<{ alias: string }>();
    const navigate = useNavigate();
    const { user, initialized } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev!, [name]: value }));
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev!,
            socials: {
                ...prev!.socials,
                [name]: value
            }
        }));
    };

    const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cleanedValue = e.target.value
            .toLowerCase()
            .replace(/[^a-z.]/g, '');

        const syntheticEvent = {
            ...e,
            target: {
                ...e.target,
                name: e.target.name,
                value: cleanedValue
            }
        };

        handleChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (profile) {
            const result = await updateProfile(profile);

            if (!result.error) {
                toast.success("Профиль сохранен", toastOptions);
                navigate(`/user/${profile.alias}`);
                window.location.reload();
            } else {
                toast.error("Не удалось сохранить профиль", toastOptions);
            }
        }
    };

    useEffect(() => {
        setProfile(null);
        setLoading(true);
        setError(null);

        const fetchData = async () => {
            try {

                if (alias === undefined) {
                    setError("Не удалось загрузить данные о пользователе");
                    setLoading(false);
                    return;
                }

                const result = await getUserProfile(alias);

                if (result === undefined) {
                    setError("Не удалось загрузить данные о пользователе");
                    setLoading(false);
                    return;
                }

                setProfile(result);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Не удалось загрузить данные о пользователе");
                setLoading(false);
            }
        };

        fetchData();
    }, [alias]);

    if (!initialized || loading)
        return <LoadingCard message="Загружаем профиль..." />;

    if (error) return <ErrorCard error={error} onRetry={() => window.location.reload()} />;

    if (!profile) return <WarningCard
        header="Не удалось загрузить профиль"
        description="Похоже, что-то пошло не так. Пожалуйста, попробуйте позже."
        onRetry={() => window.location.reload()}/>;

    if (user?.id !== profile.id) {
        return <WarningCard
            header="Невозможно отредактировать чужой профиль"
            description="Похоже, что-то пошло не так. Пожалуйста, попробуйте позже."
            onRetry={() => window.location.reload()}/>;
    }

    return (
        <>
            <form id='profile-form' onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
                <SectionCard title={"Основные данные"} description={""}>
                <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Полное имя</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={profile.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Алиас</label>
                            <input
                                type="text"
                                required
                                name="alias"
                                value={profile.alias}
                                onChange={handleAliasChange}
                                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                            <p className="mt-1 text-xs text-gray-500">Только латинские буквы в нижнем регистре и точка</p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка на аватар</label>
                            <input
                                type="text"
                                name="picture"
                                value={profile.picture || ''}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Местоположение</label>
                            <input
                                type="text"
                                name="location"
                                value={profile.location || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">О себе</label>
                            <textarea
                                name="about"
                                required
                                value={profile.about}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>
                </div>

                </SectionCard>
                <SectionCard title={"Социальные сети"} description={''}>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={profile.socials.email ?? ''}
                                onChange={handleSocialChange}
                                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <FontAwesomeIcon icon={faGithub} className="mr-2" />
                                GitHub
                            </label>
                            <input
                                type="text"
                                name="github"
                                value={profile.socials.github ?? ''}
                                onChange={handleSocialChange}
                                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <FontAwesomeIcon icon={faDiscord} className="mr-2" />
                                Discord
                            </label>
                            <input
                                type="text"
                                name="discord"
                                value={profile.socials.discord ?? ''}
                                onChange={handleSocialChange}
                                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <FontAwesomeIcon icon={faTwitter ?? ''} className="mr-2" />
                                Twitter
                            </label>
                            <input
                                type="text"
                                name="twitter"
                                value={profile.socials.twitter ?? ''}
                                onChange={handleSocialChange}
                                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                                Веб-сайт
                            </label>
                            <input
                                type="url"
                                name="website"
                                value={profile.socials.website ?? ''}
                                onChange={handleSocialChange}
                                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <FontAwesomeIcon icon={faTelegram} className="mr-2" />
                                Telegram
                            </label>
                            <input
                                type="text"
                                name="telegram"
                                value={profile.socials.telegram ?? ''}
                                onChange={handleSocialChange}
                                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <FontAwesomeIcon icon={faDeviantart} className="mr-2" />
                                DeviantArt
                            </label>
                            <input
                                type="text"
                                name="deviantart"
                                value={profile.socials.deviantart ?? ''}
                                onChange={handleSocialChange}
                                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>
                </SectionCard>
            </form>
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 shadow-md">
                <div className="max-w-5xl mx-auto flex justify-end">
                    <button
                        type="submit"
                        form="profile-form"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                        Сохранить изменения
                    </button>
                </div>
            </div>
        </>
    );
};

export default EditProfilePage;