import React from 'react';

interface Feature {
    title: string;
    description: string;
}

interface FeatureEditorProps {
    features: Feature[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onChange: (index: number, field: string, value: string) => void;
}

const FeatureEditor: React.FC<FeatureEditorProps> = ({ features = [], onAdd, onRemove, onChange }) => {
    return (
        <div className="space-y-4">
            {features.map((feature, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700">Особенность #{index + 1}</h4>
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="text-sm text-red-600 hover:text-red-800"
                        >
                            Удалить
                        </button>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
                            <input
                                type="text"
                                value={feature.title}
                                onChange={(e) => onChange(index, 'title', e.target.value)}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                            <textarea
                                value={feature.description}
                                onChange={(e) => onChange(index, 'description', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={onAdd}
                className="mt-2 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-lg"
            >
                + Добавить особенность
            </button>
        </div>
    );
};

export default FeatureEditor;