import React from "react";

interface SectionCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
    className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({title, description, children, className}) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>

        <div className="mb-6 pb-4 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-gray-500 text-sm">{description}</p>
        </div>

        {children}
    </div>
);

export default SectionCard;