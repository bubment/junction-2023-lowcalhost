class LocalStorageService {
    constructor () {
        this.storage = window.localStorage;
    }

    setItem(key, value) {
        try {
            this.storage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error setting item ${key} in localStorage:`, error);
            return false;
        }
    }

    getItem(key) {
        try {
            const value = this.storage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Error getting item ${key} from localStorage:`, error);
            return null;
        }
    }

    removeItem(key) {
        try {
            this.storage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing item ${key} from localStorage:`, error);
            return false;
        }
    }

    clear() {
        try {
            this.storage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
}