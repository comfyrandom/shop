export function generateRandomPassportNumber() {
    // Серия (4 цифры, не "0000")
    let series;
    do {
        series = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    } while (series === "0000");

    // Номер (6 цифр, не "000000")
    let number;
    do {
        number = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    } while (number === "000000");

    return `${series} ${number}`;
}