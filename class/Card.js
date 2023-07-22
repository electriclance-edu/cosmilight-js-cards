class Card {
    constructor(id,stats) {
        if (CardType.typeExists(id)) {
            this.id = id;
        } else {
            console.warn(`Card.constructor(): Card instanced with given type ${id}, however no such CardType with the given id exists.`)
        }
        this.stats = stats;
        this.inventory = undefined;

        if (this.type.hasOwnProperty("interactions")) {
            Game.addOnTickObject(this);
        }
    }
    remove() {
        this.inventory.removeCard(this.inventoryId);
    }
    get type() {
        return CardType.getById(this.id);
    }
    get interactions() {
        return this.type.interactions;
    }
    static checkEquality(cardA,cardB) {
        return cardA.id == cardB.id && hasSameKeysAndValues(cardA.stats,cardB.stats);
    }
    static isCard(obj) {
        return obj instanceof Card;
    }
}