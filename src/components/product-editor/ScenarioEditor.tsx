import React from 'react';

interface Scenario {
    title: string;
    description: string;
}

interface ScenarioEditorProps {
    scenarios: Scenario[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onChange: (index: number, field: string, value: string) => void;
}

const ScenarioEditor: React.FC<ScenarioEditorProps> = ({
                                                           scenarios = [],
                                                           onAdd,
                                                           onRemove,
                                                           onChange
                                                       }) => {
    return (
        <div className="space-y-6">
            {scenarios.map((scenario, index) => (
                <div key={index} className="space-y-3 border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-700">Сценарий #{index + 1}</h4>
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="text-sm text-red-600 hover:text-red-800"
                        >
                            Удалить
                        </button>
                    </div>
                    <div>
                        <input
                            type="text"
                            value={scenario.title}
                            onChange={(e) => onChange(index, 'title', e.target.value)}
                            placeholder="Название сценария"
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg mb-3"
                        />
                        <textarea
                            value={scenario.description}
                            onChange={(e) => onChange(index, 'description', e.target.value)}
                            placeholder="Описание сценария"
                            rows={3}
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={onAdd}
                className="mt-2 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-lg"
            >
                + Добавить сценарий
            </button>
        </div>
    );
};

export default ScenarioEditor;