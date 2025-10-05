import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faHeart, faLocationDot, faUser, faTrash} from "@fortawesome/free-solid-svg-icons";
import {faHeart as faRegularHeart} from "@fortawesome/free-regular-svg-icons";
import {
    addRevelationComment,
    deleteRevelationComment,
    type RevelationPost
} from "../../services/revelations.service.ts";
import type {IconDefinition} from "@fortawesome/free-brands-svg-icons";
import {Link} from "react-router-dom";
import React, {useState} from "react";
import type {AccountForComment} from "../../pages/RevelationsPage.tsx";
import AccountPickerPopup from "./AccountPickerPopup.tsx";
import HashTagText from "./HashTagText.tsx";
import PictureModal from "../product-page/PictureModal.tsx";

interface PostProps {
    post: RevelationPost;
    onLike: (postId: number) => void;
    onDeletePost: (postId: number) => void;
    canComment: boolean;
    accounts: AccountForComment[];
}

interface ConfirmationPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationPopup = ({
                               isOpen,
                               onClose,
                               onConfirm,
                               title,
                               message,
                               confirmText = "Удалить",
                               cancelText = "Отмена"
                           }: ConfirmationPopupProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-fade-in">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{message}</p>
                </div>

                <div className="p-6">
                    <div className="flex space-x-3 justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors font-medium"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const RevelationsPost = ({post, canComment, onLike, onDeletePost, accounts}: PostProps) => {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [showAccountPicker, setShowAccountPicker] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<AccountForComment>(accounts[0]);
    const [localComments, setLocalComments] = useState(post.comments || []);

    const [showPostDeletePopup, setShowPostDeletePopup] = useState(false);
    const [showFullImage, setShowFullImage] = useState(false);
    const [showCommentDeletePopup, setShowCommentDeletePopup] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedAccount === null)
        {
            console.error('Аккаунт не выбран');
            return;
        }

        if (newComment.trim()) {
            const success = await addRevelationComment(post.id, selectedAccount.id, newComment.trim());
            if (success) {
                const newCommentObj = {
                    id: Date.now(),
                    user_id: selectedAccount.id,
                    content: newComment.trim(),
                    created_at: new Date().toISOString(),
                    user: {
                        id: selectedAccount.id,
                        name: selectedAccount.name,
                        alias: selectedAccount.alias,
                        picture: selectedAccount.picture
                    }
                };
                setLocalComments(prev => [newCommentObj, ...prev]);
                setNewComment("");
            }
        }
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const handleAccountSelect = (account: AccountForComment) => {
        setSelectedAccount(account);
        setShowAccountPicker(false);
    };

    // Check if current post author is in accounts array
    const canDeletePost = accounts.some(account => post.author && account.id === post.author.id);

    // Check if comment author is in accounts array
    const canDeleteComment = (commentAuthorId: number) => {
        return accounts.some(account => account.id === commentAuthorId);
    };

    const handleDeletePostClick = () => {
        setShowPostDeletePopup(true);
    };

    const handlePostDeleteConfirm = () => {
        onDeletePost(post.id);
        setShowPostDeletePopup(false);
    };

    const handlePostDeleteCancel = () => {
        setShowPostDeletePopup(false);
    };

    const handleDeleteCommentClick = (commentId: number) => {
        setCommentToDelete(commentId);
        setShowCommentDeletePopup(true);
    };

    const handleCommentDeleteConfirm = async () => {
        if (commentToDelete) {
            const success = await deleteRevelationComment(commentToDelete);
            if (success) {
                setLocalComments(prev => prev.filter(comment => comment.id !== commentToDelete));
            }
        }
        setShowCommentDeletePopup(false);
        setCommentToDelete(null);
    };

    const handleCommentDeleteCancel = () => {
        setShowCommentDeletePopup(false);
        setCommentToDelete(null);
    };

    return (
        <div
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100 overflow-hidden">

            <div className="p-4 pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            {post.author ? (
                                <Link to={`/product/${post.author.alias}`}>
                                    <img
                                        src={post.author.picture}
                                        alt={post.author.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-pink-200 hover:border-pink-400 transition-colors duration-300"
                                    />
                                </Link>
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-300 border-2 border-gray-400 flex items-center justify-center">
                                    <span className="text-gray-600 text-lg font-semibold">?</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            {post.author ? (
                                <Link to={`/product/${post.author.alias}`}>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-gray-900 hover:text-purple-600 transition-colors cursor-pointer">
                                            {post.author.name}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500">@{post.author.alias}</span>
                                </Link>
                            ) : (
                                <div>
                                    <span className="font-semibold text-gray-900">Автор неизвестен</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">
                          {new Date(post.created_at).toLocaleString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false
                          })}
                        </span>
                        {canDeletePost && (
                            <button
                                onClick={handleDeletePostClick}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Удалить пост"
                            >
                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-4 pb-3">
                <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-line">
                    <HashTagText text={post.content} />
                </p>
            </div>

            {post.location && (
                <div className="px-4 pb-3">
                    <div className="flex items-center space-x-2 text-gray-600 bg-white/50 rounded-lg px-3 py-2 border border-purple-100 hover:border-purple-200 transition-colors">
                        <FontAwesomeIcon
                            icon={faLocationDot}
                            className="text-red-400 text-sm"
                        />
                        <span className="text-sm font-medium">{post.location}</span>
                    </div>
                </div>
            )}

            {post.media && (
                <div className="px-4 pb-3" onClick={() => setShowFullImage(true)}>
                    <img
                        src={post.media}
                        alt="Post media"
                        className="w-full rounded-xl object-cover max-h-96 border border-purple-200 hover:border-purple-300 transition-colors"
                    />
                </div>
            )}

            <div className="px-4 py-3 border-t border-purple-100">
                <div className="flex items-center justify-between text-gray-500">
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => onLike(post.id)}
                            className="flex items-center space-x-2 group transition-all duration-200"
                        >
                            <div className="relative">
                                <FontAwesomeIcon
                                    icon={(post.isLiked ? faHeart : faRegularHeart) as IconDefinition}
                                    className={`text-lg group-hover:scale-110 transition-transform ${
                                        post.isLiked ? 'text-red-500' : 'group-hover:text-red-400'
                                    }`}
                                />
                            </div>
                            <span className={`text-sm font-medium group-hover:text-red-400 ${
                                post.isLiked ? 'text-red-500' : ''
                            }`}>
                            {post.likes}
                          </span>
                        </button>

                        <button
                            onClick={toggleComments}
                            className="flex items-center space-x-2 group hover:text-blue-500 transition-colors"
                        >
                            <FontAwesomeIcon
                                icon={faComment}
                                className="text-lg group-hover:scale-110 transition-transform"
                            />
                            <span className="text-sm font-medium">{localComments.length}</span>
                        </button>
                    </div>
                </div>
            </div>

            {showComments && (
                <div className="border-t border-purple-100 bg-white/50">
                    {canComment ? (
                        <form onSubmit={handleSubmitComment} className="p-4 border-b border-purple-100">
                            <div className="flex space-x-3 mb-3">
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
                            <div className="flex space-x-3">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Напишите комментарий..."
                                    className="flex-1 px-4 py-2 rounded-full border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                                />
                                <button
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Отправить
                                </button>
                            </div>

                        </form>
                    ) : (
                        <div
                            className="m-3 bg-purple-100 border border-purple-300 text-purple-700 px-4 py-3 rounded-lg text-center">
                            Приобретите свою первую шкуру, чтобы оставлять комментарии
                        </div>)
                    }

                    <div className="overflow-y-auto">
                        {localComments.length > 0 ? (
                            <div className="p-4 space-y-6">
                                {localComments.map((comment) => {
                                    const canDelete = canDeleteComment(comment.user_id);
                                    return (
                                        <div key={comment.id} className="flex space-x-3 mb-6 last:mb-0 group">
                                            <img
                                                src={comment.user.picture}
                                                alt={comment.user.name}
                                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-gray-500 font-medium">
                                                            @{comment.user.alias}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(comment.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {canDelete && (
                                                        <button
                                                            onClick={() => handleDeleteCommentClick(comment.id)}
                                                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200"
                                                            title="Удалить комментарий"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-gray-800 text-sm">
                                                    {comment.content}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <FontAwesomeIcon
                                    icon={faComment}
                                    className="text-gray-300 text-2xl mb-2"
                                />
                                <p className="text-gray-500 text-sm">
                                    Пока нет комментариев. Будьте первым!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(showAccountPicker && <AccountPickerPopup accounts={accounts} selectedAccount={selectedAccount}
                                 header={"Выберите аккаунт для комментария"} onAccountSelect={handleAccountSelect}
                                 onCancel={() => setShowAccountPicker(false)}/>)}

            <ConfirmationPopup
                isOpen={showPostDeletePopup}
                onClose={handlePostDeleteCancel}
                onConfirm={handlePostDeleteConfirm}
                title="Удаление поста"
                message="Вы уверены, что хотите удалить этот пост? Это действие нельзя отменить."
                confirmText="Удалить пост"
                cancelText="Отмена"
            />

            <ConfirmationPopup
                isOpen={showCommentDeletePopup}
                onClose={handleCommentDeleteCancel}
                onConfirm={handleCommentDeleteConfirm}
                title="Удаление комментария"
                message="Вы уверены, что хотите удалить этот комментарий? Это действие нельзя отменить."
                confirmText="Удалить комментарий"
                cancelText="Отмена"
            />

            { showFullImage && post.media &&
                <PictureModal pictureUrl={post.media} onClose={() => setShowFullImage(false)} />
            }
        </div>
    );
};