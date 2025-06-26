import React from "react";

type TextSize = '2xl' | 'xl' | 'base' | 'lg' | 'sm';
type SubtextSize = '2xl' | 'xl' | 'sm' | 's' | 'xs';

interface StatItemProps {
    value: string;
    label: string;
    className?: string;
    textSize?: TextSize;
    subtextSize?: SubtextSize;
}

export const StatItem: React.FC<StatItemProps> = ({ value, label, className, textSize = '2xl', subtextSize = 'xs' }) => (
    <div className={`flex flex-col items-center p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-pink-200 ${className}`}>
        <span className={`text-${textSize} text-center font-bold text-gray-800 truncate max-w-full`}>{value}</span>
        <span className={`text-${subtextSize} text-blue-600 uppercase tracking-wider font-medium truncate max-w-full`}>{label}</span>
    </div>
);