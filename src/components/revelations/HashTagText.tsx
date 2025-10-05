interface HashTagTextProps {
    text: string,
    className?: string,
    onHashtagClick?: (hastTag: string) => void,
    hashtagClass?: string
}

const HashTagText = ({
                         text,
                         className = "",
                         onHashtagClick,
                         hashtagClass = "text-blue-600 font-medium hover:text-blue-800 cursor-pointer transition-colors"
                     } : HashTagTextProps) => {
    const hashtagRegex = /(#\S+)/g;

    const handleHashtagClick = (hashtag: string) => {
        if (onHashtagClick) {
            onHashtagClick(hashtag);
        } else {
            console.log('Hashtag clicked:', hashtag);
        }
    };

    return (
        <div className={`px-4 pb-3 ${className}`}>
            <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-line">
                {text.split(hashtagRegex).map((part, index) =>
                    part.startsWith('#') ? (
                        <span
                            key={index}
                            className={hashtagClass}
                            onClick={() => handleHashtagClick(part)}
                        >
                            {part}
                        </span>
                    ) : (
                        part
                    )
                )}
            </p>
        </div>
    );
};

export default HashTagText;