import { useEffect, useState, useRef } from 'react'
import {
    type Contact,
    type DirectMessage,
    fetchContacts,
    fetchMessages,
    sendMessage
} from "../services/directMessages.service.ts"
import { broadcastService } from "../services/broadcast.service.ts"
import {Link, useNavigate, useParams} from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane, faUser, faCheck, faCheckDouble, faBars, faHome, faTimes, faBookmark, faPlus } from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "../hooks/useAuth.ts"
import { LoadingCard } from "../components/common/StatusCards.tsx"
import {getUserId} from "../services/users.service.ts"
import { ToastContainer, toast, type ToastOptions } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const getChannelName = (uid1: string, uid2: string): string => {
    const sortedIds = [uid1, uid2].sort();
    return `dm_${sortedIds[0]}_${sortedIds[1]}`;
};

const MAX_MESSAGE_LENGTH = 2048;
const MIN_TEXTAREA_HEIGHT = 48;
const MAX_TEXTAREA_HEIGHT = 200;

const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true
};

export const ChatComponent = () => {
    const navigate = useNavigate();
    const { user, initialized } = useAuth()
    const { userAlias } = useParams<{ userAlias: string }>()
    const [messages, setMessages] = useState<DirectMessage[]>([])
    const [contacts, setContacts] = useState<Contact[]>([])
    const [inputMessage, setInputMessage] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [showSidebar, setShowSidebar] = useState(false)
    const [showStartDialogModal, setShowStartDialogModal] = useState(false)
    const [newDialogAlias, setNewDialogAlias] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const currentSubscriptionId = useRef<string | null>(null)
    const sidebarRef = useRef<HTMLDivElement>(null)

    // Get current contact details
    const currentContact = contacts.find(contact => contact.contact_alias === userAlias);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setShowSidebar(false)
            }
        }

        if (showSidebar) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showSidebar])

    useEffect(() => {
        if (messagesContainerRef.current) {
            const container = messagesContainerRef.current
            const isNearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 100
            if (isNearBottom) {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }, [messages])

    useEffect(() => {
        const fetch = async() => {
            if (!user?.id) return;

            const contacts = await fetchContacts();
            if (contacts) setContacts(contacts);

            if (!userAlias) {
                setMessages([]);
                if (currentSubscriptionId.current) {
                    broadcastService.unsubscribe(currentSubscriptionId.current);
                    currentSubscriptionId.current = null;
                }
                return;
            }

            const otherUserId = await getUserId(userAlias);
            if (!otherUserId) {
                toast.error('Пользователь не найден', toastOptions);
                setMessages([]);
                return;
            }

            const messages = await fetchMessages(userAlias);
            if (messages) setMessages(messages);

            const channelName = getChannelName(user.id, otherUserId);
            const subscriptionId = `direct-messages-${channelName}`;

            if (currentSubscriptionId.current) {
                broadcastService.unsubscribe(currentSubscriptionId.current);
            }

            broadcastService.subscribe(subscriptionId, (message) => {
                if (message.eventType === 'INSERT') {
                    setMessages((prev) => [...prev, message.new as DirectMessage])
                } else if (message.eventType === 'UPDATE') {
                    setMessages((prev) => prev.map(msg =>
                        msg.id === message.new.id ? { ...msg, is_read: message.new.is_read } : msg
                    ))
                }
            })

            currentSubscriptionId.current = subscriptionId;

            return () => {
                if (currentSubscriptionId.current) {
                    broadcastService.unsubscribe(currentSubscriptionId.current);
                }
            }
        }

        fetch();
    }, [user?.id, userAlias])

    const handleSendMessage = async () => {
        if (!userAlias || !inputMessage.trim()) return

        setIsSending(true)
        try {
            await sendMessage(userAlias, inputMessage)
            setInputMessage('')
            resetTextareaHeight()
        } catch (error) {
            toast.error('Ошибка при отправке сообщения', toastOptions);
        } finally {
            setIsSending(false)
        }
    }

    const handleStartNewDialog = async () => {
        if (!newDialogAlias.trim()) return

        try {
            const userId = await getUserId(newDialogAlias)
            if (!userId) {
                toast.error('Пользователь не найден', toastOptions);
                return
            }

            navigate(`/messages/${newDialogAlias}`)
            setShowStartDialogModal(false)
            setNewDialogAlias('')
            toast.success('Диалог начат', toastOptions);
        } catch (error) {
            console.error('Error starting new dialog:', error)
            toast.error('Ошибка при создании диалога', toastOptions);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const resetTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = `${MIN_TEXTAREA_HEIGHT}px`
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
            setInputMessage(e.target.value)
            adjustTextareaHeight()
        }
    }

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            const newHeight = Math.min(
                Math.max(textareaRef.current.scrollHeight, MIN_TEXTAREA_HEIGHT),
                MAX_TEXTAREA_HEIGHT
            )
            textareaRef.current.style.height = `${newHeight}px`
        }
    }

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar)
    }

    if (!initialized) {
        return <LoadingCard message={"Загрузка чата"} />
    }

    if (!user) {
        return <div className="w-full h-screen flex items-center justify-center px-4 py-8">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Чат недоступен
                </h2>
                <p className="text-gray-600">
                    Для использования чата необходимо авторизоваться
                </p>
            </div>
        </div>
    }

    return (
        <div className="w-full h-screen flex bg-gray-50">
            {/* Toast container */}
            <ToastContainer />

            {/* Sidebar for contacts - hidden on mobile by default */}
            <div
                ref={sidebarRef}
                className={`bg-white border-r border-gray-200 w-64 flex-shrink-0 flex flex-col 
                    ${showSidebar ? 'fixed inset-y-0 left-0 z-50 md:relative md:flex' : 'hidden md:flex'}`}
            >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Контакты</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setShowStartDialogModal(true)}
                            className="p-1 rounded-full hover:bg-gray-100 text-blue-500"
                            title="Start new dialog"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                        <button
                            onClick={toggleSidebar}
                            className="md:hidden p-1 rounded-full hover:bg-gray-100"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {contacts.map(contact => {
                        const isSelfContact = contact.contact_id === user?.id;
                        const contactName = isSelfContact ? 'Избранное' : contact.contact_name;

                        return (
                            <div
                                key={contact.contact_id}
                                className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center
                ${userAlias === contact.contact_alias ? 'bg-blue-50' : ''}`}
                                onClick={() => {
                                    navigate(`/messages/${contact.contact_alias}`);
                                    setShowSidebar(false)
                                }}
                            >
                                {isSelfContact ? (
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                        <FontAwesomeIcon icon={faBookmark} className="text-blue-600" />
                                    </div>
                                ) : contact.contact_picture ? (
                                    <img
                                        src={contact.contact_picture}
                                        alt={contactName}
                                        className="w-10 h-10 rounded-full object-cover mr-3"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                                        <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium truncate">{contactName}</h3>
                                    <p className="text-xs text-gray-500 truncate">{contact.last_message_text}</p>
                                </div>
                                {contact.unread_messages_count > 0 && (
                                    <span className="ml-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {contact.unread_messages_count}
                </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main chat area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header with mobile menu button */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={toggleSidebar}
                            className="md:hidden mr-3 p-2 rounded-full hover:bg-gray-100"
                        >
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                        {userAlias ? (
                            <>
                                {currentContact?.contact_id === user?.id ? (
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                        <FontAwesomeIcon icon={faBookmark} className="text-blue-600" />
                                    </div>
                                ) : currentContact?.contact_picture ? (
                                    <img
                                        src={currentContact.contact_picture}
                                        alt={currentContact.contact_name}
                                        className="w-10 h-10 rounded-full object-cover mr-3"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                                        <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                                    </div>
                                )}
                                <h2 className="text-lg font-semibold text-gray-800">
                                    <Link to={`/user/${currentContact?.contact_alias}`}>
                                        {currentContact?.contact_id === user?.id ? 'Избранное' : `Чат с ${currentContact?.contact_name || `@${userAlias}`}`}
                                    </Link>
                                </h2>
                            </>
                        ) : (
                            <h2 className="text-lg font-semibold text-gray-800">
                                Выберите диалог
                            </h2>
                        )}
                    </div>
                    <Link
                        to="/"
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                        title="На главную"
                    >
                        <FontAwesomeIcon icon={faHome} />
                    </Link>
                </div>

                <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                    {!userAlias ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Выберите диалог из списка контактов или создайте новый</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Нет сообщений. Начните разговор!</p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.sender_id === user?.id
                                        ? 'bg-blue-500 text-white rounded-tr-none'
                                        : 'bg-white border border-gray-200 rounded-tl-none'}`}
                                >
                                    <p className="text-sm" style={{ whiteSpace: 'pre-line' }}>{message.text}</p>
                                    <div className={`flex items-center justify-end mt-1 space-x-1 ${message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'}`}>
                                        <span className="text-xs">
                                            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {message.sender_id === user?.id && (
                                            <span className="text-xs">
                                                {message.is_read ? (
                                                    <FontAwesomeIcon icon={faCheckDouble} className="text-blue-100" />
                                                ) : (
                                                    <FontAwesomeIcon icon={faCheck} className="text-blue-100 opacity-50" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="bg-white border-t border-gray-200 p-4">
                    <div className="flex items-end space-x-2">
                        <div className="flex-1 relative">
                            <textarea
                                ref={textareaRef}
                                value={inputMessage}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder={userAlias ? "Начните вводить сообщение..." : "Выберите диалог для отправки сообщения"}
                                className="w-full border border-gray-300 rounded-2xl px-4 py-2 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                style={{
                                    minHeight: `${MIN_TEXTAREA_HEIGHT}px`,
                                    maxHeight: `${MAX_TEXTAREA_HEIGHT}px`
                                }}
                                rows={1}
                                disabled={!userAlias}
                            />
                            {inputMessage.length > 0 && (
                                <span className="absolute bottom-3 right-3 text-xs text-gray-500">
                                    {inputMessage.length}/{MAX_MESSAGE_LENGTH}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isSending || !userAlias}
                            className={`p-3 rounded-full ${!inputMessage.trim() || isSending || !userAlias
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            style={{ width: '48px', height: '48px' }}
                        >
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Start Dialog Modal */}
            {showStartDialogModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Начать новый диалог</h2>
                        <div className="mb-4">
                            <label htmlFor="userAlias" className="block text-sm font-medium text-gray-700 mb-1">
                                Введите @имя.пользователя
                            </label>
                            <input
                                type="text"
                                id="userAlias"
                                value={newDialogAlias}
                                onChange={(e) => setNewDialogAlias(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="username"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => {
                                    setShowStartDialogModal(false)
                                    setNewDialogAlias('')
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleStartNewDialog}
                                disabled={!newDialogAlias.trim()}
                                className={`px-4 py-2 rounded-lg text-white ${!newDialogAlias.trim()
                                    ? 'bg-blue-300 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600'}`}
                            >
                                Начать диалог
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChatComponent