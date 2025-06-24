import { Link } from 'react-router-dom';
import type {MouseEventHandler} from "react";

const NavLinks = ({ mobile = false, onLinkClick } : {mobile?: boolean, onLinkClick: MouseEventHandler<HTMLAnchorElement>}) => {
    const linkClassName = mobile
        ? "text-blue-700 hover:text-blue-500 text-base py-2"
        : "text-blue-700 hover:text-blue-500 text-base whitespace-nowrap";

    const links = [
        { path: "/", text: "Главная" },
        { path: "/products", text: "Образы" },
        { path: "/about", text: "О нас" },
        { path: "/contact", text: "Контакты" }
    ];

    return (
        <nav className={mobile ? "flex flex-col space-y-3" : "hidden lg:flex gap-6 ml-4"}>
            {links.map((link, index) => (
                <Link
                    key={index}
                    to={link.path}
                    className={linkClassName}
                    onClick={onLinkClick}
                >
                    {link.text}
                </Link>
            ))}
        </nav>
    );
};

export default NavLinks;