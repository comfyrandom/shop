import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRight,
    faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import {useEffect, useState} from "react";
import {type BlogPreviewRecord, getBlogsPreview} from "../services/blog.service.ts";
import {ErrorCard, LoadingCard, WarningCard} from "../components/common/StatusCards.tsx";
import {EmptyStateCard} from "../components/common/EmptyState.tsx";

const BlogPage = () => {
    const [posts, setPosts] = useState<BlogPreviewRecord[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) return <LoadingCard message="Загружаем посты..." />;
    if (error) return <ErrorCard error={error} onRetry={() => window.location.reload()} />;
    if (!posts) return <WarningCard
        header="Не удалось загрузить посты"
        description="Список постов временно недоступен. Пожалуйста, попробуйте позже."
        onRetry={() => window.location.reload()}
    />;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Блог сообщества</h1>
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

            {posts.length === 0 ? (
                <EmptyStateCard
                    title="Ой, кажется, мы не смогли найти никаких постов..."
                    description="Попробуйте зайти позже или проверьте другие разделы"
                />
                ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map(post => (
                            <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
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
                                    </div>

                                    <Link to={`/blog/${post.id}`} className="block mb-3">
                                        <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>
                                    </Link>

                                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

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