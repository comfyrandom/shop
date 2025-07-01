import React from 'react';
import {StatItem} from "./StatItem.tsx";
import type {Product, ProductDetails} from "../../types/product.ts";

interface StatsProps {
    product: Product & ProductDetails;
}

const Stats: React.FC<StatsProps> = ({product}) => {
    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 text-gray-800">
                {product.details?.age && product.details.age > 0 && <StatItem value={product.details.age.toString()} label="Возраст"/>}
                {product.details.height > 0 && <StatItem value={`${product.details.height} м`} label="Рост"/>}
                {product.details.weight > 0 && <StatItem value={`${product.details.weight} кг`} label="Вес"/>}
                {product.details?.biometry && (
                    <StatItem
                        value={
                            product.details.biometry.endsWith('%')
                                ? product.details.biometry
                                : `${product.details.biometry}%`
                        }
                        label="Биометрия"
                    />
                )}
                {product.details?.max_wear && <StatItem value={product.details.max_wear} label="Макс. время"/>}
                {product.details?.condition && <StatItem value={product.details.condition} label="Состояние"/>}
                {product.details?.background && <StatItem className={'col-span-full'} textSize={'lg'} value={product.details.background} label="Происхождение"/>}
                {product.details?.sexual_preference && <StatItem className={'col-span-full'} textSize={'lg'} value={product.details.sexual_preference} label="Сексуальные предпочтения"/>}
                {product.details?.pussy && <StatItem className={'col-span-full'} textSize={'lg'} value={product.details.pussy} label="Тип вагины"/>}
            </div>
        </>
    );
};

export default Stats;