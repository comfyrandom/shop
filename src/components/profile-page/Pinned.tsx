import type {Product} from "../../types/product.ts";
import React from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThumbtack} from "@fortawesome/free-solid-svg-icons";

interface PinnedProps {
    products: Product[];
}

const Pinned : React.FC<PinnedProps> = ({products}) => {
    return (
        <>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FontAwesomeIcon icon={faThumbtack} className={`text-red-500 mr-2`} />
                Закрепленные
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
                {products.map(product => (
                    <Link to={`/product/${product.id}`} key={product.id}>
                        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-16 min-w-16 h-16 bg-gray-200 rounded-md overflow-hidden mr-3">
                                <img src={product.picture} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-medium">{product.name}</h3>
                                <p className="text-sm line-clamp-1 text-gray-600">{product.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
};

export default Pinned;