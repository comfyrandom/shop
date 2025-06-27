import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faHeart, faLayerGroup, faShirt, faStar, faTrophy, faUserTag} from "@fortawesome/free-solid-svg-icons";

const Stats = () => {
    return (
        <>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FontAwesomeIcon icon={faTrophy} className="text-amber-500 mr-2" />
                Статистика
            </h2>
            <div className="space-y-4">
                {[
                    {icon: faShirt, label: "Количество шкур", value: 10},
                    {icon: faHeart, label: "Покупателей", value: 32},
                    {icon: faUserTag, label: "Покупок", value: 7},
                    {icon: faClock, label: "Опыт", value: 6},
                    {icon: faStar, label: "Рейтинг", value: 4.89},
                    {icon: faLayerGroup, label: "Создано шкур", value: 6}
                ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={item.icon} className="text-gray-500 mr-3 w-5" />
                            <span className="text-gray-600">{item.label}</span>
                        </div>
                        <span className="font-bold">{item.value}</span>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Stats;