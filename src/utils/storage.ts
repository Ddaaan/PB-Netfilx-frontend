export const storage = {
    get<T>(key: string, defaultValue: T): T {
        const raw = localStorage.getItem(key);
        if (!raw) return defaultValue;
        try {
            return JSON.parse(raw) as T;
        } catch {
            return defaultValue;
        }
    },
    set(key: string, value: unknown) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key: string) {
        localStorage.removeItem(key);
    },
};
