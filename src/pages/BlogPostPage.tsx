import ReactMarkdown from 'react-markdown';
import './BlogPost.css';
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {type BlogContent, type BlogPreviewRecord, getBlogRecord} from "../services/blog.service.ts";

const BlogPostPage = () => {
    const { postId } = useParams<{ postId: string }>();

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

    if (loading)
        return <div className="text-center py-20">Загрузка...</div>;
    if (error)
        return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!post)
        return <div className="text-center py-20">Продукт не найден</div>;

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden my-8 border border-gray-100">
            {/* Заголовок поста с градиентным фоном */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <Link to={`/user/${post.author_id}`}>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <img
                                    className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-sm"
                                    src={post.author_details.picture}
                                    alt={post.author_details.name}
                                />
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-xl font-bold text-gray-900">{post.author_details.name}</h2>
                                </div>
                                <p className="text-sm text-gray-500">Опубликовано {new Date(post.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Контент поста */}
            <div className="p-6">
                <div className="prose max-w-none mb-6">
                    <h1>{post.title}</h1>
                    {/* Отображение тегов */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 my-4">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default BlogPostPage;