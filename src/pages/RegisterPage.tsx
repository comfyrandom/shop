import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faKey, faIdCard, faCheckCircle, faEye, faEyeSlash, faAt } from '@fortawesome/free-solid-svg-icons';
import {createUser} from "../services/users.service.ts";
import {Link} from "react-router-dom";
import {toast, type ToastOptions} from "react-toastify";
import {useAuth} from "../hooks/useAuth.ts";
import {LoadingCard, WarningCard} from "../components/common/StatusCards.tsx";

const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true
};

interface FormData {
    username: string;
    userid: string;
    email: string;
    password: string;
    confirmPassword: string;
    inviteCode: string;
}

interface FormErrors {
    username?: string;
    userid?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    inviteCode?: string;
}

const RegisterPage = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        userid: '',
        email: '',
        password: '',
        confirmPassword: '',
        inviteCode: ''
    });

    const { user, initialized } = useAuth();
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Имя пользователя обязательно';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Имя пользователя должно быть не менее 3 символов';
        }

        if (!formData.userid.trim()) {
            newErrors.userid = 'Идентификатор пользователя обязателен';
        } else if (!/^[a-z.]+$/.test(formData.userid)) {
            newErrors.userid = 'Идентификатор может содержать только латинские буквы в нижнем регистре и точки';
        } else if (formData.userid.length < 3) {
            newErrors.userid = 'Идентификатор должен быть не менее 3 символов';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email обязателен';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Введите корректный email';
        }

        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        if (!formData.inviteCode.trim()) {
            newErrors.inviteCode = 'Инвайт-код обязателен';
        } else if (formData.inviteCode.length < 8) {
            newErrors.inviteCode = 'Инвайт-код должен быть не менее 8 символов';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'userid' ? value.toLowerCase() : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        const result = await createUser(
            formData.username,
            formData.email,
            formData.password,
            formData.userid,
            formData.inviteCode
        );

        if (result.status) {
            setIsSuccess(true);
        } else {
            toast.error('Не удалось зарегистрировать нового пользователя. Проверьте инвайт-код и адрес электронной почты.', toastOptions);
            setIsSubmitting(false);
            setIsSuccess(false);
        }
    };

    if (!initialized)
        return <LoadingCard message="Загрузка..." />;

    if (user) {
        return <WarningCard header={"Ошибка"} description={"Регистрация недоступна уже зарегистрированным пользователям"} />
    }

    if (isSuccess) {
        return (
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-5xl mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Регистрация успешна!</h2>
                    <p className="text-gray-600 mb-6">
                        На вашу почту <span className="font-semibold">{formData.email}</span> было отправлено письмо с подтверждением.
                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800 mb-6 text-left">
                        <p className="text-sm">
                            <strong>Подтвердите email:</strong> Пожалуйста, проверьте вашу почту и перейдите по ссылке в письме, чтобы завершить регистрацию.
                        </p>
                    </div>

                    <Link to={'/'}>
                        <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Вернуться на главную страницу
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 bg-clip-text bg-gradient-to-r">
                Регистрация
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Имя пользователя
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`pl-10 w-full p-2 border rounded-md ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Ваше имя"
                        />
                    </div>
                    {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                </div>

                <div>
                    <label htmlFor="userid" className="block text-sm font-medium text-gray-700 mb-1">
                        Идентификатор пользователя
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faAt} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="userid"
                            name="userid"
                            value={formData.userid}
                            onChange={handleChange}
                            className={`pl-10 w-full p-2 border rounded-md ${errors.userid ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="your.id (только латинские буквы и точки)"
                        />
                    </div>
                    {errors.userid && <p className="mt-1 text-sm text-red-600">{errors.userid}</p>}
                    <p className="mt-1 text-xs text-gray-500">
                        Используется как основной идентификатор. Можно изменить только через поддержку.
                    </p>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                        </div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`pl-10 w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="your@email.com"
                        />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Пароль
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`pl-10 pr-10 w-full p-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Не менее 6 символов"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-gray-400 hover:text-gray-600" />
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Подтверждение пароля
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                        </div>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`pl-10 pr-10 w-full p-2 border rounded-md ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Повторите пароль"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="text-gray-400 hover:text-gray-600" />
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>

                <div>
                    <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Инвайт-код
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faKey} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="inviteCode"
                            name="inviteCode"
                            value={formData.inviteCode}
                            onChange={handleChange}
                            className={`pl-10 w-full p-2 border rounded-md ${errors.inviteCode ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Введите ваш инвайт-код"
                        />
                    </div>
                    {errors.inviteCode && <p className="mt-1 text-sm text-red-600">{errors.inviteCode}</p>}
                    <p className="mt-1 text-xs text-gray-500">
                        Для регистрации требуется действующий инвайт-код
                    </p>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </div>
            </form>

            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-800 flex items-start">
                <FontAwesomeIcon icon={faIdCard} className="text-yellow-500 mt-1 mr-3" />
                <div className="text-sm">
                    <strong>Важно:</strong> Регистрация доступна только по инвайт-кодам.
                    Если у вас нет кода, обратитесь к администратору сообщества.
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;