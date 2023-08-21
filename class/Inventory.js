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
    countOf(typeId) {
        let count = 0;
        Object.values(this.cards).forEach((card)=>{
            if (card.type.id == typeId) {
                count++;
            }
        });
        return count;
    }
    getCardOfId(typeId) {
        Object.values(this.cards).forEach((card)=>{
            if (card.type.id == typeId) {
                return card;
            }
        });
    }
    removeOfId(typeId,amt) {
        Object.values(this.cards).forEach((card)=>{
            if (amt == 0) {
                return;
            }
            if (card.type.id == typeId) {
                card.remove();
                amt--;  
            }
        });
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
    isNew(card) {
        if (card.externalInformation.inventory.isNew) {
            card.externalInformation.inventory.isNew = false;
            return true;
        } else {
            return false;
        }
    }
    addCard(card) {
        // stop if there is no space in inventory
        if (this.isFull()) {
            console.log(this);
            console.warn("Inventory.addCard(): Tried to add card to inventory, however inventory has no space.");
            throw new Error();
        }
        card.inventory = this;
        card.externalInformation.inventory.isNew = true;
        this.cards[++this.idTemplate] = card;
        card.inventoryId = this.idTemplate;
        this.update();
        return this.idTemplate;
    }
    removeCard(id) {
        GameEventHandler.onRemove(this.cards[id]);
        this.cards[id].inventory = undefined;
        this.cards[id].inventoryId = undefined;
        delete this.cards[id];
        this.update();
    }
}