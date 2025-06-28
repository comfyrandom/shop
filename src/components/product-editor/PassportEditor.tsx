import React from 'react';

interface PassportEditorProps {
    passportData: {
        last_name: string;
        first_name: string;
        middle_name: string;
        gender: string;
        date_of_birth: string;
        place_of_birth: string;
        passport_number: string;
        issue_date: string;
        issued_by: string;
        registration: string;
        biometric_id: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const PassportEditor: React.FC<PassportEditorProps> = ({ passportData, onChange }) => {

    console.log(passportData);

    return (
        <div className="grid md:grid-cols-2 gap-6">

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
                <input
                    type="text"
                    name="passport_data.last_name"
                    value={passportData.last_name}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                <input
                    type="text"
                    name="passport_data.first_name"
                    value={passportData.first_name ?? undefined}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
            </div>

            {/* Отчество */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Отчество</label>
                <input
                    type="text"
                    name="passport_data.middle_name"
                    value={passportData.middle_name ?? undefined}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
            </div>

            {/* Пол */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Пол</label>
                <select
                    name="passport_data.gender"
                    value={passportData.gender ?? undefined}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                    <option value="">Выберите пол</option>
                    <option value="Мужской">Мужской</option>
                    <option value="Женский">Женский</option>
                </select>
            </div>

            {/* Дата рождения */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата рождения</label>
                <input
                    type="date"
                    name="passport_data.date_of_birth"
                    value={passportData.date_of_birth ?? undefined}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
            </div>

            {/* Место рождения */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Место рождения</label>
                <input
                    type="text"
                    name="passport_data.place_of_birth"
                    value={passportData.place_of_birth ?? undefined}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
            </div>

            {/* Номер паспорта */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Номер паспорта</label>
                <input
                    type="text"
                    name="passport_data.passport_number"
                    required={true}
                    value={passportData.passport_number ?? undefined}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 text-sm border bg-gray-200 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
            </div>

            {/* Дата выдачи */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата выдачи</label>
                <input
                    type="date"
                    name="passport_data.issue_date"
                    value={passportData.issue_date ?? undefined}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
            </div>

            {/* Кем выдан */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Кем выдан</label>
                <input
                    type="text"
                    name="passport_data.issued_by"
                    value={passportData.issued_by ?? undefined}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
            </div>

            {/* Адрес регистрации */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Адрес регистрации</label>
                <textarea
                    name="passport_data.registration"
                    value={passportData.registration ?? undefined}
                    onChange={onChange}
                    rows={3}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
            </div>

            {/* Биометрический ID */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Биометрический ID</label>
                <input
                    readOnly
                    type="text"
                    name="passport_data.biometric_id"
                    value={passportData.biometric_id ?? undefined}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 text-sm border bg-gray-200 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
            </div>
        </div>
    );
};

export default PassportEditor;