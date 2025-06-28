import {useEffect, useState} from "react";
import {getProductEssentials, type ProductEssentials} from "../services/products.service.ts";
import ProductCard from "../components/catalog/ProductCard.tsx";
import {ErrorCard, LoadingCard, WarningCard} from "../components/common/StatusCards.tsx";
import {EmptyStateCard} from "../components/common/EmptyState.tsx";

const CatalogPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<ProductEssentials[]>([]);

    useEffect(() => {
        const load = async ()=> {
            try {
                const productCards = await getProductEssentials();

                if (productCards === null)
                    return;

                setProducts(productCards);
                setLoading(false);
            } catch {
                setError("Не удалось загрузить продукты. Пожалуйста, попробуйте позже.");
                setLoading(false);
            }
        }

        load();
    }, []);

    if (loading) return <LoadingCard message="Загружаем каталог..." />;
    if (error) return <ErrorCard error={error} onRetry={() => window.location.reload()} />;
    if (!products) return <WarningCard
        header="Не удалось загрузить продукты"
        description="Список продуктов временно недоступен. Пожалуйста, попробуйте позже."
        onRetry={() => window.location.reload()}
    />;

    return (
        <section className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 w-full">
                { products.length === 0
                    ? <EmptyStateCard title="Ой, кажется, мы не смогли найти никаких продуктов..." description="Попробуйте зайти позже или проверьте другие разделы"/>
                    : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-4">
                        {products.map((product, index) => (
                            <ProductCard product={product} key={index} />))
                        }
                    </div>
                }
            </div>
        </section>
    );
};

export default CatalogPage;