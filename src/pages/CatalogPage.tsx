import ProductCard from "../components/catalog/ProductCard.tsx";

const CatalogPage = () => {
    const products = [
        {
            id: 1,
            title: "Екатерина Смирнова",
            location: "Москва",
            owner: 'РосШкур',
            price: 1999.99,
            image: "https://grevrwdhbvzyevkdvoig.supabase.co/storage/v1/object/public/product-pictures/russian_wives/1.webp",
        },
    ];

    return (
        <section className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-4">
                    {products.map((product, index) => (
                        <ProductCard product={product} key={index} />))
                    }
                </div>
            </div>
        </section>
    );
};

export default CatalogPage;