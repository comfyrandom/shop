import React from 'react';

interface OwnershipProps {
    previousOwners?: number;
    price: number;
}

const Ownership: React.FC<OwnershipProps> = ({previousOwners, price}) => {
    return (
        <div className="space-y-4">
            {previousOwners !== undefined && previousOwners !== 0 &&
                <div>
                    <p className="text-sm text-blue-700 uppercase tracking-wider font-medium">Предыдущих владельцев</p>
                    <p className="font-medium text-blue-900">{previousOwners}</p>
                </div>
            }
            <div>
                <p className="text-sm text-blue-700 uppercase tracking-wider font-medium">Текущая стоимость</p>
                <p className="text-2xl font-bold text-blue-900">{price}</p>
            </div>
        </div>
    );
};

export default Ownership;