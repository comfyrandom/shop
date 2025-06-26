import React from "react";

interface PersonalityProps {
    traits: string[];
}

export const Personality: React.FC<PersonalityProps> = ({traits}) => {
    const getRandomColor = () => {
        const colors = [
            'bg-pink-500/20 text-pink-400',
            'bg-purple-500/20 text-purple-400',
            'bg-blue-500/20 text-blue-400',
            'bg-amber-500/20 text-amber-400',
            'bg-emerald-500/20 text-emerald-400',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div className="flex flex-wrap gap-2">
            {traits.map((trait, index) => (
                <span key={index} className={`px-3 py-1.5 rounded-full text-sm font-medium ${getRandomColor()}`}>
                    {trait}
                </span>
            ))}
        </div>
    );
};

export default Personality;