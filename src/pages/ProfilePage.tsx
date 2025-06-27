import {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import type UserProfile from "../types/userProfile.ts";
import {getProfile} from "../services/users.service.ts";
import Header from "../components/profile-page/Header.tsx";
import Wearing from "../components/profile-page/Wearing.tsx";
import SectionCard from "../components/profile-page/SectionCard.tsx";
import Pinned from "../components/profile-page/Pinned.tsx";
import Owned from "../components/profile-page/Owned.tsx";
import Certificates from "../components/profile-page/Certificates.tsx";
import Testimonials from "../components/profile-page/Testimonials.tsx";
import {ErrorCard, LoadingCard, WarningCard} from "../components/common/StatusCards.tsx";

const ProfilePage = () => {

    const { userId } = useParams<{ userId: string }>();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setProfile(null);
        setLoading(true);
        setError(null);

        const fetchProduct = async () => {
            try {
                if (userId === undefined) {
                    setError("Не удалось загрузить данные о пользователе");
                    setLoading(false);
                    return;
                }

                const result = await getProfile(userId);

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

        fetchProduct();
    }, [userId]);

    if (loading) return <LoadingCard message="Загружаем профиль..." />;
    if (error) return <ErrorCard error={error} onRetry={() => window.location.reload()} />;
    if (!profile) return <WarningCard
        header="Не удалось загрузить профиль"
        description="Похоже, что-то пошло не так. Пожалуйста, попробуйте позже."
        onRetry={() => window.location.reload()}/>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <Header profile={profile}/>

            <div className="grid lg:grid-cols-3 gap-8 mb-8">

                <div className="lg:col-span-1 space-y-6">
                        <SectionCard>
                            <Certificates certificates={profile.certificates}/>
                        </SectionCard>
                </div>

                <div className="lg:col-span-2 space-y-8">

                    { profile.wearing_id && profile.wearing_id > 0 &&
                        <SectionCard>
                            <Wearing product={profile.wearing_item}/>
                        </SectionCard>
                    }
                    { profile.pinned_items && profile.pinned_items.length > 0 &&
                        <SectionCard>
                            <Pinned products={profile.pinned_items}/>
                        </SectionCard>
                    }
                    {profile.owned_items && profile.owned_items.length > 0 &&
                        <SectionCard>
                            <Owned products={profile.owned_items} />
                        </SectionCard>
                    }

                    <SectionCard>
                        <Testimonials userId={profile.id} reviews={profile.reviews ?? []} />
                    </SectionCard>
                </div>
            </div>
        </div>
    )
};

export default ProfilePage;