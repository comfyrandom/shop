import React from "react";

interface TagProps {
    text: string;
    color?: string;
}

const Tag: React.FC<TagProps> = ({text, color = "white"}) => {
    return (
        <span className={`text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm`}
              style={{backgroundColor: color}}>
            {text}
        </span>
    );
};

export default Tag;