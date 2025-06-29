import React from 'react';

interface BasicEditorProps {
    product: {
        name: string;
        alias: string;
        picture?: string;
        description: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicEditor: React.FC<BasicEditorProps> = ({ product, onChange }) => {
    const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const cleanedValue = e.target.value
            .toLowerCase()
            .replace(/[^a-z.]/g, '');

        const syntheticEvent = {
            ...e,
            target: {
                ...e.target,
                name: e.target.name,
                value: cleanedValue
            }
        };

        onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                <input
                    type="text"
                    name="name"
                    required={true}
                    value={product.name}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Алиас</label>
                <input
                    type="text"
                    required={true}
                    name="alias"
                    value={product.alias}
                    onChange={handleAliasChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <p className="mt-1 text-xs text-gray-500">Только латинские буквы в нижнем регистре и точка</p>
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Ссылка на изображение
                </label>
                <input
                    type="text"
                    name="picture"
                    required={true}
                    value={product.picture || ''}
                    onChange={onChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                    name="description"
                    required={true}
                    value={product.description}
                    onChange={onChange}
                    rows={4}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
            </div>
        </div>
    );
};

export default BasicEditor;