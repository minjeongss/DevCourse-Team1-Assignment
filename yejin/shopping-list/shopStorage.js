export default class ShopStorage {
    #KEY = "shoppingList";
    #items;
    constructor() {
        this.#getFromStorage();
    }
    #getFromStorage() {
        this.#items = JSON.parse(localStorage.getItem(this.#KEY) || "{}");
    }
    #saveToStorage() {
        localStorage.setItem(this.#KEY, JSON.stringify(this.#items));
    }
    getAll() {
        return this.#items;
    }
    create(text) {
        const id = new Date().getTime();
        this.#items[id] = text;
        this.#saveToStorage();
        return id;
    }
    remove(id) {
        delete this.#items[id];
        this.#saveToStorage();
    }
}
