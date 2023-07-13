/*
Inventory represents a set of cards.
*/
class Inventory {
    constructor(size = 0, title = "INVENTORY", renderElement = "none") {
        this.size = size;
        this.title = title;
        this.renderElement = renderElement;
        this.cards = {}; //format: {id: card}
        this.idTemplate = 0;
    }
    getCard(id) {
        return this.cards[id];
    }
    getCards() {
        return Object.values(this.cards);
    }
    hasItems() {
        return Object.keys(this.cards).length > 0;
    }
    hasId(id) {
        return Object.keys(this.cards).includes(id);
    }
    isFull() {
        return (this.size == 0) ? false : (this.cards.length < this.size);
    }
    render() {
        if (this.renderElement == "none") {
            return;
        }
        GUIHandler.renderInventoryIn(this.renderElement,this);
    }
    addCard(card) {
        // stop if there is no space in inventory
        if (this.isFull()) {
            console.log(this);
            console.warn("Inventory.addCard(): Tried to add card to inventory, however inventory has no space.");
            throw new Error();
        }
        this.cards[++this.idTemplate] = card;
        this.render();
        return this.idTemplate;
    }
    removeCard(id) {
        delete this.cards[id];
        this.render();
    }
}