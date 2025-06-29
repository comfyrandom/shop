import type {BlogPreviewRecord} from "../../services/blog.service.ts";
import React from "react";
import {Link} from "react-router-dom";

interface BlogsProps {
    author: {
        picture?: string,
        name: string
    };
    blogs: BlogPreviewRecord[]
}

const Blogs: React.FC<BlogsProps> = ({ author, blogs }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Блоги</h2>
            <div className="grid md:grid-cols-2 gap-6">
                {blogs.map(blog => (
                    <div key={blog.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200">
                        <div className="p-5">
                            <div className="flex items-center space-x-3 mb-3">
                                { author.picture &&
                                    <img
                                        src={author.picture}
                                        alt={author.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                }
                                <span className="font-medium text-gray-700">{author.name}</span>
                            </div>
                            <Link to={`/blog/${blog.id}`}>
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{blog.title}</h3>
                            </Link>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{blog.excerpt}</p>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-2">
                                    {blog.tags.map(tag => (
                                        <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                                {tag}
                                            </span>
                                    ))}
                                </div>
                                <span className="text-xs text-gray-400">
                                        {new Date(blog.created_at).toLocaleDateString()}
                                    </span>
                            </div>
                            <Link to={`/blog/${blog.id}`}>
                                <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm">
                                    Читать →
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blogs;