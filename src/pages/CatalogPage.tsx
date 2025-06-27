import {useEffect, useState} from "react";
import {getProductEssentials, type ProductEssentials} from "../services/products.service.ts";
import {isAuthenticated} from "../services/auth.service.ts";
import ProductCard from "../components/catalog/ProductCard.tsx";

const CatalogPage = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const [auth, setAuth] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [products, setProducts] = useState<ProductEssentials[]>([]);

    useEffect(() => {
        const load = async ()=> {
            try {
                const isAuth = await isAuthenticated();
                setAuth(isAuth);

                const productCards = await getProductEssentials();

                if (productCards === null)
                    return;

                setProducts(productCards);
                setLoading(false);
            } catch {
                setError("Failed to load products. Please try again later.");
                setLoading(false);
            }
        }

        load();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center mt-10">
                <div className="bg-gray-950 text-white px-6 py-4 rounded-xl shadow-lg animate-pulse">
                    <h1 className="text-2xl font-semibold">Loading products, please wait...</h1>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center mt-10">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl shadow-md">
                    <h1 className="text-2xl font-semibold">An error occurred while loading products.</h1>
                </div>
            </div>
        );
    }

    return (
        <section className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-4">
                    {products.map((product, index) => (
                        <ProductCard isAuthenticated={auth} product={product} key={index} />))
                    }
                </div>
            </div>
        </section>
    );
};

export default CatalogPage;