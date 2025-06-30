import React from 'react';

interface HistoryProps {
    history: Array<{
        date: string;
        title: string;
        description: string;
    }>;
}

const History : React.FC<HistoryProps> = ({history}) => {
    return (
        <div className="space-y-2">
            {history.map((item, index) => (
                <div key={index} className="relative pl-8 pb-6 border-l-2 border-blue-500/30 last:border-l-0 last:pb-0">
                    <div className="absolute w-4 h-4 rounded-full bg-blue-500 -left-2 top-0"></div>
                    <div className="text-xs text-blue-600 font-mono">{item.date}</div>
                    <h4 className="font-bold text-gray-800 mt-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                </div>
            ))}
        </div>
    );
};

export default History;