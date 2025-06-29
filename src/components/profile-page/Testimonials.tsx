import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faStar, faStarHalfAlt, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { Testimonial } from "../../types/userProfile.ts";
import { Link } from "react-router-dom";
import { addReview, deleteReview, updateReview } from "../../services/reviews.service.ts";
import {useAuth} from "../../hooks/useAuth.ts";
import {LoadingCard} from "../common/StatusCards.tsx";

interface TestimonialsProps {
    reviews: Testimonial[];
    userId: string;
}

const Testimonials: React.FC<TestimonialsProps> = ({ reviews, userId }) => {

    const { user, initialized } = useAuth();
    const [reviewList, setReviewList] = useState<Testimonial[]>(reviews);
    const [isWritingReview, setIsWritingReview] = useState(false);
    const [isEditingReview, setIsEditingReview] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [currentUserReview, setCurrentUserReview] = useState<Testimonial | null>(null);

    useEffect(() => {
        if (!user) {
            return;
        }

        const userReview = reviewList.find(review => review.reviewer_id === user.id);

        if (userReview) {
            setCurrentUserReview(userReview);
        }
    }, [reviewList, user?.id]);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setError('Вы должны войти в систему, чтобы оставить отзыв.');
            return;
        }

        if (rating === 0) {
            setError('Пожалуйста, выберите рейтинг.');
            return;
        }

        if (!comment.trim()) {
            setError('Пожалуйста, напишите отзыв.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            let success: boolean;

            if (isEditingReview) {
                success = await updateReview(userId, user.id, rating, comment.trim());
            } else {
                success = await addReview(userId, user.id, rating, comment.trim());
            }

            if (success) {
                const updatedReviews = isEditingReview
                    ? reviewList.map((r) =>
                        r.reviewer_id === user.id
                            ? { ...r, rating, comment }
                            : r
                    )
                    : [...reviewList, {
                        reviewer_id: user.id,
                        reviewer_name: 'Вы',
                        rating,
                        comment,
                        created_at: new Date().toISOString()
                    }];

                setReviewList(updatedReviews);
                setComment('');
                setRating(0);
                setIsWritingReview(false);
                setIsEditingReview(false);
            }
        } catch (err) {
            console.log(err);
            setError('Не удалось отправить отзыв. Пожалуйста, попробуйте снова.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditReview = (review: Testimonial) => {
        setRating(review.rating);
        setComment(review.comment);
        setIsEditingReview(true);
        setIsWritingReview(true);
    };

    const handleDeleteReview = async () => {
        if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
            try {
                if (!user || !user.id) {
                    setError('Вы должны войти в систему, чтобы удалить отзыв.');
                    return;
                }

                const success = await deleteReview(userId, user.id);
                if (success) {
                    const updatedReviews = reviewList.filter(r => r.reviewer_id !== user.id);
                    setReviewList(updatedReviews);
                    setCurrentUserReview(null);
                    setIsEditingReview(false);
                    setIsWritingReview(false);
                }
            } catch (err) {
                console.error(err);
                setError('Не удалось удалить отзыв. Пожалуйста, попробуйте снова.');
            }
        }
    };

    const cancelEditing = () => {
        setIsWritingReview(false);
        setIsEditingReview(false);
        setRating(0);
        setComment('');
        setError('');
    };

    if (!initialized) {
        return <LoadingCard message={"Идёт загрузка..."} />
    }

    return (
        <div className="mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center text-gray-800">
                    <FontAwesomeIcon icon={faComment} className="text-amber-500 mr-3" />
                    Отзывы клиентов
                    {reviewList.length > 0 && (
                        <span className="ml-2 text-sm font-normal bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {reviewList.length}
                        </span>
                    )}
                </h2>
                {user && user.id && user.id !== userId && !currentUserReview && (
                    <button
                        onClick={() => setIsWritingReview(!isWritingReview)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-1.5 rounded-lg text-sm shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                        Написать отзыв
                    </button>
                )}
            </div>

            {user && (isWritingReview || isEditingReview) && (
                <div className="mb-8 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">
                        {isEditingReview ? 'Редактировать отзыв' : 'Оставить отзыв'}
                    </h3>
                    <form onSubmit={handleSubmitReview}>
                        <div className="flex items-center mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    <FontAwesomeIcon
                                        icon={faStar}
                                        className={`text-2xl ${star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-gray-600 text-sm">
                                {rating > 0 ? `${rating}.0` : ''}
                            </span>
                        </div>
                        <textarea
                            className="w-full p-3 border border-gray-200 rounded-lg mb-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            rows={3}
                            placeholder="Поделитесь вашим мнением..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={cancelEditing}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-1.5 rounded-lg text-sm shadow-sm transition-all duration-200 hover:shadow-md"
                            >
                                Отменить
                            </button>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-1.5 rounded-lg text-sm shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-70"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {isEditingReview ? 'Обновление...' : 'Отправка...'}
                                    </span>
                                ) : isEditingReview ? 'Обновить' : 'Отправить'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {reviewList.length > 0 ? (
                <div className="space-y-4">
                    {reviewList.map((review, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <Link to={`/user/${review.reviewer_id}`} className="hover:underline">
                                        <h3 className="font-semibold text-gray-800">{review.reviewer_name}</h3>
                                    </Link>
                                    <div className="flex items-center mt-1">
                                        <div className="flex items-center mr-3">
                                            {[...Array(5)].map((_, i) => (
                                                <FontAwesomeIcon
                                                    key={i}
                                                    icon={faStar}
                                                    className={`${i < Math.floor(review.rating) ? 'text-yellow-400' : 'text-gray-300'} ${i === Math.floor(review.rating) && review.rating % 1 !== 0 ? 'text-yellow-400 opacity-50' : ''}`}
                                                />
                                            ))}
                                            {review.rating % 1 !== 0 && (
                                                <FontAwesomeIcon
                                                    icon={faStarHalfAlt}
                                                    className="text-yellow-400 -ml-4"
                                                />
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString('ru-RU')}</span>
                                    </div>
                                </div>
                                {user && user.id === review.reviewer_id && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditReview(review)}
                                            className="text-blue-500 hover:text-blue-700"
                                            title="Редактировать отзыв"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            onClick={handleDeleteReview}
                                            className="text-red-500 hover:text-red-700"
                                            title="Удалить отзыв"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                    <FontAwesomeIcon icon={faStar} className="text-blue-400 text-4xl mb-3" />
                    <h3 className="text-lg font-medium text-gray-800 mb-1">Пока нет отзывов</h3>
                    <p className="text-gray-600">Будьте первым, кто оставит отзыв!</p>
                </div>
            )}
        </div>
    );
};

export default Testimonials;
