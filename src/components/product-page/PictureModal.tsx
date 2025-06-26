import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

const PictureModal: React.FC<{ pictureUrl: string; onClose: () => void }> = ({pictureUrl, onClose}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl"
            >
                <FontAwesomeIcon icon={faTimes}/>
            </button>
            <div className="relative max-w-4xl w-full max-h-[90vh]">
                <img
                    src={pictureUrl}
                    alt="Full size profile"
                    className="w-full h-full object-contain rounded-lg"
                />
            </div>
        </div>
    );
};

export default PictureModal;