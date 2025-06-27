import React from "react";
import { Link } from "react-router-dom";
import styles from "./CurrentOwner.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins} from "@fortawesome/free-solid-svg-icons";

interface CurrentOwnerProps  {
    ownerId: string;
    name: string;
    picture: string;
    description?: string;
    isForSale?: boolean;
    price?: number;
}

const CurrentOwner: React.FC<CurrentOwnerProps> = ({
                                                       ownerId,
                                                       name,
                                                       picture,
                                                       description,
                                                       isForSale = true,
                                                       price = 5000
                                                   }) => (
    <div className="space-y-3">
        <Link to={`/user/${ownerId}`}>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 hover:border-pink-300 transition-colors duration-200 shadow-sm hover:shadow-md">
                <div className="flex items-start gap-4">
                    <img
                        src={picture}
                        alt={name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white group-hover:border-pink-200 transition-colors duration-200 flex-shrink-0"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/56';
                        }}
                    />
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg group-hover:text-pink-600 transition-colors duration-200">
                            {name}
                        </h3>
                        {description && (
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Link>

        {isForSale && (
            <div className="relative">
                <div className={`absolute -top-3 left-4 h-3 w-6 bg-emerald-400 ${styles.clipTriangle}`}></div>
                <div className="bg-white border-2 border-emerald-400 rounded-lg p-3 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <div className="h-8 w-8 bg-emerald-400 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="absolute -top-1 -right-1 h-4 w-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500">ДОСТУПНО ДЛЯ ПОКУПКИ</p>
                                <p className="text-sm font-bold text-gray-800">Этот объект продаётся</p>
                            </div>
                        </div>
                        {price && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500">СТОИМОСТЬ</p>
                                <p className="text-xl font-extrabold text-emerald-600">{price.toLocaleString()} <FontAwesomeIcon icon={faCoins} /></p>
                            </div>
                        )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-dashed border-gray-200 flex justify-end">
                        <button className="px-4 py-1.5 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-sm font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200">
                            Запросить сделку
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
);

export default CurrentOwner;