import React, { useState } from 'react';
import {createProduct, type ProductCreation} from "../services/products.service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFileImport, faSave} from '@fortawesome/free-solid-svg-icons';
import {ErrorCard, LoadingCard, WarningCard} from "../components/common/StatusCards";
import BasicEditor from "../components/product-editor/BasicEditor.tsx";
import SectionCard from "../components/product-editor/SectionCard.tsx";
import DetailsEditor from "../components/product-editor/DetailsEditor.tsx";
import ArrayEditor from "../components/product-editor/ArrayEditor.tsx";
import KinkEditor from "../components/product-editor/KinkEditor.tsx";
import ScenarioEditor from "../components/product-editor/ScenarioEditor.tsx";
import ExtraEditor from "../components/product-editor/ExtraEditor.tsx";
import HistoryEditor from "../components/product-editor/HistoryEditor.tsx";
import RelationshipEditor from "../components/product-editor/RelationshipEditor.tsx";
import BadgeEditor from "../components/product-editor/BadgeEditor.tsx";
import FeatureEditor from "../components/product-editor/FeatureEditor.tsx";
import AccessoryEditor from "../components/product-editor/AccessoryEditor.tsx";
import { toast, type ToastOptions } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../hooks/useAuth.ts";

const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true
};

const initialProductState : ProductCreation = {
    alias: '',
    picture: '',
    name: '',
    description: '',
    details: {
        sexual_preference: '',
        ethnicity: '',
        max_wear: '',
        background: '',
        biometry: '',
        condition: '',
        pussy: '',
        age: 0,
        height: 0,
        weight: 0,
        appearance: [],
        personality: [],
        kinks: [],
        scenarios: [],
        extras: [],
        history: [],
        relationships: [],
        badges: [],
        features: [],
        accessories: []
    }
};

const CreateProductPage = () => {

    const { user, initialized } = useAuth();
    const [product, setProduct] = useState<ProductCreation>(initialProductState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showImportModal, setShowImportModal] = useState(false);
    const [jsonInput, setJsonInput] = useState('');
    const [jsonError, setJsonError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleImportJson = () => {
        try {
            setJsonError(null);
            const importedProduct = JSON.parse(jsonInput);

            if (typeof importedProduct !== 'object' || importedProduct === null) {
                throw new Error('Invalid JSON structure');
            }

            const newProduct: ProductCreation = {
                ...initialProductState,
                ...importedProduct,
                details: {
                    ...initialProductState.details,
                    ...(importedProduct.details || {})
                }
            };

            setProduct(newProduct);
            setShowImportModal(false);
            toast.success("Продукт успешно импортирован", toastOptions);
        } catch (err) {
            setJsonError('Неверный формат JSON. Пожалуйста, проверьте данные.');
            console.error('JSON import error:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name in product) {
            setProduct({
                ...product,
                [name]: value
            });
        } else if (name.startsWith('details.')) {
            const detailField = name.split('.')[1];
            setProduct({
                ...product,
                details: {
                    ...product.details,
                    [detailField]: value
                }
            });
        }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value);

        if (name in product) {
            setProduct({
                ...product,
                [name]: numValue
            });
        } else if (name.startsWith('details.')) {
            const detailField = name.split('.')[1];
            setProduct({
                ...product,
                details: {
                    ...product.details,
                    [detailField]: numValue
                }
            });
        }
    };

    const handleAddArrayItem = (arrayName: string, defaultValue = '') => {
        setProduct({
            ...product,
            details: {
                ...product.details,
                //@ts-expect-error: Приведение типов будет работать нормально
                [arrayName]: [...(product.details[arrayName] || []), defaultValue]
            }
        });
    };

    const handleRemoveArrayItem = (arrayName: string, index: number) => {
        //@ts-expect-error: Приведение типов будет работать нормально
        if (!product.details[arrayName]) return;

        //@ts-expect-error: Приведение типов будет работать нормально
        const updatedArray = [...product.details[arrayName]];
        updatedArray.splice(index, 1);

        setProduct({
            ...product,
            details: {
                ...product.details,
                [arrayName]: updatedArray.length > 0 ? updatedArray : undefined
            }
        });
    };

    const handleArrayItemChange = (arrayName: string, index: number, value: string) => {
        //@ts-expect-error: Приведение типов будет работать нормально
        if (!product.details[arrayName]) return;

        //@ts-expect-error: Приведение типов будет работать нормально
        const updatedArray = [...product.details[arrayName]];
        updatedArray[index] = value;

        setProduct({
            ...product,
            details: {
                ...product.details,
                [arrayName]: updatedArray
            }
        });
    };

    const handleKinksChange = (index: number, field: string, value: string) => {
        if (!product.details.kinks) return;

        const updatedKinks = [...product.details.kinks];
        updatedKinks[index] = {
            ...updatedKinks[index],
            [field]: value
        };

        setProduct({
            ...product,
            details: {
                ...product.details,
                kinks: updatedKinks
            }
        });
    };

    const handleAddKink = () => {
        setProduct({
            ...product,
            details: {
                ...product.details,
                kinks: [...(product.details.kinks || []), { text: '', color: '#3b82f6' }]
            }
        });
    };

    const handleRemoveKink = (index: number) => {
        if (!product.details.kinks) return;

        const updatedKinks = [...product.details.kinks];
        updatedKinks.splice(index, 1);

        setProduct({
            ...product,
            details: {
                ...product.details,
                //@ts-expect-error: Приведение типов пройдет нормально
                kinks: updatedKinks.length > 0 ? updatedKinks : undefined
            }
        });
    };

    const handleScenarioChange = (index: number, field: string, value: string) => {
        if (!product.details.scenarios) return;

        const updatedScenarios = [...product.details.scenarios];
        updatedScenarios[index] = {
            ...updatedScenarios[index],
            [field]: value
        };

        setProduct({
            ...product,
            details: {
                ...product.details,
                scenarios: updatedScenarios
            }
        });
    };

    const handleAddScenario = () => {
        setProduct({
            ...product,
            details: {
                ...product.details,
                scenarios: [...(product.details.scenarios || []), { title: '', description: '' }]
            }
        });
    };

    const handleRemoveScenario = (index: number) => {
        if (!product.details.scenarios) return;

        const updatedScenarios = [...product.details.scenarios];
        updatedScenarios.splice(index, 1);

        setProduct({
            ...product,
            details: {
                ...product.details,
                //@ts-expect-error: Приведение типов пройдет нормально
                scenarios: updatedScenarios.length > 0 ? updatedScenarios : undefined
            }
        });
    };

    const handleExtraChange = (index: number, field: string, value: string | boolean) => {
        if (!product.details.extras) return;

        const updatedExtras = [...product.details.extras];
        updatedExtras[index] = {
            ...updatedExtras[index],
            [field]: value
        };

        setProduct({
            ...product,
            details: {
                ...product.details,
                extras: updatedExtras
            }
        });
    };

    const handleAddExtra = () => {
        setProduct({
            ...product,
            details: {
                ...product.details,
                extras: [...(product.details.extras || []), {
                    name: '',
                    description: '',
                    value: '',
                    exclusive: false
                }]
            }
        });
    };

    const handleRemoveExtra = (index: number) => {
        if (!product.details.extras) return;

        const updatedExtras = [...product.details.extras];
        updatedExtras.splice(index, 1);

        setProduct({
            ...product,
            details: {
                ...product.details,
                //@ts-expect-error: Приведение типов пройдет нормально
                extras: updatedExtras.length > 0 ? updatedExtras : undefined
            }
        });
    };

    const handleHistoryChange = (index: number, field: string, value: string) => {
        if (!product.details.history) return;

        const updatedHistory = [...product.details.history];
        updatedHistory[index] = {
            ...updatedHistory[index],
            [field]: value
        };

        setProduct({
            ...product,
            details: {
                ...product.details,
                history: updatedHistory
            }
        });
    };

    const handleAddHistory = () => {
        setProduct({
            ...product,
            details: {
                ...product.details,
                history: [...(product.details.history || []), {
                    date: '',
                    title: '',
                    description: ''
                }]
            }
        });
    };

    const handleRemoveHistory = (index: number) => {
        if (!product.details.history) return;

        const updatedHistory = [...product.details.history];
        updatedHistory.splice(index, 1);

        setProduct({
            ...product,
            details: {
                ...product.details,
                //@ts-expect-error: Приведение типов пройдет нормально
                history: updatedHistory.length > 0 ? updatedHistory : undefined
            }
        });
    };

    const handleRelationshipChange = (index: number, field: string, value: string) => {
        if (!product.details.relationships) return;

        const updatedRelationships = [...product.details.relationships];
        updatedRelationships[index] = {
            ...updatedRelationships[index],
            [field]: value
        };

        setProduct({
            ...product,
            details: {
                ...product.details,
                relationships: updatedRelationships
            }
        });
    };

    const handleAddRelationship = () => {
        setProduct({
            ...product,
            details: {
                ...product.details,
                relationships: [...(product.details.relationships || []), {
                    name: '',
                    relation: '',
                    status: ''
                }]
            }
        });
    };

    const handleRemoveRelationship = (index: number) => {
        if (!product.details.relationships) return;

        const updatedRelationships = [...product.details.relationships];
        updatedRelationships.splice(index, 1);

        setProduct({
            ...product,
            details: {
                ...product.details,
                //@ts-expect-error: Приведение типов пройдет нормально
                relationships: updatedRelationships.length > 0 ? updatedRelationships : undefined
            }
        });
    };

    const handleBadgeChange = (index: number, field: string, value: string) => {
        if (!product.details.badges) return;

        const updatedBadges = [...product.details.badges];
        updatedBadges[index] = {
            ...updatedBadges[index],
            [field]: value
        };

        setProduct({
            ...product,
            details: {
                ...product.details,
                badges: updatedBadges
            }
        });
    };

    const handleAddBadge = () => {
        setProduct({
            ...product,
            details: {
                ...product.details,
                badges: [...(product.details.badges || []), {
                    text: '',
                    color: '#3b82f6'
                }]
            }
        });
    };

    const handleRemoveBadge = (index: number) => {
        if (!product.details.badges) return;

        const updatedBadges = [...product.details.badges];
        updatedBadges.splice(index, 1);

        setProduct({
            ...product,
            details: {
                ...product.details,
                //@ts-expect-error: Приведение типов пройдет нормально
                badges: updatedBadges.length > 0 ? updatedBadges : undefined
            }
        });
    };

    const handleFeatureChange = (index: number, field: string, value: string) => {
        if (!product.details.features) return;

        const updatedFeatures = [...product.details.features];
        updatedFeatures[index] = {
            ...updatedFeatures[index],
            [field]: value
        };

        setProduct({
            ...product,
            details: {
                ...product.details,
                features: updatedFeatures
            }
        });
    };

    const handleAddFeature = () => {
        setProduct({
            ...product,
            details: {
                ...product.details,
                features: [...(product.details.features || []), {
                    title: '',
                    description: ''
                }]
            }
        });
    };

    const handleRemoveFeature = (index: number) => {
        if (!product.details.features) return;

        const updatedFeatures = [...product.details.features];
        updatedFeatures.splice(index, 1);

        setProduct({
            ...product,
            details: {
                ...product.details,
                //@ts-expect-error: Приведение типов пройдет нормально
                features: updatedFeatures.length > 0 ? updatedFeatures : undefined
            }
        });
    };

    const handleAccessoryChange = (index: number, field: string, value: string | boolean) => {
        if (!product.details.accessories) return;

        const updatedAccessories = [...product.details.accessories];
        updatedAccessories[index] = {
            ...updatedAccessories[index],
            [field]: value
        };

        setProduct({
            ...product,
            details: {
                ...product.details,
                accessories: updatedAccessories
            }
        });
    };

    const handleAddAccessory = () => {
        setProduct({
            ...product,
            details: {
                ...product.details,
                accessories: [...(product.details.accessories || []), {
                    name: '',
                    type: '',
                    description: '',
                    price: '',
                    included: false
                }]
            }
        });
    };

    const handleRemoveAccessory = (index: number) => {
        if (!product.details.accessories) return;

        const updatedAccessories = [...product.details.accessories];
        updatedAccessories.splice(index, 1);

        setProduct({
            ...product,
            details: {
                ...product.details,
                //@ts-expect-error: Приведение типов пройдет нормально
                accessories: updatedAccessories.length > 0 ? updatedAccessories : undefined
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!user) {
                setError('Создание продуктов недоступно неавторизованным пользователям');
                return;
            }

            const productToCreate = {
                ...product,
                owner_id: user.id
            };

            const createdProduct = await createProduct(productToCreate);

            if (createdProduct) {
                toast.success("Продукт успешно создан", toastOptions);
                navigate(`/product/${createdProduct}`);
            } else {
                toast.error("Не удалось создать продукт", toastOptions);
            }
        } catch (err) {
            setError('Произошла ошибка при создании продукта');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!initialized || loading)
        return <LoadingCard message="Загрузка создания шкуры..." />;

    if (!user) {
        return <WarningCard header={"Ошибка авторизации"} description={"Создание шкур недоступно неавторизованным пользователям"} />
    }

    if (error)
        return <ErrorCard error={error} onRetry={() => window.location.reload()} />;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">
                    Создание нового продукта
                </h2>
                <button
                    type="button"
                    onClick={() => setShowImportModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                    <FontAwesomeIcon icon={faFileImport} className="mr-2" />
                    Импорт из JSON
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <SectionCard title="Основная информация" description="Основные данные о продукте">
                    <BasicEditor
                        product={product}
                        onChange={handleChange}
                    />
                </SectionCard>

                <SectionCard title="Детали продукта" description="Технические характеристики и параметры">
                    <DetailsEditor
                        details={product.details}
                        onChange={handleChange}
                        onNumberChange={handleNumberChange}
                    />
                </SectionCard>

                <SectionCard title="Внешность" description="Особенности внешности">
                    <ArrayEditor
                        arrayName="appearance"
                        placeholder="Введите особенность внешности"
                        values={product.details.appearance || []}
                        onAdd={handleAddArrayItem}
                        onRemove={handleRemoveArrayItem}
                        onChange={handleArrayItemChange}
                    />
                </SectionCard>

                <SectionCard title="Личность" description="Черты характера">
                    <ArrayEditor
                        arrayName="personality"
                        placeholder="Введите черту характера"
                        values={product.details.personality || []}
                        onAdd={handleAddArrayItem}
                        onRemove={handleRemoveArrayItem}
                        onChange={handleArrayItemChange}
                    />
                </SectionCard>

                <SectionCard title="Фетиши" description="Предпочтения и фетиши">
                    <KinkEditor
                        kinks={product.details.kinks || []}
                        onAdd={handleAddKink}
                        onRemove={handleRemoveKink}
                        onChange={handleKinksChange}
                    />
                </SectionCard>

                <SectionCard title="Сценарии" description="Возможные сценарии использования">
                    <ScenarioEditor
                        scenarios={product.details.scenarios || []}
                        onAdd={handleAddScenario}
                        onRemove={handleRemoveScenario}
                        onChange={handleScenarioChange}
                    />
                </SectionCard>

                <SectionCard title="В комплекте" description="Собственность/связи/любые другие ценности">
                    <ExtraEditor
                        extras={product.details.extras || []}
                        onAdd={handleAddExtra}
                        onRemove={handleRemoveExtra}
                        onChange={handleExtraChange}
                    />
                </SectionCard>

                <SectionCard title="История" description="История человека до превращения в шкуру и после">
                    <HistoryEditor
                        history={product.details.history || []}
                        onAdd={handleAddHistory}
                        onRemove={handleRemoveHistory}
                        onChange={handleHistoryChange}
                    />
                </SectionCard>

                <SectionCard title="Отношения" description="Самые важные отношения и их описание">
                    <RelationshipEditor
                        relationships={product.details.relationships || []}
                        onAdd={handleAddRelationship}
                        onRemove={handleRemoveRelationship}
                        onChange={handleRelationshipChange}
                    />
                </SectionCard>

                <SectionCard title="Бейджи" description="Значки и метки продукта">
                    <BadgeEditor
                        badges={product.details.badges || []}
                        onAdd={handleAddBadge}
                        onRemove={handleRemoveBadge}
                        onChange={handleBadgeChange}
                    />
                </SectionCard>

                <SectionCard title="Особенности" description="Дополнительные особенности">
                    <FeatureEditor
                        features={product.details.features || []}
                        onAdd={handleAddFeature}
                        onRemove={handleRemoveFeature}
                        onChange={handleFeatureChange}
                    />
                </SectionCard>

                <SectionCard title="Аксесуары" description="Дополнительные аксесуары">
                    <AccessoryEditor
                        accessories={product.details.accessories || []}
                        onAdd={handleAddAccessory}
                        onRemove={handleRemoveAccessory}
                        onChange={handleAccessoryChange}
                    />
                </SectionCard>

                {showImportModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                            <h3 className="text-xl font-bold mb-4">Импорт из JSON</h3>
                            <textarea
                                className="w-full h-64 p-2 border border-gray-300 rounded mb-4 font-mono text-sm"
                                placeholder="Вставьте JSON с данными продукта..."
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                            />
                            {jsonError && <p className="text-red-500 mb-4">{jsonError}</p>}
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowImportModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={handleImportJson}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Импортировать
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        disabled={loading}
                    >
                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                        {loading ? 'Создание...' : 'Создать продукт'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProductPage;