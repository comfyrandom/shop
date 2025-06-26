import React from "react";

interface RelationshipItemProps {
    relationships: Array<{
        name: string;
        relation: string;
        status?: string;
    }>;
}

const Relationships: React.FC<RelationshipItemProps> = ({relationships}) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {relationships.map((person, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-pink-500/50 shadow-sm transition-colors">
                <div className="font-bold truncate text-gray-800">{person.name}</div>
                <div className="text-xs text-blue-600 uppercase tracking-wider font-medium">{person.relation}</div>
                {person.status && <div className="text-xs mt-1 text-gray-500 italic">{person.status}</div>}
            </div>
        ))}
    </div>
);

export default Relationships;