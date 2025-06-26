import React from 'react';

interface AppearanceProps {
    appearance: string[]
}

const Appearance : React.FC<AppearanceProps> = ({appearance}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {appearance.map((item, index) => (
                <div key={index}
                     className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-pink-500/50 transition-colors shadow-sm">
                    <div className="text-pink-500 text-xs mt-0.5">•</div>
                    <span className="text-gray-700 text-sm">{item}</span>
                </div>
            ))}
        </div>
    );
};

export default Appearance;