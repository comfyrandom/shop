import React, { useState, useEffect } from 'react';
import type { Product, ProductDetails } from "../types/product";
import {getProductByAlias, updateProduct} from "../services/products.service";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFileExport, faSave} from '@fortawesome/free-solid-svg-icons';
import { ErrorCard, LoadingCard, WarningCard } from "../components/common/StatusCards";
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
import {toast, type ToastOptions} from "react-toastify";
import PassportEditor from "../components/product-editor/PassportEditor.tsx";
import {useAuth} from "../hooks/useAuth.ts";

const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true
};

const EditProductPage = () => {
    const { user, initialized } = useAuth();
    const { productAlias } = useParams<{ productAlias: string }>();
    const [product, setProduct] = useState<Product & ProductDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                if (user === null)
                    return;

                setLoading(true);

                if (!productAlias) {
                    setError('Идентификатор продукта не указан')
                    return;
                }

                const data = await getProductByAlias(productAlias);

                if (data === undefined)
                    return;

                if (data.owner_id !== user.id) {
                    setError('Вы не можете редактировать не принадлежащий вам продукт');
                    return;
                }

                setProduct(data);
            } catch (err) {
                setError('Не удалось загрузить данные продукта');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [productAlias, user?.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!product) return;

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
        else if (name.startsWith('passport_data.')) {
            const passportField = name.split('.')[1];
            setProduct({
                ...product,
                passport_data: {
                    ...(product.passport_data || {}),
                    [passportField]: value
                }
            });
        }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!product) return;

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
        if (!product) return;

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
        if (!product || !product.details[arrayName])
            return;

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
        if (!product || !product.details[arrayName])
            return;

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
        if (!product || !product.details.kinks) return;

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
        if (!product) return;

        setProduct({
            ...product,
            details: {
                ...product.details,
                kinks: [...(product.details.kinks || []), { text: '', color: '#3b82f6' }]
            }
        });
    };

    const handleRemoveKink = (index: number) => {
        if (!product || !product.details.kinks) return;

        const updatedKinks = [...product.details.kinks];
        updatedKinks.splice(index, 1);

        setProduct({
            ...product,
            details: {
                ...product.details,
                kinks: updatedKinks.length > 0 ? updatedKinks : []
            }
        });
    };

    const handleScenarioChange = (index: number, field: string, value: string) => {
        if (!product || !product.details.scenarios) return;

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
        if (!product) return;

        setProduct({
            ...product,
            details: {
                ...product.details,
                scenarios: [...(product.details.scenarios || []), { title: '', description: '' }]
            }
        });
    };

    const handleRemoveScenario = (index: number) => {
        if (!product || !product.details.scenarios) return;

        const updatedScenarios = [...product.details.scenarios];
        updatedScenarios.splice(index, 1);

        setProduct({
            ...product,
            details: {
                ...product.details,
                scenarios: updatedScenarios.length > 0 ? updatedScenarios : []
            }
        });
    };

    const handleExtraChange = (index: number, field: string, value: string | boolean) => {
        if (!product || !product.details.extras) return;

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
        if (!product) return;

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
        if (!product || !product.details.extras) return;

        const updatedExtras = [...product.details.extras];
        updatedExtras.splice(index, 1);

        setProduct({
            ...product,
            details: {
                ...product.details,
                extras: updatedExtras.length > 0 ? updatedExtras : []
            }
        });
    };

    const handleHistoryChange = (index: number, field: string, value: string) => {
        if (!product || !product.details.history) return;

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
        if (!product) return;

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
        if (!product || !product.details.history) return;

        const updatedHistory = [...product.details.history];
        updatedHistory.splice(index, 1);

        setProduct({
            ...product,
            details: {
                ...product.details,
                history: updatedHistory.length > 0 ? updatedHistory : []
            }
        });
    };

    const handleRelationshipChange = (index: number, field: string, value: string) => {
        if (!product || !product.details.relationships) return;

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
        if (!product) return;

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
        if (!product || !product.details.relationships) return;

        const updatedRelationships = [...product.details.relationships];
        updatedRelationships.splice(index, 1);

        setProduct({
            ...product,
            details: {
                ...product.details,
                relationships: updatedRelationships.length > 0 ? updatedRelationships : []
            }
        });
    };

    const handleBadgeChange = (index: number, field: string, value: string) => {
        if (!product || !product.details.badges) return;

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
        if (!product) return;

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
        if (!product || !product.details.badges) return;

        const updatedBadges = [...product.details.badges];
        updatedBadges.splice(index, 1);

        setProduct({
            ...product,
            details: {
                ...product.details,
                badges: updatedBadges.length > 0 ? updatedBadges : []
            }
        });
    };

    const handleFeatureChange = (index: number, field: string, value: string) => {
        if (!product || !product.details.features) return;

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
        if (!product) return;

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
        if (!product || !product.details.features) return;

        const updatedFeatures = [...product.details.features];
        updatedFeatures.splice(index, 1);

        setProduct({
            ...product,
            details: {
                ...product.details,
                features: updatedFeatures.length > 0 ? updatedFeatures : []
            }
        });
    };

    const handleAccessoryChange = (index: number, field: string, value: string | boolean) => {
        if (!product || !product.details.accessories) return;

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
        if (!product) return;

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

    const handleExportJson = () => {
        if (!product) return;

        const jsonString = JSON.stringify(product, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${product.alias || 'product'}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleRemoveAccessory = (index: number) => {
        if (!product || !product.details.accessories) return;

        const updatedAccessories = [...product.details.accessories];
        updatedAccessories.splice(index, 1);

        setProduct({
            ...product,
            details: {
                ...product.details,
                accessories: updatedAccessories.length > 0 ? updatedAccessories : []
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (product) {
            const result = await updateProduct(product);

            if (result) {
                toast.success("Продукт сохранен", toastOptions);
            } else {
                toast.error("Не удалось сохранить продукт", toastOptions);
            }
        }
    };

    if (!initialized || loading)
        return <LoadingCard message="Загрузка редактирования шкуры..." />;

    if (!user) {
        return <WarningCard header={"Ошибка авторизации"} description={"Редактирование шкур недоступно неавторизованным пользователям"} />
    }

    if (error)
        return <ErrorCard error={error} onRetry={() => window.location.reload()} />;

    if (!product) return <WarningCard
        header="Не удалось загрузить продукт"
        description="Похоже, что-то пошло не так. Пожалуйста, попробуйте позже."
        onRetry={() => window.location.reload()}
    />;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
            <div className="mb-8 flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">
                    Редактирование продукта
                </h2>
                <button
                    type="button"
                    onClick={handleExportJson}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    disabled={!product}
                >
                    <FontAwesomeIcon icon={faFileExport} className="mr-2" />
                    Экспортировать в JSON
                </button>
            </div>

            <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
                <SectionCard title="Основная информация" description="Основные данные о продукте">
                    <BasicEditor
                        product={product}
                        onChange={handleChange}
                    />
                </SectionCard>

                <SectionCard title="Паспортные данные" description="Официальные документы и идентификация">
                    <PassportEditor
                        passportData={product.passport_data}
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
            </form>

            {/* Закрепленная кнопка внизу экрана */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 shadow-md">
                <div className="max-w-5xl mx-auto flex justify-end">
                    <button
                        type="submit"
                        form="product-form"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                        Сохранить изменения
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProductPage;