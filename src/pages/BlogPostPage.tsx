import ReactMarkdown from 'react-markdown';
import {Link, useParams, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {type BlogContent, type BlogPreviewRecord, getBlogRecord, deleteBlogPost} from "../services/blog.service.ts";
import {ErrorCard, LoadingCard, WarningCard} from "../components/common/StatusCards.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserCircle, faEdit, faTrash, faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {useAuth} from "../hooks/useAuth.ts";
import {toast, type ToastOptions} from "react-toastify";

const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true
};

const BlogPostPage = () => {
    const { user, initialized } = useAuth();
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();

    const [post, setPost] = useState<BlogPreviewRecord & BlogContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await getBlogRecord(Number(postId));

                if (result === undefined) {
                    setError("Не удалось загрузить пост");
                    setLoading(false);
                    return;
                }

                setPost(result);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Не удалось загрузить пост");
                setLoading(false);
            }
        };

        fetchProduct();
    }, [postId]);

    const handleDelete = async () => {
        if (!postId || !post) return;

        if (window.confirm('Вы уверены, что хотите удалить этот пост? Это действие нельзя отменить.')) {
            try {
                const success = await deleteBlogPost(Number(postId));
                if (success) {
                    toast.success("Пост успешно удален", toastOptions);
                    navigate('/blog');
                } else {
                    toast.error("Не удалось удалить пост", toastOptions);
                }
            } catch (err) {
                console.error(err);
                toast.error("Ошибка при удалении поста", toastOptions);
            }
        }
    };

    if (!initialized || loading) return <LoadingCard message="Загружаем пост..." />;
    if (error) return <ErrorCard error={error} onRetry={() => window.location.reload()} />;
    if (!post) return <WarningCard
        header="Не удалось загрузить пост"
        description="Похоже, что-то пошло не так. Пожалуйста, попробуйте позже."
        onRetry={() => window.location.reload()}/>;

    const isAuthor = user && post.author_id === user.id;

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden my-8 border border-gray-100">
            {/* Хедер с навигацией и действиями */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Назад
                </button>

                {isAuthor && (
                    <div className="flex space-x-3">
                        <button
                            onClick={() => navigate(`/blog/edit/${post.id}`)}
                            className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <FontAwesomeIcon icon={faEdit} className="mr-2" />
                            Редактировать
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                            Удалить
                        </button>
                    </div>
                )}
            </div>

            {/* Информация об авторе */}
            <div className="p-6 border-b border-gray-100">
                <Link to={`/user/${post.author_details.alias}`}>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            {post.author_details?.picture ? (
                                <img
                                    src={post.author_details.picture}
                                    alt="User avatar"
                                    className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                            ) : (
                                <FontAwesomeIcon
                                    icon={faUserCircle}
                                    className="text-4xl text-gray-400"
                                />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h2 className="text-lg font-semibold text-gray-900">{post.author_details?.name || 'Неизвестный автор'}</h2>
                            </div>
                            <p className="text-sm text-gray-500">
                                Опубликовано {new Date(post.created_at).toLocaleDateString('ru-RU', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                            </p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Контент поста */}
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

                {post.excerpt && (
                    <p className="text-gray-600 mb-6 italic">{post.excerpt}</p>
                )}

                {/* Отображение тегов */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="prose max-w-none">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default BlogPostPage;