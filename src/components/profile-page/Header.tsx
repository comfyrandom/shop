import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarAlt,
    faEnvelope,
    faMapMarkerAlt,
    faStar,
    faUserSecret,
    faUserTag,
    faEdit
} from "@fortawesome/free-solid-svg-icons";
import {formatDuration } from "../../utils/dates.utils.ts";
import {SocialLinks} from "./SocialLinks.tsx";
import type {UserProfile} from "../../types/userProfile.ts";
import {useAuth} from "../../hooks/useAuth.ts";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    profile: UserProfile;
}

const Header: React.FC<HeaderProps> = ({ profile }) => {
    const {user, essentials} = useAuth();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        setUserId(user?.id ?? null);
    }, [user?.id]);

    const navigate = useNavigate();

    const timeMs = (new Date()).getTime() - new Date(profile.join_date).getTime();

    const totalRating = profile.reviews?.reduce((sum, review) => sum + (review.rating ?? 0), 0) ?? 0;
    const averageRating = (profile.reviews && profile.reviews.length > 0) ?
        totalRating / profile.reviews.length
        : 0;

    const picture = profile?.picture ? profile.picture :
        profile.wearing_item?.picture ? profile.wearing_item.picture : undefined;

    const isOwnProfile = userId === profile.id;

    const handleEditProfile = () => {
        navigate(`/editProfile/${essentials!.alias}`);
    };

    const handleSendMessage = () => {
        navigate(`/messages/${profile.alias}`);
    };

    return (
        <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-xl p-8 mb-8 shadow-lg">
            <div className="flex flex-col lg:flex-row items-start">
                <div className="w-48 h-48 bg-white rounded-full shadow-xl mb-6 lg:mb-0 lg:mr-8 flex items-center justify-center relative">
                    {picture ? (
                        <img
                            src={picture}
                            alt={`${profile.name}'s avatar`}
                            className="w-full h-full object-cover rounded-full"
                        />
                    ) : (
                        <FontAwesomeIcon icon={faUserSecret} className="text-7xl text-gray-400" />
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                        <div>
                            <div className="flex items-center">
                                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">
                                    {profile.name}
                                </h1>
                                {isOwnProfile && (
                                    <button
                                        onClick={handleEditProfile}
                                        className="ml-4 bg-white text-gray-600 hover:text-gray-900 font-medium py-1 px-3 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors flex items-center shadow-sm"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                        Редактировать
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center mt-2">
                                <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                                <span className="font-bold">{averageRating}</span>
                                <span className="text-gray-500 ml-1">({profile.reviews?.length ?? 0} отзывов)</span>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-4 lg:mt-0">
                            {!isOwnProfile && (
                                <>
                                    <button
                                        onClick={handleSendMessage}
                                        className="bg-white text-gray-800 font-medium py-2 px-4 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors flex items-center shadow-sm"
                                    >
                                        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                        Личное сообщение
                                    </button>
                                    <button className="hidden bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-full shadow-md transition-all transform hover:scale-105">
                                        Подписаться
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 text-lg">
                        <p className="text-gray-700 relative group">
                            {profile.about}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-6">
                        {profile.location && (
                            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500 mr-2" />
                                <span>{profile.location}</span>
                            </div>
                        )}
                        <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-2" />
                            <span>На сайте с {new Date(profile.join_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                            <FontAwesomeIcon icon={faUserTag} className="text-gray-500 mr-2" />
                            <span>Активен {formatDuration(timeMs)}</span>
                        </div>
                    </div>

                    <div className="flex-1 mt-4">
                        <SocialLinks socials={profile.socials} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;