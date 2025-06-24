const ProductsControls = ({count} : {count: number}) => {

    const getCorrectWordForm = (count:number) => {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
            return 'образов';
        }
        if (lastDigit === 1) {
            return 'образ';
        }
        if (lastDigit >= 2 && lastDigit <= 4) {
            return 'образа';
        }
        return 'образов';
    };

    return (
        <div className="products-controls flex justify-between items-center mb-4">
            <div>
                <span>Найдено: </span>
                <strong>{count} {getCorrectWordForm(count)}</strong>
            </div>
            <select className="sort-select p-2 border border-gray-200 rounded text-sm">
                <option>Сортировать: По цене (возр.)</option>
                <option>По цене (убыв.)</option>
                <option>По новизне</option>
                <option>По популярности</option>
            </select>
        </div>
    );
};

export default ProductsControls;