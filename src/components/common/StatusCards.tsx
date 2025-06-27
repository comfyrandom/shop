import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSpinner, faExclamationTriangle, faTriangleExclamation} from '@fortawesome/free-solid-svg-icons';

export const LoadingCard = ({ message = 'Загрузка данных...' }: { message?: string }) => (
    <div className="flex justify-center items-center py-10">
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 rounded-2xl shadow-xl w-full max-w-md border-2 border-blue-200 text-center">
            <FontAwesomeIcon
                icon={faSpinner}
                className="text-blue-500 text-5xl mb-4 animate-spin"
            />
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {message}
            </h2>
        </div>
    </div>
);

export const ErrorCard = ({error, onRetry}: { error: string, onRetry?: () => void
}) => (
    <div className="flex justify-center items-center mt-10">
        <div className="bg-gradient-to-br from-red-50 via-pink-50 to-amber-50 p-8 rounded-2xl shadow-xl w-full max-w-2xl border-2 border-red-200">
            <div className="flex flex-col items-center">
                <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="text-red-500 text-5xl mb-4 animate-bounce"
                />
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600 mb-3">
                    Произошла ошибка
                </h1>
                <p className="text-gray-700 text-lg mb-4">
                    {error}
                </p>
                <div className="bg-white/80 p-4 rounded-lg mb-6 w-full">
                    <p className="text-gray-600">
                        <span className="font-semibold text-red-500">Возможные причины:</span><br/>
                        • Проблемы с интернет-соединением<br/>
                        • Временные неполадки на сервере<br/>
                        • Ошибка авторизации<br/>
                        <span className="mt-2 inline-block text-sm text-gray-500">
                            Если проблема повторяется, свяжитесь с нашей поддержкой
                        </span>
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={onRetry}
                        className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-semibold py-3 px-8 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                        Попробовать снова
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 font-medium py-3 px-6 rounded-full transition-all shadow-sm hover:shadow-md"
                    >
                        Вернуться назад
                    </button>
                </div>
            </div>
        </div>
    </div>
);

interface WarningCardProps {
    header: string;
    description: string;
    onRetry?: () => void;
}

export const WarningCard = ({ header, description, onRetry }: WarningCardProps) => {
    return (
        <div className="flex justify-center items-center my-10">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl shadow-lg w-full max-w-md border-2 border-amber-200">
                <div className="flex flex-col items-center text-center space-y-4">
                    <FontAwesomeIcon
                        icon={faTriangleExclamation}
                        className="text-amber-500 text-4xl animate-pulse"
                    />

                    <h2 className="text-xl font-bold text-amber-700">
                        {header}
                    </h2>

                    <p className="text-gray-600">
                        {description}
                    </p>

                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="mt-2 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-medium py-2 px-6 rounded-full transition-all shadow hover:shadow-md"
                        >
                            Попробовать снова
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
