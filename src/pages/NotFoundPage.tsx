import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGhost } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="max-w-2xl mx-auto px-4 py-20 min-h-screen flex flex-col items-center justify-center">
            <div className="text-center">
                <div className="mb-6 text-8xl text-gray-300">
                    <FontAwesomeIcon icon={faGhost} />
                </div>

                <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">
                    Потерялись?
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                    Кажется, вы свернули не туда
                </p>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>

                <p className="text-gray-500 mb-8">
                    В этом уголке цифрового пространства ничего нет.
                </p>

                <div className="flex justify-center gap-4">
                    <Link
                        to="/register"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Регистрация
                    </Link>
                    <Link
                        to="/login"
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Вход
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;