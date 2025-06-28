import React from "react";

interface PersonalityProps {
    traits: string[];
}

export const Personality: React.FC<PersonalityProps> = ({traits}) => {
    return (
        <div className="flex flex-wrap gap-2">
            {traits.map((trait, index) => (
                <span key={index} className={`px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200`}>
                    {trait}
                </span>
            ))}
        </div>
    );
};

export default Personality;