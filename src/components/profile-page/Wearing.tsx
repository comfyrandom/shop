import React from 'react';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import type {Product} from "../../types/product.ts";

interface WearingProps {
    product?: Product;
}

const Wearing : React.FC<WearingProps> = ({product}) => {
    if (!product) {
        return (
            <>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className={`text-green-500 mr-2`} />
                    В данный момент надето
                </h2>

                <div className="flex items-center p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border border-gray-300">
                    <div className="w-20 h-20 min-w-20 bg-gray-300 rounded-full overflow-hidden mr-4 border-2 border-white shadow-md">
                        <div className="w-full h-full bg-gray-300"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-500">Скрытый предмет</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1 max-w-md">
                            <span className="line-clamp-1">
                                Информация об этом предмете недоступна
                            </span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className={`text-green-500 mr-2`} />
                В данный момент надето
            </h2>

            <Link to={`/product/${product.id}`}>
                <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <div className="w-20 h-20 min-w-20 bg-gray-200 rounded-full overflow-hidden mr-4 border-2 border-white shadow-md">
                        <img src={product.picture} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1 max-w-md">
                          <span className="line-clamp-1">
                            {product.description}
                          </span>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default Wearing;