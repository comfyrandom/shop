import React from "react";
import {faBitcoin} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface FooterProps {
    price: number;
}

const Footer: React.FC<FooterProps> = ({price}) => {
    return (
        <div className="mt-10 text-center">
            <button className="px-8 py-4 bg-gradient-to-r bg-red-600 text-white font-bold rounded-full hover:opacity-90 transition-all shadow-lg transform hover:scale-105 hover:shadow-xl">
                Купить сейчас · {price} <FontAwesomeIcon icon={faBitcoin} className="text-white" />
            </button>
            <p className="text-gray-600 text-sm mt-3">30-дневная гарантия возврата · Анонимная доставка по всему миру</p>
            <div className="mt-4 text-xs text-gray-500 border-t border-gray-100 pt-3 max-w-6xl mx-auto">
                <p>Приобретая этот товар, вы подтверждаете, что понимаете: данный продукт был создан по образу реально существовавшего человека.</p>
            </div>
        </div>
    );
};

export default Footer;