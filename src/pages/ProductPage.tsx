import {useEffect, useState} from "react";
import type {Product, ProductDetails} from "../types/product.ts";
import Header from "../components/product-page/Header.tsx";
import Footer from "../components/product-page/Footer.tsx";
import Stats from "../components/product-page/Stats.tsx";
import SectionCard from "../components/product-page/SectionCard.tsx";
import Relationships from "../components/product-page/Relationships.tsx";
import Accessories from "../components/product-page/Accessories.tsx";
import CollectionCard from "../components/common/CollectionCard.tsx";
import Appearance from "../components/product-page/Appearance.tsx";
import Personality from "../components/product-page/Personality.tsx";
import Extras from "../components/product-page/Extras.tsx";
import Scenarios from "../components/product-page/Scenarios.tsx";
import History from "../components/product-page/History.tsx";
import Tag from "../components/common/Tag.tsx";
import Features from "../components/product-page/Features.tsx";
import {useParams} from "react-router-dom";
import {getProductById} from "../services/products.service.ts";
import CurrentOwner from "../components/product-page/CurrentOwner.tsx";
import {ErrorCard, LoadingCard, WarningCard} from "../components/common/StatusCards.tsx";
import PriceHistoryChart from "../components/product-page/PriceHistoryChart.tsx";
import Markdown from "react-markdown";
import {
    faFingerprint,
    faIdCard
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import moment from "moment";

const ProductPage = () => {

    const redactLastName = (name: string) => {
        if (!name) return '';
        return `${name.charAt(0)}${'•'.repeat(name.length - 1)}`;
    };

    const redactPassportNumber = (number: string) => {
        if (!number) return '';
        const visiblePart = number.slice(0, 4);
        const redactedPart = '•'.repeat(number.length - 4);
        return `${visiblePart} ${redactedPart}`;
    };

    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<Product & ProductDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await getProductById(Number(productId));

                if (result === undefined) {
                    setError("Не удалось загрузить данные о продукте");
                    setLoading(false);
                    return;
                }

                setProduct(result);
                console.log(result);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Не удалось загрузить данные о продукте");
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) return <LoadingCard message="Загружаем продукт..." />;
    if (error) return <ErrorCard error={error} onRetry={() => window.location.reload()} />;
    if (!product) return <WarningCard
        header="Не удалось загрузить продукт"
        description="Похоже, что-то пошло не так. Пожалуйста, попробуйте позже."
        onRetry={() => window.location.reload()}
    />;

    return (
        <div className="bg-white text-gray-800 rounded-4xl mt-4 shadow-md">
            <Header product={product}/>
            <div className="max-w-110xl mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-3/8 space-y-6">

                        {product.owner_id && product.owner_details && (
                            <SectionCard title="Текущий владелец">
                                <CurrentOwner
                                    ownerId={product.owner_id}
                                    name={product.owner_details.name}
                                    picture={product.owner_details.picture}
                                    description={product.owner_details.about}
                                    isForSale={product.status === 'FOR_SALE'}
                                    price={product.price}
                                />
                            </SectionCard>
                        )}

                        <SectionCard title="Паспортные данные" className="overflow-hidden">
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-3 rounded-lg">
                                <div className="flex items-center mb-3">
                                    <div className="flex items-center justify-center w-7 h-7 bg-white rounded-full shadow-xs mr-3">
                                        <FontAwesomeIcon
                                            icon={faIdCard}
                                            className="text-blue-500 text-sm"
                                            style={{ transform: 'scale(0.9)' }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-base leading-tight">
                                            {redactLastName(product.passport_data.last_name)} {product.passport_data.first_name} {product.passport_data.middle_name}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-0.5">№ {redactPassportNumber(product.passport_data.passport_number)}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2.5 text-sm">
                                    <div className="bg-white/80 p-2 rounded">
                                        <p className="text-xs text-gray-500 mb-1">Дата рождения</p>
                                        <p className="font-medium leading-tight">{product.passport_data.date_of_birth ? moment(product.passport_data.date_of_birth).format('DD.MM.yyyy') : '-'}</p>
                                    </div>

                                    <div className="bg-white/80 p-2 rounded">
                                        <p className="text-xs text-gray-500 mb-1">Пол</p>
                                        <p className="font-medium leading-tight">{product.passport_data.gender !== '' ? product.passport_data.gender : '-'}</p>
                                    </div>

                                    <div className="bg-white/80 p-2 rounded col-span-2">
                                        <p className="text-xs text-gray-500 mb-1">Дата выдачи</p>
                                        <p className="font-medium leading-tight">{product.passport_data.issue_date ? moment(product.passport_data.issue_date).format('DD.MM.yyyy') : '-'}</p>
                                    </div>

                                    <div className="bg-white/80 p-2 rounded col-span-2">
                                        <p className="text-xs text-gray-500 mb-1">Кем выдан</p>
                                        <p className="font-medium leading-tight">{product.passport_data.issued_by ?? '-'}</p>
                                    </div>

                                    <div className="bg-white/80 p-2 rounded col-span-2">
                                        <p className="text-xs text-gray-500 mb-1">Место рождения</p>
                                        <p className="font-medium leading-tight">{product.passport_data.place_of_birth ?? '-'}</p>
                                    </div>

                                    <div className="bg-white/80 p-2 rounded col-span-2">
                                        <p className="text-xs text-gray-500 mb-1">Прописка</p>
                                        <p className="font-medium leading-tight">{product.passport_data.registration ?? '-'}</p>
                                    </div>
                                </div>

                                <div className="mt-3 pt-2 border-t border-gray-200/50 flex items-center">
                                    <FontAwesomeIcon icon={faFingerprint} className="text-amber-500 mr-1.5 text-xs" />
                                    <span className="text-xs font-mono text-gray-600">ID: {product.passport_data.biometric_id}</span>
                                </div>
                            </div>
                        </SectionCard>

                        {product.details &&
                            <SectionCard title="Характеристики" className={'relative'}>
                                <Stats product={product}/>
                            </SectionCard>
                        }

                        {product.details?.relationships && product.details.relationships.length > 0 &&
                            <SectionCard title="Отношения">
                                <Relationships relationships={product.details.relationships}/>
                            </SectionCard>
                        }

                        <SectionCard title="Аксесуары">
                            <Accessories accessories={product.details.accessories} />
                        </SectionCard>

                        {product.collections && product.collections.length > 0 && (
                            <SectionCard title="В коллекциях">
                                <div className="flex flex-wrap gap-4">
                                    {product.collections.map((collection, index) => (
                                        <CollectionCard key={index} collection={collection} />
                                    ))}
                                </div>
                            </SectionCard>
                        )}
                    </div>

                    <div className="lg:w-2/3 space-y-6">
                        <SectionCard title="Описание">
                            <div className="text-black/80 leading-relaxed prose">
                                <Markdown>
                                    {product.description}
                                </Markdown>
                            </div>
                        </SectionCard>

                        { product.price_history && product.price_history.length > 1 &&
                            <SectionCard title="История цены">
                                <PriceHistoryChart data={product.price_history}/>
                            </SectionCard>
                        }

                        {((product.details?.appearance && product.details?.appearance.length > 0) ||
                            (product.details?.personality && product.details.personality.length > 0)) && (
                            <SectionCard title="Внешность и характер">

                                { product.details?.appearance && product.details?.appearance.length > 0 &&
                                    <>
                                        <h4 className="text-gray-800 font-semibold text-base mb-3">Внешность</h4>
                                        <Appearance appearance={product.details?.appearance}/>
                                    </>
                                }

                                { product.details?.personality && product.details?.personality.length > 0 &&
                                    <>
                                        <h4 className="text-gray-800 font-semibold text-base mb-3">Характер</h4>
                                        <Personality traits={product.details.personality}/>
                                    </>
                                }

                            </SectionCard>
                        )}

                        { product.details?.kinks && product.details?.kinks.length > 0 &&
                            <SectionCard title="Кинки и фетиши">
                                <div className="flex flex-wrap gap-2">
                                    {product.details.kinks.map((kink, index) => (
                                        <Tag key={index} text={kink.text} color={kink.color}/>
                                    ))}
                                </div>
                            </SectionCard>
                        }

                        {product.details?.extras && product.details?.extras.length > 0 &&
                            <SectionCard title="Premium Extras">
                                <Extras extras={product.details.extras} />
                            </SectionCard>
                        }

                        {product.details?.scenarios && product.details?.scenarios.length > 0 &&
                            <SectionCard title="Сценарии">
                                <Scenarios scenarios={product.details.scenarios} />
                            </SectionCard>
                        }

                        {product.details?.history && product.details?.history.length > 0 &&
                            <SectionCard title="История">
                                <History history={product.details?.history} />
                            </SectionCard>
                        }

                        <SectionCard title="Возможности">
                            <Features features={product.details.features} />
                        </SectionCard>
                    </div>
                </div>

                {product.status === 'FOR_SALE' && <Footer price={product.price}/>}
            </div>
        </div>
    );
};

export default ProductPage;