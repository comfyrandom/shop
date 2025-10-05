import type {AccountForComment} from "../../pages/RevelationsPage.tsx";

export interface AccountPickerPopupProps {
    accounts: AccountForComment[],
    header: string,
    selectedAccount: AccountForComment | null,
    onAccountSelect: (account:AccountForComment) => void,
    onCancel: () => void
}

const AccountPickerPopup = ({
                                accounts,
                                header,
                                selectedAccount,
                                onAccountSelect,
                                onCancel
                            }: AccountPickerPopupProps) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-fade-in">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Выберите аккаунт</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {header}
                    </p>
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {accounts.map((account) => (
                        <button
                            key={account.id}
                            onClick={() => onAccountSelect(account)}
                            className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
                                selectedAccount?.id === account.id ? 'bg-purple-50 border-r-4 border-purple-500' : ''
                            }`}
                        >
                            <img
                                src={account.picture}
                                alt={account.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                            />
                            <div className="flex-1 text-left">
                                <div className="font-medium text-gray-900">{account.name}</div>
                                <div className="text-sm text-gray-500">@{account.alias}</div>
                            </div>
                            {selectedAccount?.id === account.id && (
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={() => onCancel()}
                        className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountPickerPopup;