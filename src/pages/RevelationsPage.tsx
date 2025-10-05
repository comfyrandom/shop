import { RevelationsPost } from "../components/revelations/RevelationsPost.tsx";
import { useEffect, useState } from "react";
import {
    deleteRevelationPosts,
    getRevelationPosts,
    type RevelationPost,
    toggleRevelationLike,
    createRevelationPost
} from "../services/revelations.service.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { ErrorCard, LoadingCard, WarningCard } from "../components/common/StatusCards.tsx";
import { getProductEssentialsByOwnerId } from "../services/products.service.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import AccountPickerPopup from "../components/revelations/AccountPickerPopup.tsx";

export interface AccountForComment {
    id: number;
    name: string;
    alias: string;
    picture: string;
}

const RevelationsPage = () => {
    const { user, initialized } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [accounts, setAccounts] = useState<AccountForComment[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [posts, setPosts] = useState<RevelationPost[]>([]);
    const [formData, setFormData] = useState({
        content: "",
        location: "",
        media: "",
        selectedAccount: ""
    });
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [showAccountPicker, setShowAccountPicker] = useState<boolean>(false);
    const [selectedAccount, setSelectedAccount] = useState<AccountForComment | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await getRevelationPosts(user?.id);
                setPosts(result);

                if (!user?.id){
                    throw new Error("Не удалось получить ваши аккаунты");
                }

                const ownedProducts = await getProductEssentialsByOwnerId(user?.id);
                setAccounts(ownedProducts);

                // Set first account as default if available
                if (ownedProducts.length > 0) {
                    setSelectedAccount(ownedProducts[0]);
                    setFormData(prev => ({ ...prev, selectedAccount: ownedProducts[0].id.toString() }));
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching revelations:', err);
                setError('Не удалось загрузить откровения');
            } finally {
                setLoading(false);
            }
        };

        if (initialized) {
            fetchData();
        }
    }, [user?.id, initialized]);

    const handleAccountSelect = (account: AccountForComment) => {
        setSelectedAccount(account);
        setFormData(prev => ({ ...prev, selectedAccount: account.id.toString() }));
        setShowAccountPicker(false);
    };

    const handleLike = async (postId: number) => {
        if (!user?.id) {
            console.log('User must be logged in to like posts');
            return;
        }

        const post = posts.find(p => p.id === postId);
        if (!post) return;

        const updatedPosts = posts.map(p => {
            if (p.id === postId) {
                return {
                    ...p,
                    isLiked: !p.isLiked,
                    likes: p.isLiked ? p.likes - 1 : p.likes + 1
                };
            }
            return p;
        });
        setPosts(updatedPosts);

        try {
            const result = await toggleRevelationLike(postId, user.id, post.isLiked);

            if (!result.success) {
                setPosts(posts);
                console.error('Failed to toggle like:', result.error);
            }
        } catch (err) {
            setPosts(posts);
            console.error('Error toggling like:', err);
        }
    };

    const handleDeletePost = async (postId: number) => {
        const originalPosts = [...posts];
        setPosts(posts.filter(post => post.id !== postId));

        try {
            const result = await deleteRevelationPosts(postId);

            if (!result) {
                setPosts(originalPosts);
                alert('Не удалось удалить пост. Пожалуйста, попробуйте снова.');
            }
        } catch (err) {
            setPosts(originalPosts);
            console.error('Error deleting post:', err);
            alert('Не удалось удалить пост. Пожалуйста, попробуйте снова.');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.content.trim()) {
            alert('Пожалуйста, напишите откровение');
            return;
        }

        if (!formData.selectedAccount) {
            alert('Пожалуйста, выберите аккаунт');
            return;
        }

        setSubmitting(true);

        try {
            const newPost = await createRevelationPost(
                parseInt(formData.selectedAccount),
                formData.content,
                formData.location,
                formData.media
            );

            if (!newPost)
            {
                setError('Не удалось создать новый пост');
                return;
            }

            setPosts(prev => [newPost, ...prev]);
            setFormData({
                content: "",
                location: "",
                media: "",
                selectedAccount: selectedAccount?.id.toString() || ""
            });
            setError(null);
        } catch (err) {
            console.error('Error creating post:', err);
            alert('Не удалось опубликовать откровение. Пожалуйста, попробуйте снова.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!initialized || loading) return <LoadingCard message="Загружаем откровения..." />;
    if (error) return <ErrorCard error={error} onRetry={() => window.location.reload()} />;

    return (
        <div className="max-w-2xl mx-auto space-y-6 py-4">
            {(showAccountPicker && <AccountPickerPopup accounts={accounts} selectedAccount={selectedAccount}
                                                      onAccountSelect={handleAccountSelect}
                                                      onCancel={() => setShowAccountPicker(false)}
                                                      header={"Выберите аккаунт, с которого хотите поделиться откровением"}/>)}

            {(accounts.length > 0 && <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">

                            <button
                                type="button"
                                onClick={() => setShowAccountPicker(true)}
                                className="flex items-center space-x-2 px-3 py-2 rounded-full border border-purple-200 hover:border-purple-300 bg-white transition-colors group"
                            >
                                <img
                                    src={selectedAccount?.picture}
                                    alt={selectedAccount?.name}
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-gray-800">
                                    @{selectedAccount?.alias}
                                </span>
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="text-xs text-gray-400 group-hover:text-gray-600"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        placeholder="Поделитесь своим откровением..."
                        className="w-full px-0 py-2 border-0 focus:outline-none focus:ring-0 resize-none text-gray-900 placeholder-gray-500 text-lg"
                    />

                    <div className="space-y-3">
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="📍 Добавьте местоположение"
                            className="w-full px-0 py-1 border-0 focus:outline-none focus:ring-0 text-gray-600 placeholder-gray-400 text-sm"
                        />

                        <input
                            type="url"
                            name="media"
                            value={formData.media}
                            onChange={handleInputChange}
                            placeholder="🔗 Добавьте ссылку на изображение или видео"
                            className="w-full px-0 py-1 border-0 focus:outline-none focus:ring-0 text-gray-600 placeholder-gray-400 text-sm"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                            {formData.content.length}/2200
                        </div>

                        <button
                            type="submit"
                            disabled={!formData.content.trim() || !selectedAccount || submitting}
                            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm shadow-sm"
                        >
                            {submitting ? 'Публикуем...' : 'Опубликовать'}
                        </button>
                    </div>
                </form>
            </div>)}

            {posts.length === 0 ? (
                <WarningCard
                    header="Нет откровений"
                    description="Пока никто не поделился откровениями. Будьте первым!"
                    onRetry={() => window.location.reload()}
                />
            ) : (
                posts.map((post) => (
                    <RevelationsPost
                        key={post.id}
                        canComment={accounts.length > 0}
                        post={post}
                        onLike={handleLike}
                        onDeletePost={handleDeletePost}
                        accounts={accounts}
                    />
                ))
            )}
        </div>
    );
};

export default RevelationsPage;