import { Link } from 'react-router-dom';
import type { MouseEventHandler } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faBook,
    faInfoCircle,
    faFire
} from '@fortawesome/free-solid-svg-icons';

const NavLinks = ({ mobile = false, onLinkClick } : {mobile?: boolean, onLinkClick: MouseEventHandler<HTMLAnchorElement>}) => {
    const linkClassName = mobile
        ? "text-blue-700 hover:text-blue-500 text-base py-2 flex items-center gap-2"
        : "text-blue-700 hover:text-blue-500 text-base whitespace-nowrap flex items-center gap-2";

    const specialLinkClassName = mobile
        ? "text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-base py-2 px-3 rounded-lg flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg"
        : "text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-base whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg";

    const links = [
        {
            path: "/",
            text: "Главная",
            icon: faHome
        },
        {
            path: "/catalog",
            text: "Каталог",
            icon: faBook
        },
        {
            path: "/revelations",
            text: "ОткровениЯ",
            icon: faFire,
            special: true
        },
        {
            path: "/about",
            text: "О нас",
            icon: faInfoCircle
        }
    ];

    return (
        <nav className={mobile ? "flex flex-col space-y-3" : "hidden lg:flex gap-4 ml-4 items-center"}>
            {links.map((link, index) => (
                <Link
                    key={index}
                    to={link.path}
                    className={link.special ? specialLinkClassName : linkClassName}
                    onClick={onLinkClick}
                >
                    <FontAwesomeIcon
                        icon={link.icon}
                        className={link.special ? "w-4 h-4" : "w-4 h-4"}
                    />
                    {link.text}
                </Link>
            ))}
        </nav>
    );
};

export default NavLinks;