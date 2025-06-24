import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faInfoCircle, faMapMarkerAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { faBitcoin } from "@fortawesome/free-brands-svg-icons";
import {Link} from "react-router-dom";

interface ProductCardItem {
    id: string | number;
    image: string;
    title: string;
    price: number;
    owner?: string;
    location?: string;
}

interface ProductCardProps {
    product: ProductCardItem;
}

const ProductCard = ({ product } : ProductCardProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300 flex flex-col h-full">

            {/* Изображение товара */}
            <div className="relative overflow-hidden">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-60 max-sm:h-80 object-cover hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Контент карточки */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Заголовок и цена */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>

                {/* Блок с крипто-ценой */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3 flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Цена:</span>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faBitcoin} className="text-yellow-500 mr-2 text-lg" />
                        <span className="text-xl font-bold text-gray-900">{product.price.toFixed(2)}</span>
                    </div>
                </div>

                {/* Информационные блоки */}
                <div className="space-y-3 mb-4">
                    {/* Владелец */}
                    <div className="flex items-center">
                        <div className="bg-purple-100 p-2 rounded-lg mr-3">
                            <FontAwesomeIcon icon={faUser} className="text-purple-600" />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">Текущий владелец</div>
                            <div className="font-medium text-blue-600">{product.owner || "Не указан"}</div>
                        </div>
                    </div>

                    {/* Локация */}
                    {product.location && (
                        <div className="flex items-center">
                            <div className="bg-red-100 p-2 rounded-lg mr-3">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Местоположение</div>
                                <div className="font-medium text-gray-700">{product.location}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Кнопки действий */}
                <div className="mt-auto pt-3 space-y-3">
                    <button
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center transition-colors duration-300"
                        onClick={() => alert(`Товар ${product.id} добавлен в корзину`)}
                    >
                        <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                        В корзину
                    </button>
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