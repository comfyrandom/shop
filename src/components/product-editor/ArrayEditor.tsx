import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

interface ArrayEditorProps {
    arrayName: string;
    placeholder?: string;
    values: string[];
    onAdd: (arrayName: string, defaultValue?: string) => void;
    onRemove: (arrayName: string, index: number) => void;
    onChange: (arrayName: string, index: number, value: string) => void;
}

const ArrayEditor: React.FC<ArrayEditorProps> = ({arrayName, placeholder = '', values = [], onAdd, onRemove, onChange}) => {
    return (
        <div className="space-y-3">
            {values.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={item}
                        onChange={(e) => onChange(arrayName, index, e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => onRemove(arrayName, index)}
                        className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={() => onAdd(arrayName)}
                className="mt-2 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-lg flex items-center space-x-2"
            >
                <FontAwesomeIcon icon={faPlus} size="xs" />
                <span>Добавить элемент</span>
            </button>
        </div>
    );
};

export default ArrayEditor;