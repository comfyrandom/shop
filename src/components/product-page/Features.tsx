import React from 'react';

interface FeaturesProps {
    features?: Array<{
        title: string;
        description: string;
        premium?: boolean;
    }>;
}

const Features: React.FC<FeaturesProps> = ({ features = [] }) => {
    const standardFeatures = [
        {
            title: "Модуль поведенческой коррекции",
            description: "Система адаптивной обратной связи в реальном времени для бесшовного воспроизведения привычек, жестов и социального поведения оригинальной персоны."
        },
        {
            title: "Слой интеграции личности",
            description: "Обеспечивает полное психологическое наложение, позволяя пользователю подавлять собственную идентичность и точно имитировать целевую персону на подсознательном уровне."
        },
        {
            title: "Комплекс биометрического камуфляжа",
            description: "Продвинутая репликация зубных структур, узоров отпечатков пальцев, деталей радужной оболочки и тональности голоса для полного биометрического сокрытия."
        },
        {
            title: "Система терморегуляции",
            description: "Поддерживает естественную температуру кожи и адаптируется к окружающей среде для реалистичности и маскировки теплового сигнатура."
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Основные возможности</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {standardFeatures.map((feature, index) => (
                        <div
                            key={`standard-${index}`}
                            className="group relative bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                        >
                            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-indigo-100 transition-all pointer-events-none"></div>
                            <h4 className="text-base font-medium text-indigo-600 mb-2">
                                {feature.title}
                            </h4>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {features && features.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Расширенные возможности</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={`feature-${index}`}
                                className={`group relative p-6 rounded-xl border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 ${
                                    feature.premium
                                        ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100'
                                        : 'bg-white border-gray-100'
                                }`}
                            >
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-indigo-200 transition-all pointer-events-none"></div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className={`text-base font-medium ${
                                        feature.premium ? 'text-purple-600' : 'text-indigo-600'
                                    }`}>
                                        {feature.title}
                                    </h4>
                                    {feature.premium && (
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      PREMIUM
                    </span>
                                    )}
                                </div>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Features;