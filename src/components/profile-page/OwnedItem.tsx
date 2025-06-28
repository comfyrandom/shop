import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCoins,
    faEllipsisH,
    faThumbtack,
    faArrowUpFromBracket,
    faBan,
    faShirt,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import type {Product} from '../../types/product';
import {Link} from "react-router-dom";
import Markdown from "react-markdown";

interface OwnedItemProps {
    wearing: boolean,
    pinned: boolean,
    product: Product,
    onPinChange?: (productId: number, isPinned: boolean) => void,
    onSaleStatusChange?: (productId: number, isOnSale: boolean, price?: number) => void,
    onWearStatusChange?: (productId: number, isWearing: boolean) => void,
    isOwner: boolean
}

const OwnedItem: React.FC<OwnedItemProps> = ({
                                                 product,
                                                 wearing,
                                                 pinned,
                                                 onPinChange,
                                                 onSaleStatusChange,
                                                 onWearStatusChange,
                                                 isOwner
                                             }) => {
    const [isPinned, setIsPinned] = useState(pinned);
    const [isOnSale, setIsOnSale] = useState(product.status === 'FOR_SALE' || false);
    const [isWearing, setIsWearing] = useState(wearing);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [price, setPrice] = useState(product.price || 0);

    useEffect(() => {
        setIsWearing(wearing);
    }, [product.id, wearing]);

    const toggleSaleStatus = () => {
        if (!isOnSale) {
            // When putting up for sale, show the price modal
            setShowPriceModal(true);
        } else {
            // When removing from sale, just toggle status
            const newStatus = !isOnSale;
            setIsOnSale(newStatus);
            if (onSaleStatusChange) {
                onSaleStatusChange(product.id, newStatus);
            }
        }
    };

    const handleConfirmSale = () => {
        const newStatus = true;
        setIsOnSale(newStatus);
        setShowPriceModal(false);
        if (onSaleStatusChange) {
            onSaleStatusChange(product.id, newStatus, price);
        }
    };

    const togglePinStatus = () => {
        const newStatus = !isPinned;
        setIsPinned(newStatus);
        if (onPinChange) {
            onPinChange(product.id, newStatus);
        }
    };

    const toggleWearStatus = () => {
        const newStatus = !isWearing;
        setIsWearing(newStatus);
        if (onWearStatusChange) {
            onWearStatusChange(product.id, newStatus);
        }
    };

    return (
        <>
            <div
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group border border-gray-100 hover:border-gray-200 flex flex-col h-full">
                <div className="relative h-64 w-full overflow-hidden flex-shrink-0">
                    <Link key={product.id} to={`/product/${product.id}`}>
                        <img
                            src={product.picture}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {isOnSale &&
                            <div
                                className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center space-x-1">
                                <span className="font-semibold text-gray-900">{product.price}</span>
                                <FontAwesomeIcon icon={faCoins} className="text-yellow-500"/>
                            </div>
                        }
                    </Link>

                    {isOwner && <button
                        onClick={togglePinStatus}
                        className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isPinned ? 'bg-blue-100 text-blue-600' : 'bg-white/80 text-gray-500 hover:bg-gray-100'}`}
                    >
                        <FontAwesomeIcon icon={faThumbtack} className={`w-4 h-4 ${isPinned ? 'rotate-45' : ''}`}/>
                    </button>}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate text-lg mb-1">{product.name}</h3>
                            <div className="text-gray-500 text-sm line-clamp-2 prose">
                                <Markdown>{product.description}</Markdown>
                            </div>
                        </div>
                        <button
                            className="text-gray-400 hover:text-gray-600 p-1 -mt-1 -mr-1 rounded-full hover:bg-gray-100 transition-colors">
                            <FontAwesomeIcon icon={faEllipsisH} className="w-4 h-4"/>
                        </button>
                    </div>

                    <div className="flex-grow"></div>

                    <div className="mt-auto space-y-2">
                        {isOwner && <>
                            <button
                                onClick={toggleWearStatus}
                                className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                                    isWearing
                                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={faShirt}
                                    className="w-3 h-3"
                                />
                                <span>{isWearing ? 'Снять' : 'Надеть'}</span>
                            </button>

                            <button
                                onClick={toggleSaleStatus}
                                className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                                    isOnSale
                                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={isOnSale ? faBan : faArrowUpFromBracket}
                                    className="w-3 h-3"
                                />
                                <span>{isOnSale ? 'Снять с продажи' : 'Выставить на продажу'}</span>
                            </button>
                        </>}

                        <div
                            className="flex items-center text-xs text-gray-400 space-x-2 border-t border-gray-100 pt-3">
                            <span>{isOnSale ? 'В продаже' : 'Не продается'}</span>
                            {isPinned && (
                                <>
                                    <span>•</span>
                                    <span className="text-blue-500">Закреплено</span>
                                </>
                            )}
                            {isWearing && (
                                <>
                                    <span>•</span>
                                    <span className="text-purple-500">Надето</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Price Modal */}
            {showPriceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Установите цену</h3>
                            <button
                                onClick={() => setShowPriceModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FontAwesomeIcon icon={faXmark} className="w-5 h-5"/>
                            </button>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                Цена (в монетах)
                            </label>
                            <input
                                type="number"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Введите цену"
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowPriceModal(false)}
                                className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleConfirmSale}
                                disabled={price <= 0}
                                className={`flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors ${price <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Подтвердить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OwnedItem;