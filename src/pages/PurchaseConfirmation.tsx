import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faReceipt,
    faCheckCircle,
    faTimesCircle,
    faAt,
    faWallet,
    faCoins,
    faUser,
    faIdCard
} from '@fortawesome/free-solid-svg-icons';
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {Product, ProductDetails} from "../types/product.ts";
import {getProductByAlias, getProductById, purchaseProduct} from "../services/products.service.ts";
import {ErrorCard, LoadingCard, WarningCard} from "../components/common/StatusCards.tsx";
import {useAuth} from "../hooks/useAuth.ts";
import {getUserBalance} from "../services/users.service.ts";
import {toast, type ToastOptions} from "react-toastify";

const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true
};

const PurchaseConfirmation = () => {
    const { user, initialized, essentials } = useAuth();
    const { productAlias } = useParams<{ productAlias: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product & ProductDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [balance, setBalance] = useState(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [transactionId, setTransactionId] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setError(null);

                if (!user) {
                    return;
                }

                const userBalance = await getUserBalance(user.id);
                setBalance(userBalance ?? 0);

                if (productAlias == undefined) {
                    setError("Не удалось загрузить данные о продукте");
                    setLoading(false);
                    return;
                }

                let result;

                if (/^\d/.test(productAlias || '')) {
                    result = await getProductById(Number(productAlias));
                } else {
                    result = await getProductByAlias(productAlias);
                }

                if (result === undefined) {
                    setError("Не удалось загрузить данные о продукте");
                    setLoading(false);
                    return;
                }

                setProduct(result);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Не удалось загрузить данные о продукте");
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productAlias, user?.id]);

    if (!initialized || loading) return <LoadingCard message="Загружаем товар..." />;
    if (error) return <ErrorCard error={error} onRetry={() => window.location.reload()} />;

    if (!user) return <WarningCard
        header="Вы не авторизованы"
        description="Чтобы приобрести товар, зарегистрируйтесь или войдите в свой аккаунт на сайте."
        onRetry={() => window.location.reload()}
    />;

    if (!product) return <WarningCard
        header="Не удалось загрузить товар"
        description="Похоже, что-то пошло не так. Пожалуйста, попробуйте позже."
        onRetry={() => window.location.reload()}
    />;

    if (product.status !== 'FOR_SALE') {
        return <WarningCard
            header="Невозможно купить товар"
            description="Данный товар не находится в продаже."
            onRetry={() => navigate(-1)}
        />
    }

    if (product.owner_id === user.id) {
        return <WarningCard
            header="Невозможно купить собственный товар"
            description="Вы являетесь владельцем данного товара."
            onRetry={() => navigate(-1)}
        />
    }

    const remainingBalance = balance - product.price;

    const handleConfirm = async () => {
        const result = await purchaseProduct(product.id, product.price);

        if (result.success) {
            setTransactionId(result.transaction_id!);
            setShowSuccessModal(true);
        } else {
            toast.error("Не удалось завершить покупку. Пожалуйста, попробуйте позже", toastOptions);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        navigate(`/user/${essentials!.alias}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white text-center">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-5xl mb-4" />
                            <h3 className="text-2xl font-bold">Покупка завершена успешно!</h3>
                        </div>
                        <div className="p-6 text-center">
                            <p className="text-gray-700 mb-6">
                                Шкура <span className="font-semibold">{product.name}</span> успешно приобретена и добавлена в ваш профиль.
                            </p>
                            <div className="flex justify-center">
                                <button
                                    onClick={handleSuccessModalClose}
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                                >
                                    Перейти в профиль
                                </button>
                            </div>
                        </div>
                        <div className="bg-gray-100 px-6 py-4 text-center text-sm text-gray-500">
                            Номер операции: {transactionId}
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
                        <div className="flex items-center justify-center space-x-3">
                            <FontAwesomeIcon icon={faReceipt} className="text-3xl" />
                            <h2 className="text-2xl font-bold">Подтверждение покупки</h2>
                        </div>
                        <p className="text-center text-blue-100 mt-2">Пожалуйста, проверьте детали перед подтверждением</p>
                    </div>

                    {/* Product Info */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-shrink-0">
                                <img
                                    src={product.picture}
                                    alt={product.name}
                                    className="w-32 h-32 rounded-lg object-cover border-2 border-blue-100 shadow-sm"
                                />
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                                        <div className="flex items-center text-gray-500 mt-1">
                                            <FontAwesomeIcon icon={faAt} className="mr-1 text-sm" />
                                            <span className="text-sm">{product.alias}</span>
                                        </div>
                                    </div>
                                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                        #{product.id}
                                    </div>
                                </div>
                                <p className="text-gray-600 mt-3">{product.description}</p>

                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500">Продавец</p>
                                        <Link
                                            to={`/user/${product.owner_details.alias}`}
                                            className="font-medium text-blue-600 hover:text-blue-800 flex items-center"
                                        >
                                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                                            {product.owner_details.name}
                                        </Link>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500">Цена</p>
                                        <p className="font-bold text-blue-600 flex items-center">
                                            {product.price.toLocaleString()} ₽
                                            <FontAwesomeIcon icon={faCoins} className="ml-2" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Passport Data */}
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FontAwesomeIcon icon={faIdCard} className="mr-2 text-blue-500" />
                            Паспортные данные шкуры
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Фамилия</p>
                                <p className="font-medium">{product.passport_data.last_name ?? '-'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Имя</p>
                                <p className="font-medium">{product.passport_data.first_name ?? '-'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Отчество</p>
                                <p className="font-medium">{product.passport_data.middle_name ?? '-'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Идентификатор</p>
                                <p className="font-mono font-medium">{product.passport_data.passport_number}</p>
                            </div>
                        </div>
                    </div>

                    {/* Balance Info */}
                    <div className="p-6">
                        <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-5 rounded-xl border border-blue-100 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FontAwesomeIcon icon={faWallet} className="mr-2 text-blue-500" />
                                Финансовая информация
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <p className="text-sm text-gray-500">Текущий баланс</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">
                                        {balance.toLocaleString()} ₽
                                    </p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <p className="text-sm text-gray-500">Останется после покупки</p>
                                    <p className={`text-2xl font-bold mt-1 ${
                                        remainingBalance >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {remainingBalance.toLocaleString()} ₽
                                    </p>
                                </div>
                            </div>
                            {remainingBalance < 0 && (
                                <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm font-medium border border-red-100">
                                    Недостаточно средств для совершения покупки! Пожалуйста, пополните баланс.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
                        <button
                            onClick={handleCancel}
                            className="flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors border border-gray-300 shadow-sm mb-3 sm:mb-0 w-full sm:w-auto"
                        >
                            <FontAwesomeIcon icon={faTimesCircle} className="mr-2 text-gray-500" />
                            Отменить покупку
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={remainingBalance < 0}
                            className={`flex items-center justify-center px-6 py-3 font-medium rounded-lg transition-all ${
                                remainingBalance >= 0
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg'
                                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                            } w-full sm:w-auto`}
                        >
                            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                            Подтвердить покупку
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-100 px-6 py-4 text-center">
                        <p className="text-sm text-gray-500">
                            © РосШкур • {new Date().toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Спасибо за ваш выбор! Ваша покупка защищена нашей системой.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseConfirmation;