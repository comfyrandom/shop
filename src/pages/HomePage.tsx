import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faVenus,
    faMicrophone,
    faTooth,
    faIdCard,
    faMagic,
    faCertificate
} from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">
                Добро пожаловать в <span className="font-extrabold">РосШкур</span>
            </h1>

            <p className="text-xl text-gray-800 mb-8 text-center">
                Станьте ею. Вживайтесь в роль, которую всегда тайно примеряли в фантазиях. РосШкур — это ваше новое лицо, тело и жизнь.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faVenus} className="text-pink-500 text-2xl mr-3" />
                        <h3 className="text-xl font-semibold">Силиконовые шкуры</h3>
                    </div>
                    <p className="text-gray-700">
                        Полноразмерные женские оболочки, изготовленные из многослойного силикона премиум-класса.
                        Мягкость кожи, вес, текстура, изгибы — всё ощущается естественно и притягательно.
                        Шкуры надеваются как вторая кожа и фиксируются с высокой точностью.
                        Вы можете полностью вжиться в новый образ: от юной соседки до зрелой «мамочки».
                        И если вы решите заменить оригинал — никто не заметит подмены.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faMicrophone} className="text-blue-500 text-2xl mr-3" />
                        <h3 className="text-xl font-semibold">Голосовые модуляторы</h3>
                    </div>
                    <p className="text-gray-700">
                        Обретите звучание, которое сводит с ума. Тонкий женский голос, интонации, дыхание — всё под контролем.
                        Настраивайте голос под выбранный типаж: строгая начальница, невинная студентка или игривая MILF —
                        ваше звучание будет таким, каким его хотят слышать.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faTooth} className="text-amber-500 text-2xl mr-3" />
                        <h3 className="text-xl font-semibold">Протезы и детали</h3>
                    </div>
                    <p className="text-gray-700">
                        Завершите образ до мелочей. От идеально ровной улыбки до маленьких интимных особенностей.
                        Грудь, ягодицы, родинки, даже запах — мы знаем, как важны детали в превращении.
                        Шкура — это не просто костюм. Это ощущение, что вы — настоящая.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faIdCard} className="text-green-500 text-2xl mr-3" />
                        <h3 className="text-xl font-semibold">Идентичность</h3>
                    </div>
                    <p className="text-gray-700">
                        Новый облик требует легенды. Мы оформим всё — документы, социальные профили,
                        банковские карты и даже медицинские записи. Хотите быть неотличимой от «настоящей»?
                        Мы создадим жизнь, в которую поверят даже её близкие.
                    </p>
                </div>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl mb-8">
                <div className="flex items-start">
                    <FontAwesomeIcon icon={faMagic} className="text-purple-600 text-2xl mt-1 mr-4" />
                    <div>
                        <h3 className="text-2xl font-bold text-purple-800 mb-3">Индивидуальные заказы</h3>
                        <p className="text-gray-800 mb-4">
                            Хотите вжиться в тело конкретной женщины? Просто пришлите нам нужные материалы.
                            Мы создадим шкуру, неотличимую от оригинала — внешне и тактильно.
                            Все нюансы фигуры, особенности кожи, даже походка —
                            с такой оболочкой вы не просто копия. Вы — новая версия.
                        </p>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-full transition-colors">
                            Заказать индивидуальную шкуру
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-800 flex items-start">
                <FontAwesomeIcon icon={faCertificate} className="text-yellow-500 mt-1 mr-3" />
                <div>
                    <strong>Важно:</strong> Некоторые категории шкур и модификаций доступны только при наличии соответствующих разрешений.
                    Подробности уточняйте у персонального менеджера.
                </div>
            </div>
        </div>
    );
};

export default HomePage;