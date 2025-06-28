import React from 'react';

interface AppearanceProps {
    appearance: string[];
}

const Appearance: React.FC<AppearanceProps> = ({ appearance }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {appearance.map((item, index) => (
                <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 transition-colors"
                >
                    {item}
                </span>
            ))}
        </div>
    );
};

export default Appearance;