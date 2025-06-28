import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTooth, faEye, faGrinTongue, faBoxOpen} from "@fortawesome/free-solid-svg-icons";
import React from "react";

interface AccessoriesProps {
    accessories?: Array<{
        name: string;
        description: string;
    }>;
}

const Accessories: React.FC<AccessoriesProps> = ({ accessories }) => {
    return (
        <div className="space-y-6">
            {/* Стандартная поставка */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Стандартная поставка</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-pink-500/50 transition-colors shadow-sm">
                        <div className="text-2xl w-[30px]">
                            <FontAwesomeIcon icon={faTooth} className="text-blue-600"/>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-gray-800">Зубные протезы</h4>
                                <span className={`text-xs px-2 py-1 rounded-full bg-green-100 text-green-800`}>
                                    ВКЛЮЧЕНО
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-2">
                                Точная копия зубов оригинала — форма, прозрачность эмали, даже мелкие дефекты.
                                Полная функциональность без дискомфорта.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-pink-500/50 transition-colors shadow-sm">
                        <div className="text-2xl w-[30px]">
                            <FontAwesomeIcon icon={faEye} className="text-blue-600"/>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-gray-800">Контактные линзы</h4>
                                <span className={`text-xs px-2 py-1 rounded-full bg-green-100 text-green-800`}>
                                    ВКЛЮЧЕНО
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-2">
                                Идентичный цвет и рисунок радужки оригинала. Естественный блеск и адаптация к освещению.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-pink-500/50 transition-colors shadow-sm">
                        <div className="text-2xl w-[30px]">
                            <FontAwesomeIcon icon={faGrinTongue} className="text-blue-600"/>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-gray-800">Накладка на язык</h4>
                                <span className={`text-xs px-2 py-1 rounded-full bg-green-100 text-green-800`}>
                                    ВКЛЮЧЕНО
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-2">
                                Повторяет форму и текстуру языка оригинала. Сохраняет естественную подвижность.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Дополнительные аксессуары */}
            {accessories && accessories.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Дополнительные аксессуары</h3>
                    <div className="space-y-3">
                        {accessories.map((accessory, index) => (
                            <div key={index}
                                 className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-pink-500/50 transition-colors shadow-sm">
                                <div className="text-2xl w-[30px]">
                                    <FontAwesomeIcon icon={faBoxOpen} className="text-blue-600"/>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-800">{accessory.name}</h4>
                                        <span className={`text-xs px-2 py-1 rounded-full bg-green-100 text-green-800`}>
                                            ВКЛЮЧЕНО
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-2">{accessory.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accessories;