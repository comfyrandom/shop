import {useEffect, useState} from "react";
import type {Product, ProductDetails} from "../types/product.ts";
import Header from "../components/product-page/Header.tsx";
import Footer from "../components/product-page/Footer.tsx";
import Stats from "../components/product-page/Stats.tsx";
import SectionCard from "../components/product-page/SectionCard.tsx";
import Ownership from "../components/product-page/Ownership.tsx";
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

const ProductPage = () => {

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

                        {product.details &&
                            <SectionCard title="Характеристики" className={'relative'}>
                                <Stats product={product}/>
                            </SectionCard>
                        }

                        <SectionCard title="Владение" className={'hidden'}>
                            <Ownership price={product.price} previousOwners={0}/>
                        </SectionCard>

                        {product.details?.relationships &&
                            <SectionCard title="Отношения">
                                <Relationships relationships={product.details.relationships}/>
                            </SectionCard>
                        }

                        {product.details?.accessories &&
                            <SectionCard title="Аксесуары">
                                <Accessories accessories={product.details.accessories}/>
                            </SectionCard>
                        }

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
                            <p className="text-black/80 leading-relaxed">
                                {product.description}
                            </p>
                        </SectionCard>

                        {product.details?.appearance && (
                            <SectionCard title="Внешний вид">
                                <Appearance appearance={product.details?.appearance} />
                            </SectionCard>
                        )}

                        {product.details?.personality && (
                            <SectionCard title="Характер">
                                <Personality traits={product.details.personality} />
                            </SectionCard>
                        )}

                        {product.details?.extras &&
                            <SectionCard title="Premium Extras">
                                <Extras extras={product.details.extras} />
                            </SectionCard>
                        }

                        {product.details?.scenarios &&
                            <SectionCard title="Сценарии">
                                <Scenarios scenarios={product.details.scenarios} />
                            </SectionCard>
                        }

                        {product.details?.history &&
                            <SectionCard title="История">
                                <History history={product.details?.history} />
                            </SectionCard>
                        }

                        {
                            product.details?.features &&
                            <SectionCard title="Возможности">
                                <Features features={product.details.features} />
                            </SectionCard>
                        }

                        { product.details?.kinks &&
                            <SectionCard title="Кинки и фетиши">
                                <div className="flex flex-wrap gap-2">
                                    {product.details.kinks.map((kink, index) => (
                                        <Tag key={index} text={kink.text} color={kink.color}/>
                                    ))}
                                </div>
                            </SectionCard>
                        }
                    </div>
                </div>

                {product.status === 'FOR_SALE' && <Footer price={product.price}/>}
            </div>
        </div>
    );
};

export default ProductPage;