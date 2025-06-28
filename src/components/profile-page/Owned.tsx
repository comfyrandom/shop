import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShirt, faTags } from "@fortawesome/free-solid-svg-icons";
import type { Product } from '../../types/product';
import OwnedItem from './OwnedItem';

interface OwnedProps {
    isOwner: boolean;
    wearingId?: number;
    products: Product[];
    pinnedItems?: Product[];
    onPinChange?: (productId: number, isPinned: boolean) => void;
    onSaleStatusChange?: (productId: number, isOnSale: boolean, price?: number) => void;
    onWearStatusChange?: (productId: number, isWearing: boolean) => void;
}

const Owned: React.FC<OwnedProps> = ({isOwner, products, wearingId, pinnedItems, onPinChange, onSaleStatusChange, onWearStatusChange}) => {
    const [showAll, setShowAll] = useState(false);
    const [displayedProducts, setDisplayedProducts] = useState(products.slice(0, 2));

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    useEffect(() => {
        setDisplayedProducts(showAll ? products : products.slice(0, 2));
    }, [showAll, products, pinnedItems, wearingId]);

    const handlePinChange = (productId: number, isPinned: boolean) => {
        if (onPinChange) {
            onPinChange(productId, isPinned);
        }
    };

    const handleSaleStatusChange = (productId: number, isOnSale: boolean, price?: number) => {
        if (onSaleStatusChange) {
            onSaleStatusChange(productId, isOnSale, price);
        }
    };

    const handleWearStatusChange = (productId: number, isWearing: boolean) => {
        if (onWearStatusChange) {
            onWearStatusChange(productId, isWearing);
        }
    };

    return (
        <>
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
                {displayedProducts.map(product => (
                    <OwnedItem
                        isOwner={isOwner}
                        key={product.id}
                        product={product}
                        pinned={pinnedItems?.some(pinnedItem => pinnedItem.id === product.id) ?? false}
                        wearing={wearingId === product.id}
                        onPinChange={handlePinChange}
                        onSaleStatusChange={handleSaleStatusChange}
                        onWearStatusChange={handleWearStatusChange}
                    />
                ))}
            </div>
        </>
    );
};

export default Owned;