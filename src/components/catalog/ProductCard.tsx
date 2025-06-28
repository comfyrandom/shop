import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faUser } from "@fortawesome/free-solid-svg-icons";
import { faBitcoin } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import type {ProductEssentials} from "../../services/products.service.ts";

interface ProductCardProps {
    product: ProductEssentials;
}

const ProductCard = ({ product } : ProductCardProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300 flex flex-col h-full">

            <div className="relative overflow-hidden">
                <img
                    src={product.picture}
                    alt={product.name}
                    className="w-full h-60 max-sm:h-80 object-cover hover:scale-105 transition-transform duration-500"
                />
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>

                <div className="bg-gray-50 rounded-lg p-3 mb-3 flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Цена:</span>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faBitcoin} className="text-yellow-500 mr-2 text-lg" />
                        <span className="text-xl font-bold text-gray-900">{product.price.toFixed(2)}</span>
                    </div>
                </div>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                        <div className="bg-purple-100 p-2 rounded-lg mr-3">
                            <FontAwesomeIcon icon={faUser} className="text-purple-600" />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">Текущий владелец</div>
                            { product.owner_details &&
                                <Link to={`/user/${product.owner_id}`}>
                                    <div className="font-medium text-blue-600">{product.owner_details.name}</div>
                                </Link>
                            }

                            {
                                !product.owner_details && <div className="font-medium text-blue-600">-</div>
                            }
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-3 space-y-3">
                    <Link to={`/product/${product.id}`}>
                        <button className="w-full py-3 border-2 border-gray-200 hover:border-blue-300 text-gray-800 font-medium rounded-lg flex items-center justify-center transition-all duration-300"
                        >
                            <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-blue-500" />
                            Подробнее
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;