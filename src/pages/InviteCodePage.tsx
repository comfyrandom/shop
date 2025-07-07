import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faKey,
    faUserCheck,
    faPlus,
    faCopy,
    faTimes,
    faCheckCircle,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import {createInvite, getInvites, type Invite} from "../services/invites.service.ts";
import {Link} from "react-router-dom";
import {useAuth} from "../hooks/useAuth.ts";
import {LoadingCard, WarningCard} from "../components/common/StatusCards.tsx";

const InviteCodesPage = () => {
    const { user, initialized } = useAuth();
    const [inviteCodes, setInviteCodes] = useState<Invite[]>([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [newCode, setNewCode] = useState("");
    const [copied, setCopied] = useState(false);

    const handleCreateCode = async () => {
        const newInvite = await createInvite();

        if (newInvite === null) {
            throw new Error("Invite could not be created");
        }

        setInviteCodes([newInvite, ...inviteCodes]);
        setNewCode(newInvite.code);
        setModalOpen(true);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(newCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    useEffect(() => {
            const fetch = async () => {
                const result = await getInvites();
                setInviteCodes(result);
            }
            fetch();
        }
    )

    if (!initialized) {
        return <LoadingCard message={"Загрузка"}></LoadingCard>;
    }

    if (!user){
        return <WarningCard header={"Ошибка"} description={"Создание приглашений недоступно неавторизованным пользователям"} />
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
            <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 mb-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Панель инвайт-кодов
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Генерируйте одноразовые GUID-инвайты. Код можно использовать только один раз.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                    <div className="w-full sm:w-auto">
                        <button
                            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                            onClick={handleCreateCode}
                        >
                            <FontAwesomeIcon icon={faPlus}/>
                            <span>Новый инвайт-код</span>
                        </button>
                    </div>
                    <div className="text-sm text-gray-500 w-full sm:w-auto text-center sm:text-right">
                        Всего кодов: {inviteCodes.length} • Использовано: {inviteCodes.filter(c => c.used_by !== null).length}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center">
                        <FontAwesomeIcon icon={faKey} className="text-indigo-500 mr-3 text-lg"/>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Список инвайтов
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-3">Код</th>
                                <th className="px-6 py-3">Статус</th>
                                <th className="px-6 py-3">Пользователь</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {inviteCodes.map((code, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-mono text-sm text-gray-900 break-all">
                                            {code.code}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {code.used_by !== null ? (
                                            <span
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <FontAwesomeIcon icon={faUserCheck} className="mr-1.5"/>
                                                    Использован
                                                </span>
                                        ) : (
                                            <span
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    Не использован
                                                </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {code.used_by !== null ? (
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2"/>
                                                <Link to={`/user/${code.used_by.alias}`}>
                                                    <span className="text-gray-900">{code.used_by.name}</span>
                                                </Link>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div
                        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative transform transition-all">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                            <FontAwesomeIcon icon={faTimes} className="text-lg"/>
                        </button>
                        <div className="text-center mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                                Новый инвайт-код создан
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">
                                Скопируйте и поделитесь этим кодом
                            </p>
                        </div>
                        <div
                            className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between mt-4 mb-4 border border-gray-200">
                            <span className="font-mono text-gray-900 text-sm break-all select-all">
                                {newCode}
                            </span>
                            <button
                                onClick={copyToClipboard}
                                className="ml-4 p-2 text-indigo-600 hover:text-indigo-800 transition-colors rounded-md hover:bg-gray-100"
                                title="Скопировать"
                            >
                                <FontAwesomeIcon icon={faCopy} className="text-lg"/>
                            </button>
                        </div>
                        <button
                            onClick={() => setModalOpen(false)}
                            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            )}

            {/* Toast */}
            {copied && (
                <div
                    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-fade-in-up">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 text-xl"/>
                    <span className="font-medium">Код скопирован в буфер обмена</span>
                </div>
            )}
        </div>
    );
};

export default InviteCodesPage;