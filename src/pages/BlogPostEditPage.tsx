import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faPencil, faTrashAlt, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import {
    type BlogContent,
    type BlogPreviewRecord,
    deleteBlogPost,
    getBlogRecord,
    updateBlogPost
} from "../services/blog.service.ts";
import {useAuth} from "../hooks/useAuth.ts";
import {ErrorCard, LoadingCard, WarningCard} from "../components/common/StatusCards.tsx";
import {toast, type ToastOptions} from "react-toastify";

const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true
};

const BlogPostEditPage = () => {
    const { user, initialized } = useAuth();
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPreviewRecord & BlogContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPreview, setIsPreview] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                if (!postId) {
                    throw new Error('ID записи не указан');
                }
                const numberId = parseInt(postId);
                if (isNaN(numberId)) {
                    throw new Error('Неверный ID записи');
                }

                const fetchedPost = await getBlogRecord(numberId);
                setPost(fetchedPost);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (post) {
            setPost({ ...post, title: e.target.value });
        }
    };

    const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (post) {
            setPost({ ...post, excerpt: e.target.value });
        }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (post) {
            setPost({ ...post, content: e.target.value });
        }
    };

    const handleAddTag = (newTag: string) => {
        if (post && newTag.trim() && !post.tags.includes(newTag.trim())) {
            setPost({ ...post, tags: [...post.tags, newTag.trim()] });
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        if (post) {
            setPost({ ...post, tags: post.tags.filter(tag => tag !== tagToRemove) });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!post)
            return;

        const result = await updateBlogPost(post.id, post.title, post.content, post.excerpt, post.tags);

        if (result) {
            navigate(`/blog/${post.id}`);
        } else {
            toast.error("Не удалось применить изменения", toastOptions);
        }
    };

    const handleDelete = async () => {
        if (!post) return;

        if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
            try {
                await deleteBlogPost(post.id)
                navigate('/blog');
            } catch (err) {
                console.error(err);
                setError('Ошибка при удалении записи');
            }
        }
    };

    if (!initialized || loading) {
        return <LoadingCard message={"Загрузка записи"}></LoadingCard>;
    }

    if (error || !post) {
        return <ErrorCard error={"Не удалось загрузить запись"} />
    }

    if (!user){
        return <WarningCard header={"Ошибка"} description={"Редактирование недоступно неавторизованным пользователям"} />
    }

    if (post.author_id !== user.id) {
        return <WarningCard header={"Ошибка"} description={"Редактирование чужих постов недоступно"} />
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Редактирование записи</h1>
                <p className="text-gray-600">Внесите изменения в свою запись и сохраните их</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="mb-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Заголовок
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={post.title}
                        onChange={handleTitleChange}
                        className="w-full px-4 py-3 text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                        placeholder="Введите заголовок записи"
                        required
                    />
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                            Краткое описание
                        </label>
                        <span className="text-xs text-gray-500">Макс. 200 символов</span>
                    </div>

                    <textarea
                        id="excerpt"
                        value={post.excerpt}
                        onChange={handleExcerptChange}
                        maxLength={200}
                        className="w-full h-32 px-4 py-3 text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                        placeholder="Краткое описание поста для превью..."
                        required
                    />
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Содержание
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsPreview(!isPreview)}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <FontAwesomeIcon icon={faPencil} className="mr-2" />
                            {isPreview ? 'Редактировать' : 'Предпросмотр'}
                        </button>
                    </div>

                    {isPreview ? (
                        <div className="prose max-w-none p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <ReactMarkdown>{post.content}</ReactMarkdown>
                        </div>
                    ) : (
                        <textarea
                            id="content"
                            value={post.content}
                            onChange={handleContentChange}
                            className="w-full h-96 px-4 py-3 text-gray-900 font-mono text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                            placeholder="Напишите ваш пост с использованием Markdown..."
                            required
                        />
                    )}
                </div>

                <div className="mb-8">
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                        Теги
                    </label>
                    <div className="flex mb-2">
                        <input
                            type="text"
                            id="tags"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTag(e.currentTarget.value);
                                    e.currentTarget.value = '';
                                }
                            }}
                            className="flex-1 px-4 py-3 text-gray-900 border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                            placeholder="Добавьте тег и нажмите Enter"
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                handleAddTag(input.value);
                                input.value = '';
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-r-lg transition-colors"
                        >
                            Добавить
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="flex items-center px-4 py-2.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                        Удалить запись
                    </button>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => navigate(`/blog/${post.id}`)}
                            className="flex items-center justify-center px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                            Отменить
                        </button>
                        <button
                            type="submit"
                            className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <FontAwesomeIcon icon={faSave} className="mr-2" />
                            Сохранить изменения
                        </button>
                    </div>
                </div>
            </form>

            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 text-blue-800">
                <div className="flex items-start">
                    <FontAwesomeIcon icon={faLightbulb} className="mt-1 mr-3 text-blue-500" />
                    <div>
                        <h3 className="font-medium mb-1">Подсказка по форматированию</h3>
                        <p className="text-sm">
                            Используйте Markdown для форматирования. Поддерживаются заголовки (#, ##), списки (-, 1.),
                            жирный (**текст**), курсив (*текст*), код (`код`), цитаты ({'>'} цитата) и
                            [ссылки](https://example.com).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPostEditPage;