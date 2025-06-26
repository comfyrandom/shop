import React from "react";

interface BadgeProps {
    text?: string;
    backgroundColor?: string;
    icon?: React.ReactNode;
    glow?: boolean;
    className?: string;
}

const BadgeWithIcon: React.FC<BadgeProps> = ({text, backgroundColor = "bg-amber-400", icon, glow = false, className = ""}) => {
    return (
        <div className={`relative inline-block ${className}`}>
            <div className={`${backgroundColor} text-black px-4 py-1 rounded-full font-bold text-xs whitespace-nowrap shadow-lg flex items-center select-none`}>
                {icon && <span className="mr-1">{icon}</span>}
                {text}
            </div>
            {glow && (
                <div className={`${backgroundColor} rounded-full blur-sm opacity-60 absolute inset-0 -z-10 animate-pulse`}/>)
            }
        </div>
    );
};

export default BadgeWithIcon;
