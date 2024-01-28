class Card {
    static totalCards = 0;
    constructor(id) {
        if (CardType.typeExists(id)) {
            this.id = id;
        } else {
            console.warn(`Card.constructor(): Card instanced with given type '${id}', however no such CardType exists.`)
        }
        this.externalInformation = {
            inventory:{},
        };
        this.inventory = undefined;

        if (this.type.hasOwnProperty("interactions")) {
            Game.addOnTickObject(this);
        }
        this.initializeStats(this.type.stats);
        this.index = ++Card.totalCards;
        GameEventHandler.onCreation(this);
    }
    initializeStats(statArray = []) {
        this.stats = {};
        statArray.forEach((stat) => {
            this.stats[stat.typeId] = stat.copy();
        });
    }
    getStat(id) {
        return this.stats[id];
    }
    remove() {
        this.inventory.removeCard(this.inventoryId);
    }
    get uniqueId() {
        return this.index + 0.001;
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