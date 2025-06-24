import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import type {MouseEventHandler} from "react";

const SideMenuButton = ({ isOpen, onClick } : {isOpen: boolean, onClick: MouseEventHandler<HTMLButtonElement>}) => (
    <button
        onClick={onClick}
        className="lg:hidden text-gray-800 focus:outline-none"
        aria-label="Toggle menu"
    >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-xl" />
    </button>
);

export default SideMenuButton;