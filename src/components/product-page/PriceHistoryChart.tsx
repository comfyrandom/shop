import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';
// @ts-expect-error: Ошибка импорта
import 'moment/dist/locale/ru.js';

const PriceHistoryChart = ({ data }: { data: Array<{ price: number; created_at: string }> }) => {

    const formatAxisDate = (dateString: string) => moment(dateString).locale('fr').format('DD MMM HH:mm');
    const formatTooltipDate = (dateString: string) => moment(dateString).locale('fr').format('DD MMMM YYYY, HH:mm');

    // Рассчитываем границы оси Y
    const prices = data.map(item => item.price);
    const minPrice = Math.min(...prices) - 100;
    const maxPrice = Math.max(...prices) + 100;

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="created_at"
                        tick={{ fontSize: 12 }}
                        tickFormatter={formatAxisDate}
                        minTickGap={20}
                    />
                    <YAxis
                        hide={true}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(price) => `$${price}`}
                        domain={[minPrice, maxPrice]}
                    />
                    <Tooltip
                        formatter={(price: number) => [`${price} монет`, 'Цена']}
                        labelFormatter={formatTooltipDate}
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.5rem',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2 }}
                        animationDuration={300}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PriceHistoryChart;