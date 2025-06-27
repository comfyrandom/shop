import React from "react";

interface SectionCardProps {
    children?: React.ReactNode;
    className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ children, className}) => (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
        {children}
    </div>
);

export default SectionCard;