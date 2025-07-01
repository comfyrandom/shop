import React from 'react';
import {StatItem} from "./StatItem.tsx";
import type {Product, ProductDetails} from "../../types/product.ts";

interface StatsProps {
    product: Product & ProductDetails;
}

const Stats: React.FC<StatsProps> = ({product}) => {

    const calculateAge = (birthDate: string): number => {
        const birthDateObj = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }

        return age;
    };

    const getAge = (): string => {
        if (product.passport_data?.date_of_birth) {
            return calculateAge(product.passport_data.date_of_birth).toString();
        }
        return product.details?.age?.toString() || '';
    };

    const ageValue = getAge();

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 text-gray-800">
                {ageValue && parseInt(ageValue) > 0 && <StatItem value={ageValue} label="Возраст"/>}
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