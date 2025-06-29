import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faPencil, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import {LoadingCard, WarningCard} from "../components/common/StatusCards.tsx";
import {useAuth} from "../hooks/useAuth.ts";
import {createBlogPost} from "../services/blog.service.ts";
import {useNavigate} from "react-router-dom";
import {toast, type ToastOptions} from "react-toastify";

const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true
};

const BlogPostCreatePage = () => {
    const { user, initialized } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [isPreview, setIsPreview] = useState(false);

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createBlogPost(title, content, excerpt, tags).then((result) => {
            if (result) {
                navigate(`/blog/${result}`);
            } else {
                toast.error("Не удалось создать пост", toastOptions);
            }
        });
    };

    if (!initialized) {
        return <LoadingCard message={"Загрузка"}></LoadingCard>;
    }

    if (!user){
        return <WarningCard header={"Ошибка"} description={"Создание постов недоступно неавторизованным пользователям"} />
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Создание новой записи</h1>
                <p className="text-gray-600">Заполните форму ниже, чтобы опубликовать новую запись в блоге</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="mb-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Заголовок
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
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
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
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
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                    ) : (
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
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
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            className="flex-1 px-4 py-3 text-gray-900 border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                            placeholder="Добавьте тег и нажмите Enter"
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-r-lg transition-colors"
                        >
                            Добавить
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
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

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => navigate('/blog')}
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
                        Опубликовать запись
                    </button>
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

export default BlogPostCreatePage;