import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faNewspaper,
    faRotateRight
} from '@fortawesome/free-solid-svg-icons';

interface EmptyStateCardProps {
    title: string;
    description: string;
    showRefreshButton?: boolean;
    onRefresh?: () => void;
}

export const EmptyStateCard = ({
                                   title,
                                   description,
                                   showRefreshButton = true,
                                   onRefresh = () => window.location.reload()
                               }: EmptyStateCardProps) => {
    return (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-200">
                <FontAwesomeIcon
                    icon={faNewspaper}
                    className="text-gray-400 text-xl"
                />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">{title}</h3>
            <p className="text-gray-500 max-w-md mx-auto">
                {description}
            </p>
            {showRefreshButton && (
                <div className="mt-6">
                    <button
                        onClick={onRefresh}
                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <FontAwesomeIcon
                            icon={faRotateRight}
                            className="mr-2 -ml-1 text-gray-500"
                        />
                        Обновить страницу
                    </button>
                </div>
            )}
        </div>
    );
};