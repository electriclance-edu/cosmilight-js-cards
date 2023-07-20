/*
Inventory represents a set of cards.
*/
class Inventory {
    constructor(size = 0, title = "INVENTORY") {
        this.size = size;
        this.title = title;
        this.isRendered = false;
        this.cards = {}; //format: {id: card}
        this.idTemplate = 0;
    }
    get localId() {
        return this.title.replace(/\s+/g, '');
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
    transferCard(id,acceptor) {
        var card = this.getCard(id);
        this.removeCard(id);
        acceptor.addCard(card);
        return card;
    }
    setIsRendered(state) {
        this.isRendered = state;
    }
    amountOfCards() {
        return Object.keys(this.cards).length;
    }
    isFull() {
        return (this.size == 0) ? false : (this.cards.length < this.size);
    }
    render() {
        GUIHandler.displayInventory(this);
    }
    update() {
        GUIHandler.updateInventory(this);
    }
    addCard(card) {
        // stop if there is no space in inventory
        if (this.isFull()) {
            console.log(this);
            console.warn("Inventory.addCard(): Tried to add card to inventory, however inventory has no space.");
            throw new Error();
        }
        this.cards[++this.idTemplate] = card;
        this.update();
        return this.idTemplate;
    }
    removeCard(id) {
        delete this.cards[id];
        this.update();
    }
}