import React from 'react';

interface Kink {
    text: string;
    color?: string;
}

interface KinkEditorProps {
    kinks: Kink[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onChange: (index: number, field: string, value: string) => void;
}

const KinkEditor: React.FC<KinkEditorProps> = ({ kinks = [], onAdd, onRemove, onChange }) => {
    return (
        <div className="space-y-4">
            {kinks.map((kink, index) => (
                <div key={index} className="flex items-start space-x-3">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                            <input
                                type="text"
                                value={kink.text}
                                onChange={(e) => onChange(index, 'text', e.target.value)}
                                placeholder="Название фетиша"
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="color"
                                value={kink.color || '#3b82f6'}
                                onChange={(e) => onChange(index, 'color', e.target.value)}
                                className="h-10 w-10 rounded border border-gray-300"
                            />
                            <input
                                type="text"
                                value={kink.color || '#3b82f6'}
                                onChange={(e) => onChange(index, 'color', e.target.value)}
                                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="px-3 py-2 text-sm text-red-600 hover:text-red-800"
                    >
                        Удалить
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={onAdd}
                className="mt-2 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-lg"
            >
                + Добавить фетиш
            </button>
        </div>
    );
};

export default KinkEditor;