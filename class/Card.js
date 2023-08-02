class Card {
    constructor(id) {
        if (CardType.typeExists(id)) {
            this.id = id;
        } else {
            console.warn(`Card.constructor(): Card instanced with given type ${id}, however no such CardType with the given id exists.`)
        }
        this.externalInformation = {
            inventory:{},
        };
        this.inventory = undefined;

        if (this.type.hasOwnProperty("interactions")) {
            Game.addOnTickObject(this);
        }
        this.initializeStats(this.type.stats);
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