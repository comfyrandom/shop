export type Weight = {
    kilograms: number;
    pounds: number;
};

export type Height = {
    meters: number;
    inches: number;
};

class UnitsService {
    private useMetric: boolean;

    constructor(initialPreference: boolean = true) {
        this.useMetric = initialPreference;
    }

    toggleUnitSystem(): void {
        const newPreference = !this.useMetric;
        this.useMetric = newPreference;
        localStorage.setItem('unitPreference', JSON.stringify(newPreference));
        window.location.reload();
    }

    formatHeight(height?: Height): string {
        if (!height) return "";
        return this.useMetric
            ? `${height.meters} м`
            : `${Math.floor(height.inches / 12)}'${height.inches % 12}"`;
    }

    formatWeight(weight?: Weight): string {
        if (!weight) return "";
        return this.useMetric
            ? `${weight.kilograms} кг`
            : `${weight.pounds} lbs.`;
    }

    isMetric(): boolean {
        return this.useMetric;
    }

    setUnitSystem(preference: boolean): void {
        this.useMetric = preference;
    }
}

const storedPreference = localStorage.getItem('unitPreference');
const initialPreference = storedPreference
    ? JSON.parse(storedPreference)
    : true;

export const unitsService = new UnitsService(initialPreference);