import {faBoxOpen, faEye, faTooth} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface AccessoriesProps {
    accessories: Array<{
        name: string;
        type: string;
        description: string;
        price: string;
        included: boolean;
    }>;
}

const Accessories: React.FC<AccessoriesProps> = ({ accessories }) => {
    const getIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'dentures':
                return faTooth;
            case 'lenses':
                return faEye;
            default:
                return faBoxOpen;
        }
    };

    return (
        <div className="space-y-3">
            {accessories.map((accessory, index) => (
                <div key={index}
                     className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-pink-500/50 transition-colors shadow-sm">
                    <div className="text-2xl w-[30px]">
                        <FontAwesomeIcon icon={getIcon(accessory.type)} className="text-blue-600"/>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-gray-800">{accessory.name}</h4>
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${accessory.included ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {accessory.included ? 'ВКЛЮЧЕНО' : `+${accessory.price}`}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 uppercase mt-1">{accessory.type}</p>
                        <p className="text-sm text-gray-700 mt-2">{accessory.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Accessories;