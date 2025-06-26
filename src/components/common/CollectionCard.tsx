import React from "react";
import type Collection from "../../types/collection.ts";

interface CollectionCardProps {
    collection: Collection;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
    return (
        <div className="flex flex-col md:flex-row h-full bg-gray-50 text-gray-800 border border-gray-200 rounded-xl overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="w-[128px] h-[128px] flex-shrink-0 rounded-xl overflow-hidden mx-auto mb-4 md:mx-0 md:mb-0 md:mr-4">
                {collection.icon ? (
                    <img src={collection.icon} alt={`${collection.name} icon`} className="w-full h-full object-cover" />
                ) : null}
            </div>
            <div className="text-center md:text-left">
                <h2 className="text-xl font-semibold truncate uppercase mb-2 text-blue-600">
                    {collection.name}
                </h2>
                <p className="text-sm text-gray-600">{collection.description}</p>
            </div>
        </div>
    );
};

export default CollectionCard;