class CardType {
    static cardTypes = {};

    constructor(properties) {
        //verify
        const requiredProperties = [
            "id","colorName","tags","interactions","lore"
        ];
        verifyIfValidKeys(properties,requiredProperties,`CardType.constructor(): Incomplete data`);

        this.id = properties.id;
        this.colorName = properties.colorName;
        this.tags = properties.tags;
        this.interactions = properties.interactions;

        this.lore = properties.lore;
    }
    static load(data) {
        CardType.cardTypes[data.id] = new CardType(data);
    }
    static addType(id,obj) {
        CardType.cardTypes[id] = obj;
    }
    hasTag(tag) {
        return this.tags.includes(tag);
    }
    static getById(id) {
        return CardType.cardTypes[id];
    }
    static typeExists(id) {
        return Object.keys(CardType.cardTypes).includes(id);
    }
}
/*
##### CARD TYPES:
# Spell
- created from Instruments
# Instrument
- creates Spells, immovable
# Castable
- OnDrop of a compatible Spell card, starts a Runecast
*/
