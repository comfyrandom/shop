import React from 'react';

interface Relationship {
    name: string;
    relation: string;
    status?: string;
}

interface RelationshipEditorProps {
    relationships: Relationship[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onChange: (index: number, field: string, value: string) => void;
}

const RelationshipEditor: React.FC<RelationshipEditorProps> = ({relationships = [], onAdd, onRemove, onChange}) => {
    return (
        <div className="space-y-4">
            {relationships.map((relationship, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700">Отношение #{index + 1}</h4>
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="text-sm text-red-600 hover:text-red-800"
                        >
                            Удалить
                        </button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                            <input
                                type="text"
                                value={relationship.name}
                                onChange={(e) => onChange(index, 'name', e.target.value)}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Тип связи</label>
                            <input
                                type="text"
                                value={relationship.relation}
                                onChange={(e) => onChange(index, 'relation', e.target.value)}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                            <input
                                type="text"
                                value={relationship.status || ''}
                                onChange={(e) => onChange(index, 'status', e.target.value)}
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
                + Добавить отношение
            </button>
        </div>
    );
};

export default RelationshipEditor;