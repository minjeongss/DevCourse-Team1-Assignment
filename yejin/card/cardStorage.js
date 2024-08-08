export default class CardStorage {
    #KEY = "cardList";
    #cards;
    constructor() {
        this.#getFromStorage();
    }
    #getFromStorage() {
        this.#cards = JSON.parse(localStorage.getItem(this.#KEY)) || [];
    }
    #saveToStorage() {
        localStorage.setItem(this.#KEY, JSON.stringify(this.#cards));
    }
    getAll() {
        return this.#cards;
    }
    clear() {
        this.#cards = [];
        this.#saveToStorage();
    }
    create(item) {
        const id = new Date().getTime().toString();
        this.#cards.push({ id, ...item });
        this.#saveToStorage();
        return id;
    }
    remove(id) {
        this.#cards = this.#cards.filter((card) => card.id !== id);
        this.#saveToStorage();
    }
}
