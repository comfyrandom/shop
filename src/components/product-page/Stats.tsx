import React from 'react';
import {unitsService} from "../../utils/units.util.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRuler, faRulerVertical} from "@fortawesome/free-solid-svg-icons";
import {StatItem} from "./StatItem.tsx";
import type {Product, ProductDetails} from "../../types/product.ts";

interface StatsProps {
    product: Product & ProductDetails;
}

const Stats: React.FC<StatsProps> = ({product}) => {
    return (
        <>
            <button
                onClick={() => unitsService.toggleUnitSystem()}
                className="top-5 right-5 items-center gap-2 text-xs bg-white hover:bg-gray-50 px-3 py-1.5 rounded-full transition-colors text-gray-800 border border-gray-200 shadow-sm"
            >
                <FontAwesomeIcon
                    icon={unitsService.isMetric() ? faRuler : faRulerVertical}
                    className="text-blue-600"
                />
                {unitsService.isMetric() ? ' МЕТРИЧЕСКАЯ' : ' ИМПЕРСКАЯ'}
            </button>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 text-gray-800">
                {product.details?.age && <StatItem value={product.details.age.toString()} label="Возраст"/>}
                {product.details?.height && <StatItem value={unitsService.formatHeight(product.details.height)} label="Рост"/>}
                {product.details?.weight && <StatItem value={unitsService.formatWeight(product.details.weight)} label="Вес"/>}
                {product.details?.biometry && <StatItem value={product.details.biometry} label="Биометрия"/>}
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