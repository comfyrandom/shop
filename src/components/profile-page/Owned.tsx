import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faComment, faEllipsisH, faHeart, faShare,
    faShirt, faStar, faTags, faCopy
} from "@fortawesome/free-solid-svg-icons";
import type { Product } from '../../types/product';
import {Link} from "react-router-dom";

interface OwnedProps {
    products: Product[];
}

const Owned: React.FC<OwnedProps> = ({ products }) => {
    const [showShareModal, setShowShareModal] = useState(false);
    const [currentProductId, setCurrentProductId] = useState<number | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const handleShareClick = (productId: number) => {
        setCurrentProductId(productId);
        setShowShareModal(true);
        setIsCopied(false);
    };

    const baseUrl = import.meta.env.BASE_URL || '';
    const url = `${window.location.origin}${baseUrl}#/product/${currentProductId}`;

    const copyToClipboard = () => {
        if (!currentProductId) return;
        navigator.clipboard.writeText(url)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    const closeModal = () => {
        setShowShareModal(false);
        setCurrentProductId(null);
    };

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    const displayedProducts = showAll ? products : products.slice(0, 2);

    return (
        <>
            {showShareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">Поделиться ссылкой на товар</h3>
                        <div className="flex items-center border border-gray-300 rounded p-2 mb-4">
                            <input
                                type="text"
                                readOnly
                                value={url}
                                className="flex-grow outline-none bg-transparent"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                                <FontAwesomeIcon icon={faCopy} />
                            </button>
                        </div>
                        {isCopied && (
                            <p className="text-green-500 text-sm mb-4">Ссылка скопирована в буфер обмена!</p>
                        )}
                        <div className="flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <FontAwesomeIcon icon={faShirt} className="text-red-500 text-2xl mr-2" />
                    <h2 className="text-2xl font-semibold text-gray-800">Коллекция шкур</h2>
                </div>
                <div className="flex space-x-3">
                    <button className="hidden text-gray-500 hover:text-gray-700">
                        <FontAwesomeIcon icon={faTags} className="mr-1" /> Фильтры
                    </button>
                    <button
                        className={`${showAll ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-800 font-medium`}
                        onClick={toggleShowAll}
                    >
                        {!showAll ? <>Показать все ({products.length})</> : <>Свернуть</>}
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {displayedProducts.map(skin => (
                    <Link key={skin.id} to={`/product/${skin.id}`}>
                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all group">
                            <div className="relative h-64 bg-gray-200 overflow-hidden">
                                <div className="absolute inset-0">
                                    <img
                                        src={skin.picture}
                                        alt={skin.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center text-white">
                                            <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                                            <span className="font-bold">{10}</span>
                                            <span className="text-gray-300 ml-1">({10})</span>
                                        </div>
                                        <span className="bg-black/60 text-white text-sm px-2 py-1 rounded">{skin.price}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{skin.name}</h3>
                                        <p className="text-gray-600 line-clamp-1">{skin.description}</p>
                                    </div>
                                    <button className="hidden text-gray-400 hover:text-gray-600">
                                        <FontAwesomeIcon icon={faEllipsisH} />
                                    </button>
                                </div>

                                <div className="flex hidden justify-between items-center pt-3 mt-3 border-t border-gray-100">
                                    <button className="flex items-center text-gray-500 hover:text-red-500">
                                        <FontAwesomeIcon icon={faHeart} className="mr-1" />
                                        <span>142</span>
                                    </button>
                                    <button className="hidden flex items-center text-gray-500 hover:text-blue-500">
                                        <FontAwesomeIcon icon={faComment} className="mr-1" />
                                        <span>Отзывы ({0})</span>
                                    </button>
                                    <button
                                        className="flex items-center text-gray-500 hover:text-green-500"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleShareClick(skin.id);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faShare} className="mr-1" />
                                        <span>Поделиться</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
};

export default Owned;