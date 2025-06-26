import React from 'react';

interface ScenariosProps {
    scenarios: Array<{
        title: string;
        description: string;
    }>
}

const Scenarios: React.FC<ScenariosProps> = ({ scenarios }) => {
    return (
        <div className="space-y-4">
            {scenarios.map((scenario, index) => (
                <div key={index} className="flex items-start">
                    <div className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center mr-4 mt-1 flex-shrink-0 text-sm font-medium">
                        {index + 1}
                    </div>
                    <div>
                        <h4 className="text-gray-800 font-semibold text-base mb-1">{scenario.title}</h4>
                        <p className="text-gray-600 text-sm">{scenario.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Scenarios;