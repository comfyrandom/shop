import {useEffect, useState} from "react";
import type {Product, ProductDetails} from "../types/product.ts";
import Header from "../components/product-page/Header.tsx";
import Stats from "../components/product-page/Stats.tsx";
import SectionCard from "../components/product-page/SectionCard.tsx";
import Relationships from "../components/product-page/Relationships.tsx";
import Accessories from "../components/product-page/Accessories.tsx";
import Appearance from "../components/product-page/Appearance.tsx";
import Personality from "../components/product-page/Personality.tsx";
import Extras from "../components/product-page/Extras.tsx";
import Scenarios from "../components/product-page/Scenarios.tsx";
import History from "../components/product-page/History.tsx";
import Tag from "../components/common/Tag.tsx";
import Features from "../components/product-page/Features.tsx";
import {Link, useParams} from "react-router-dom";
import {getProductByAlias, getProductById} from "../services/products.service.ts";
import CurrentOwner from "../components/product-page/CurrentOwner.tsx";
import {ErrorCard, LoadingCard, WarningCard} from "../components/common/StatusCards.tsx";
import PriceHistoryChart from "../components/product-page/PriceHistoryChart.tsx";
import Markdown from "react-markdown";
import Passport from "../components/product-page/Passport.tsx";
import {useAuth} from "../hooks/useAuth.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCog,
    faEdit,
    faExchangeAlt,
    faTags
} from "@fortawesome/free-solid-svg-icons";

const ProductPage = () => {

    const { productAlias } = useParams<{ productAlias: string }>();
    const { user } = useAuth();
    const [product, setProduct] = useState<Product & ProductDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setError(null);

                if (productAlias == undefined) {
                    setError("Не удалось загрузить данные о продукте");
                    setLoading(false);
                    return;
                }

                let result;

                if (/^\d/.test(productAlias || '')) {
                    result = await getProductById(Number(productAlias));
                } else {
                    result = await getProductByAlias(productAlias);
                }

                if (result === undefined) {
                    setError("Не удалось загрузить данные о продукте");
                    setLoading(false);
                    return;
                }

                setProduct(result);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Не удалось загрузить данные о продукте");
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productAlias]);

    if (loading) return <LoadingCard message="Загружаем продукт..." />;
    if (error) return <ErrorCard error={error} onRetry={() => window.location.reload()} />;
    if (!product) return <WarningCard
        header="Не удалось загрузить продукт"
        description="Похоже, что-то пошло не так. Пожалуйста, попробуйте позже."
        onRetry={() => window.location.reload()}
    />;

    return (
        <div className="bg-white text-gray-800 rounded-4xl mt-4 shadow-md mb-20">
            <Header product={product}/>
            <div className="max-w-110xl mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-3/8 space-y-6">

                        {user?.id === product.owner_id && (
                            <SectionCard title="Управление продуктом">
                                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-3 rounded-lg">
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link to={`/editProduct/${product.alias}`}>
                                            <button className="cursor-pointer bg-white/80 hover:bg-white p-3 rounded-lg flex flex-col items-center justify-center transition-colors">
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                    className="text-blue-500 text-lg mb-2"
                                                />
                                                <span className="text-sm font-medium">Редактировать</span>
                                            </button>
                                        </Link>
                                        <button className="bg-gray-200 p-3 rounded-lg flex flex-col items-center justify-center transition-colors">
                                            <FontAwesomeIcon
                                                icon={faTags}
                                                className="text-purple-500 text-lg mb-2"
                                            />
                                            <span className="text-sm font-medium">Изменить цену</span>
                                        </button>
                                        <button disabled className="hidden bg-white/80 hover:bg-white p-3 rounded-lg flex flex-col items-center justify-center transition-colors">
                                            <FontAwesomeIcon
                                                icon={faExchangeAlt}
                                                className="text-amber-500 text-lg mb-2"
                                            />
                                            <span className="text-sm font-medium">Изменить статус</span>
                                        </button>
                                        <button className="hidden bg-white/80 hover:bg-white p-3 rounded-lg flex flex-col items-center justify-center transition-colors">
                                            <FontAwesomeIcon
                                                icon={faCog}
                                                className="text-gray-500 text-lg mb-2"
                                            />
                                            <span className="text-sm font-medium">Настройки</span>
                                        </button>
                                    </div>
                                </div>
                            </SectionCard>
                        )}

                        {product.owner_id && product.owner_details && (
                            <SectionCard title="Текущий владелец">
                                <CurrentOwner
                                    productAlias={product.alias}
                                    ownerId={product.owner_id}
                                    ownerAlias={product.owner_details.alias}
                                    name={product.owner_details.name}
                                    picture={product.owner_details.picture}
                                    description={product.owner_details.about}
                                    isForSale={product.status === 'FOR_SALE'}
                                    price={product.price}
                                />
                            </SectionCard>
                        )}

                        {product.details &&
                            <SectionCard title="Характеристики" className={'relative'}>
                                <Stats product={product}/>
                            </SectionCard>
                        }

                        {product.passport_data &&
                            <SectionCard title="Паспортные данные" className="overflow-hidden">
                                <Passport passport={product.passport_data} />
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
                    </div>

                    <div className="lg:w-2/3 space-y-6">
                        <SectionCard title="Описание">
                            <div className="text-black/80 leading-relaxed prose">
                                <Markdown>
                                    {product.description}
                                </Markdown>
                            </div>
                        </SectionCard>

                        { product.price_history && product.price_history.filter(item => item.price > 0).length > 1 &&
                            <SectionCard title="История цены">
                                <PriceHistoryChart data={product.price_history.filter(item => item.price > 0)}/>
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
                            <SectionCard title="Премиальные дополнения">
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
            </div>
        </div>
    );
};

export default ProductPage;