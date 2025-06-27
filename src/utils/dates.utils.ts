export function formatDuration(ms: number): string {
    if (ms < 0) ms = -ms;

    const time = {
        year: Math.floor(ms / (1000 * 60 * 60 * 24 * 365)),
        month: Math.floor(ms / (1000 * 60 * 60 * 24 * 30.44)) % 12,
        day: Math.floor(ms / (1000 * 60 * 60 * 24)) % 30,
        hour: Math.floor(ms / (1000 * 60 * 60)) % 24,
        minute: Math.floor(ms / (1000 * 60)) % 60,
        second: Math.floor(ms / 1000) % 60
    };

    const parts: string[] = [];

    if (time.year > 0) {
        parts.push(pluralize(time.year, 'год', 'года', 'лет'));
        return parts.join(', ');
    }

    if (time.month > 0) {
        parts.push(pluralize(time.month, 'месяц', 'месяца', 'месяцев'));
        return parts.join(', ');
    }

    if (time.day > 0) {
        parts.push(pluralize(time.day, 'день', 'дня', 'дней'));
        return parts.join(', ');
    }

    if (time.hour > 0) {
        parts.push(pluralize(time.hour, 'час', 'часа', 'часов'));
        return parts.join(', ');
    }

    if (time.minute > 0) {
        parts.push(pluralize(time.minute, 'минута', 'минуты', 'минут'));
        return parts.join(', ');
    }

    if (time.second > 0) {
        parts.push(pluralize(time.second, 'секунда', 'секунды', 'секунд'));
        return parts.join(', ');
    }

    if (parts.length === 0) {
        return 'меньше секунды';
    }

    return parts.join(', ');
}

function pluralize(n: number, singular: string, dual: string, plural: string): string {
    n = Math.abs(n) % 100;
    const n1 = n % 10;

    if (n > 10 && n < 20) return `${n} ${plural}`;
    if (n1 === 1) return `${n} ${singular}`;
    if (n1 >= 2 && n1 <= 4) return `${n} ${dual}`;
    return `${n} ${plural}`;
}