import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Search = ({ placeholder = "Найти образ...", className = "", inputClassName = "w-32" }) => {
    return (
        <div className={`search-bar flex items-center bg-gray-100 rounded p-2 ${className}`}>
            <FontAwesomeIcon icon={faSearch} className="text-gray-700 mr-2" />
            <input
                type="text"
                placeholder={placeholder}
                className={`bg-transparent outline-none text-sm text-gray-800 ${inputClassName}`}
            />
        </div>
    );
};

export default Search;