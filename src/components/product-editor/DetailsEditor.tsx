import React from 'react';

interface DetailsEditorProps {
    details: {
        age?: number;
        ethnicity?: string;
        biometry?: string;
        max_wear?: string;
        condition?: string;
        background?: string;
        height?: number;
        weight?: number;
        pussy?: string;
        sexual_preference?: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DetailsEditor: React.FC<DetailsEditorProps> = ({details, onChange,onNumberChange }) => {
    return (
        <>
            <div className="mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">Детали продукта</h3>
                <p className="mt-1 text-gray-500 text-sm">Технические характеристики и параметры</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Возраст</label>
                    <input
                        type="number"
                        required={true}
                        name="details.age"
                        value={details.age || ''}
                        onChange={onNumberChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Этническая принадлежность</label>
                    <input
                        type="text"
                        required={true}
                        name="details.ethnicity"
                        value={details.ethnicity || ''}
                        onChange={onChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Процент совпадения биометрии</label>
                    <input
                        type="text"
                        required={true}
                        name="details.biometry"
                        value={details.biometry || ''}
                        onChange={onChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Максимальный срок носки</label>
                    <input
                        type="text"
                        required={true}
                        name="details.max_wear"
                        value={details.max_wear || ''}
                        onChange={onChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Состояние (от A+ до F)</label>
                    <input
                        type="text"
                        required={true}
                        name="details.condition"
                        value={details.condition || ''}
                        onChange={onChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Род деятельности</label>
                    <input
                        type="text"
                        required={true}
                        name="details.background"
                        value={details.background || ''}
                        onChange={onChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Рост (м)</label>
                    <input
                        type="number"
                        required={true}
                        name="details.height"
                        value={details.height || ''}
                        onChange={onNumberChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Вес (кг)</label>
                    <input
                        type="number"
                        required={true}
                        name="details.weight"
                        value={details.weight || ''}
                        onChange={onNumberChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Тип вагины</label>
                    <input
                        type="text"
                        name="details.pussy"
                        value={details.pussy || ''}
                        onChange={onChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Сексуальные предпочтения</label>
                    <input
                        type="text"
                        name="details.sexual_preference"
                        value={details.sexual_preference || ''}
                        onChange={onChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>
            </div>
        </>
    );
};

export default DetailsEditor;