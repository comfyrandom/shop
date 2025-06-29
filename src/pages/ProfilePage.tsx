import {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import type UserProfile from "../types/userProfile.ts";
import {updateWearing, updatePinned } from "../services/profile.service.ts";
import Header from "../components/profile-page/Header.tsx";
import Wearing from "../components/profile-page/Wearing.tsx";
import SectionCard from "../components/profile-page/SectionCard.tsx";
import Pinned from "../components/profile-page/Pinned.tsx";
import Owned from "../components/profile-page/Owned.tsx";
import Certificates from "../components/profile-page/Certificates.tsx";
import Testimonials from "../components/profile-page/Testimonials.tsx";
import {ErrorCard, LoadingCard, WarningCard} from "../components/common/StatusCards.tsx";
import {toast, type ToastOptions} from 'react-toastify';
import type {Product} from "../types/product.ts";
import {getUserProfile} from "../services/users.service.ts";
import {updateSaleStatus} from "../services/products.service.ts";
import {useAuth} from "../hooks/useAuth.ts";
import Blogs from "../components/profile-page/Blogs.tsx";

const ProfilePage = () => {
    const { alias } = useParams<{ alias: string }>();
    const { user, initialized } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const toastOptions: ToastOptions = {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true
    };

    const handlePinChange = async (productId: number, isPinned: boolean) => {
        try {
            const result = await updatePinned(alias!, productId, isPinned);

            if (result === true) {
                setProfile(prev => {
                    if (!prev) return prev;

                    const product = prev.owned_items?.find(p => p.id === productId);
                    if (!product) return prev;

                    let updatedPinnedItems: Product[] = [...(prev.pinned_items || [])];

                    if (isPinned) {
                        if (!updatedPinnedItems.some(p => p.id === productId)) {
                            updatedPinnedItems.push(product);
                        }
                    } else {
                        updatedPinnedItems = updatedPinnedItems.filter(p => p.id !== productId);
                    }

                    console.log(updatedPinnedItems);
                    return {
                        ...prev,
                        pinned_items: updatedPinnedItems
                    };
                });
                toast.success(isPinned ? "Шкура добавлена в избранное" : "Шкура удалена из избранного", toastOptions);
            } else {
                toast.error("Не удалось обновить избранное", toastOptions);
            }
        } catch (err) {
            toast.error("Ошибка при обновлении избранного", toastOptions);
            console.error(err);
        }
    };

    const handleSaleStatusChange = async (productId: number, isOnSale: boolean, price?: number) => {
        try {
            const result = await updateSaleStatus(productId, isOnSale, price);

            if (result) {
                setProfile(prev => {
                    if (!prev) return prev;

                    const updatedStatus = isOnSale ? "FOR_SALE" : "NOT_FOR_SALE";

                    const updatedOwnedItems = prev.owned_items?.map(item =>
                        item.id === productId ? { ...item, status: updatedStatus } : item
                    ) as Product[] | undefined;

                    const updatedPinnedItems = prev.pinned_items?.map(item =>
                        item.id === productId ? { ...item, status: updatedStatus } : item
                    ) as Product[] | undefined;

                    return {
                        ...prev,
                        owned_items: updatedOwnedItems,
                        pinned_items: updatedPinnedItems
                    };
                });
                toast.success(isOnSale ? "Шкура выставлена на продажу" : "Шкура снята с продажи", toastOptions);
            } else {
                toast.error("Не удалось изменить статус продажи", toastOptions);
            }
        } catch (err) {
            toast.error("Ошибка при изменении статуса продажи", toastOptions);
            console.error(err);
        }
    };

    const handleWearStatusChange = async (productId: number, isWearing: boolean) => {
        try {
            const result = await updateWearing(alias!, isWearing ? productId : undefined);

            if (result) {
                setProfile(prev => {
                    if (!prev) return prev;
                    const product = prev.owned_items?.find(p => p.id === productId);

                    // If wearing, clear any previously worn item first
                    if (isWearing) {
                        return {
                            ...prev,
                            wearing_id: productId,
                            wearing_item: product
                        };
                    } else {
                        // Only remove if this was the currently worn item
                        if (prev.wearing_id === productId) {
                            return {
                                ...prev,
                                wearing_id: undefined,
                                wearing_item: undefined
                            };
                        }
                        return prev;
                    }
                });

                toast.success(isWearing ? "Шкура теперь на вас" : "Шкура снята", toastOptions);
            } else {
                toast.error("Не удалось изменить статус ношения", toastOptions);
            }
        } catch (err) {
            toast.error("Ошибка при изменении статуса ношения", toastOptions);
            console.error(err);
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
                    { profile.blog_posts && profile.blog_posts.length > 0 &&
                        <SectionCard>
                            <Blogs author={profile} blogs={profile.blog_posts} />
                        </SectionCard>
                    }

                    {profile.owned_items && profile.owned_items.length > 0 &&
                        <SectionCard>
                            <Owned
                                isOwner={profile.id === user?.id}
                                products={profile.owned_items}
                                pinnedItems={profile.pinned_items}
                                wearingId={profile.wearing_item?.id}
                                onPinChange={handlePinChange}
                                onSaleStatusChange={handleSaleStatusChange}
                                onWearStatusChange={handleWearStatusChange}
                            />
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