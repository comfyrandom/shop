import Badge from "../common/Badge.tsx";
import BadgeWithIcon from "../common/BadgeWithIcon.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGem, faLemon} from "@fortawesome/free-solid-svg-icons";
import type {Product, ProductDetails} from '../../types/product.ts';
import React, {useState} from "react";
import PictureModal from "./PictureModal.tsx";

interface HeaderProps {
    product: Product & ProductDetails;
}

const Header: React.FC<HeaderProps> = ({product}) => {
    const [showFullImage, setShowFullImage] = useState(false);

    const hasNoOwners = true;
    const hasExtras = product.details?.extras !== undefined && product.details.extras !== null && product.details.extras.length > 0;

    return (
        <>
            <div className="block md:hidden w-full bg-white text-gray-800 rounded-t-4xl overflow-hidden relative shadow-md">
                <div
                    className="w-full bg-cover bg-center rounded-t-4xl"
                    style={{ backgroundImage: `url(${product.picture})` }}
                >
                    <div className="w-full h-full bg-white/80 backdrop-blur-sm rounded-t-4xl">
                        <div className="relative z-10 flex flex-col items-center pt-6 px-4 pb-6">

                            <button
                                onClick={() => {
                                    setShowFullImage(true);
                                }}
                                className="hover:ring-4 hover:ring-pink-500/30 transition-all rounded-full"
                            >
                                <img
                                    src={product.picture}
                                    alt={product.name}
                                    className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
                                />
                            </button>

                            <h1 className="mt-4 text-2xl font-semibold text-center">{product.name}</h1>
                            <p className="text-gray-600 text-sm text-center">
                                @{product.alias}
                            </p>

                            {product.details?.badges && product.details.badges.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-2 mt-2">
                                    {product.details.badges.map((badge, index) => (
                                        <Badge key={index} text={badge.text} color={badge.color} />
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-wrap justify-center gap-3 mt-4">
                                {hasNoOwners && (
                                    <BadgeWithIcon
                                        text="НОВАЯ ПЕРСОНА"
                                        backgroundColor="bg-amber-400"
                                        icon={<FontAwesomeIcon icon={faLemon} className="w-3 h-3" />}
                                        glow={true}
                                    />
                                )}
                                {hasExtras && (
                                    <BadgeWithIcon
                                        text="С ДОПОЛНИТЕЛЬНЫМИ АКСЕССУАРАМИ"
                                        backgroundColor="bg-indigo-500"
                                        icon={<FontAwesomeIcon icon={faGem} className="w-3 h-3" />}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden md:block relative h-[200px] w-full bg-cover bg-center rounded-t-4xl shadow-md"
                 style={{backgroundImage: `url(${product.picture})`}}>
                <div className="absolute backdrop-blur-sm rounded-t-4xl inset-0 bg-gradient-to-t bg-white/80 to-transparent flex items-end px-8 pb-6">
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex gap-4">
                        {hasNoOwners && (
                            <BadgeWithIcon
                                text="НОВАЯ ПЕРСОНА"
                                backgroundColor="bg-amber-400"
                                icon={<FontAwesomeIcon icon={faLemon} className="w-3 h-3" />}
                                glow={true}
                            />
                        )}
                        {hasExtras &&
                            <BadgeWithIcon text="С ДОПОЛНИТЕЛЬНЫМИ АКСЕССУАРАМИ" backgroundColor="bg-indigo-500"
                                           icon={<FontAwesomeIcon icon={faGem} className="w-3 h-3" />}/>
                        }
                    </div>

                    <div className="flex items-end gap-6 w-full">
                        <div className="">
                            <button
                                onClick={() => {
                                    setShowFullImage(true);
                                }}
                                className="cursor-pointer hover:ring-4 hover:ring-pink-500/30 transition-all rounded-full"
                            >
                                <img
                                    src={product.picture}
                                    alt={product.name}
                                    className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-xl"
                                />
                            </button>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
                                    <p className="text-gray-600 text-sm mt-1">@{product.alias}</p>
                                    <div className="flex gap-2 mt-2">
                                        {product.details?.badges && product.details.badges.map((badge, index) => (
                                            <Badge key={index} text={badge.text} color={badge.color}/>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            { showFullImage &&
                <PictureModal pictureUrl={product.picture} onClose={() => setShowFullImage(false)} />
            }
        </>
    );
};

export default Header;