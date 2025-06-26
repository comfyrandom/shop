import React from 'react';

interface FeaturesProps {
    features: Array<{
        title: string;
        description: string;
    }>
}

const Features : React.FC<FeaturesProps> = ({features}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 font-semibold">
                        {feature.title}
                    </p>
                    <p className="text-gray-700">
                        {feature.description}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Features;