import React from "react";

interface BadgeProps {
    text: string;
    color?: string;
}

const Badge: React.FC<BadgeProps> = ({text, color = "white"}) => {
    return (
        <span className={`text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm`}
              style={{backgroundColor: color}}>
            {text}
        </span>
    );
};

export default Badge;