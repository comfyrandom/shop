import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRight, faEdit,
    faUserCircle, faTrash, faPlus
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import {useEffect, useState} from "react";
import {type BlogPreviewRecord, deleteBlogPost, getBlogsPreview} from "../services/blog.service.ts";
import {ErrorCard, LoadingCard, WarningCard} from "../components/common/StatusCards.tsx";
import {EmptyStateCard} from "../components/common/EmptyState.tsx";
import {useAuth} from "../hooks/useAuth.ts";
import {toast, type ToastOptions} from "react-toastify";

const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true
};

const BlogPage = () => {
    const { user, initialized } = useAuth();
    const [posts, setPosts] = useState<BlogPreviewRecord[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [postToDelete, setPostToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const result = await getBlogsPreview();

                if (result === undefined) {
                    setError("Не удалось загрузить данные о продукте");
                    setLoading(false);
                    return;
                }

                console.log(result);
                setPosts(result);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Не удалось загрузить данные о продукте");
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleDeleteClick = (postId: number) => {
        setPostToDelete(postId);
    };

    const handleCancelDelete = () => {
        setPostToDelete(null);
        setDeleteError(null);
    };

    const handleConfirmDelete = async () => {
        if (!postToDelete) return;

        setIsDeleting(true);
        setDeleteError(null);

        try {
            const result = await deleteBlogPost(postToDelete);

            if (result) {
                setPosts(posts?.filter(post => post.id !== postToDelete) || null);
                setPostToDelete(null);
            } else {
                toast.error("Не удалось удалить пост", toastOptions);
            }
        } catch (err) {
            console.error(err);
            setDeleteError("Не удалось удалить пост. Пожалуйста, попробуйте снова.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (!initialized || loading) return <LoadingCard message="Загружаем посты..." />;
    if (error) return <ErrorCard error={error} onRetry={() => window.location.reload()} />;
    if (!posts) return <WarningCard
        header="Не удалось загрузить посты"
        description="Список постов временно недоступен. Пожалуйста, попробуйте позже."
        onRetry={() => window.location.reload()}
    />;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {postToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Подтверждение удаления</h3>
                        <p className="text-gray-600 mb-6">Вы уверены, что хотите удалить этот пост? Это действие нельзя отменить.</p>

                        {deleteError && (
                            <div className="mb-4 text-red-500 text-sm">{deleteError}</div>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleCancelDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? 'Удаление...' : 'Удалить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Блог сообщества</h1>
                <div className="flex space-x-2">
                    { user &&
                        <Link to="/blog/create"
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                            <FontAwesomeIcon icon={faPlus}/>
                            Создать пост
                        </Link>
                    }
                    <div className="hidden flex space-x-2">
                        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                            Популярные
                        </button>
                        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                            Новые
                        </button>
                        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
                            Все темы
                        </button>
                    </div>
                </div>
            </div>

            {posts.length === 0 ? (
                <EmptyStateCard
                    title="Ой, кажется, мы не смогли найти никаких постов..."
                    description="Попробуйте зайти позже или проверьте другие разделы"
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map(post => (
                            <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow flex flex-col h-full">
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center justify-between mb-4">
                                        <Link to={`/user/${post.author_id}`}>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
                                                    {post.author_details.picture ? (
                                                        <img
                                                            className="w-full h-full object-cover"
                                                            src={post.author_details.picture}
                                                            alt={post.author_details.name}
                                                        />
                                                    ) : (
                                                        <FontAwesomeIcon
                                                            icon={faUserCircle}
                                                            className="text-gray-600 text-2xl"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{post.author_details.name}</h3>
                                                </div>
                                            </div>
                                        </Link>

                                        {user && user.id === post.author_id && (
                                            <div className="flex space-x-3">
                                                <Link
                                                    to={`/blog/edit/${post.id}`}
                                                    className="text-gray-500 hover:text-blue-600 transition-colors"
                                                    title="Редактировать пост"
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(post.id)}
                                                    className="text-gray-500 hover:text-red-600 transition-colors"
                                                    title="Удалить пост"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <Link to={`/blog/${post.id}`} className="block mb-3">
                                        <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>
                                    </Link>

                                    <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>

                                    <div className="mt-auto">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.map(tag => (
                                                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                    #{tag}
                                </span>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>
                                                <Link
                                                    to={`/blog/${post.id}`}
                                                    className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center"
                                                >
                                                    Читать <FontAwesomeIcon icon={faArrowRight} className="ml-1 text-xs" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden mt-8 flex justify-center">
                        <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                            Показать еще
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default BlogPage;