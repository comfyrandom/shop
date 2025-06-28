import React from 'react';

interface Extra {
    name: string;
    description: string;
    value: string;
    exclusive: boolean;
}

interface ExtraEditorProps {
    extras: Extra[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onChange: (index: number, field: string, value: string | boolean) => void;
}

const ExtraEditor: React.FC<ExtraEditorProps> = ({ extras = [], onAdd, onRemove, onChange }) => {
    return (
        <div className="space-y-4">
            {extras.map((extra, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700">Опция #{index + 1}</h4>
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="text-sm text-red-600 hover:text-red-800"
                        >
                            Удалить
                        </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                            <input
                                type="text"
                                value={extra.name}
                                onChange={(e) => onChange(index, 'name', e.target.value)}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Значение</label>
                            <input
                                type="text"
                                value={extra.value}
                                onChange={(e) => onChange(index, 'value', e.target.value)}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                            <textarea
                                value={extra.description}
                                onChange={(e) => onChange(index, 'description', e.target.value)}
                                rows={2}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={extra.exclusive}
                                    onChange={(e) => onChange(index, 'exclusive', e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">Эксклюзивная опция</span>
                            </label>
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={onAdd}
                className="mt-2 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-lg"
            >
                + Добавить опцию
            </button>
        </div>
    );
};

export default ExtraEditor;