import React from "react";

interface SectionCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({title, children, className}) => (
    <div className={` bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 ${className}`}>
        <h3 className="text-xl font-bold mb-4 bg-clip-text bg-gradient-to-r text-gray-800 uppercase tracking-wider">
            {title}
        </h3>
        <div className="text-gray-800 space-y-3">{children}</div>
    </div>
);

export default SectionCard;