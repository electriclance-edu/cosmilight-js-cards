class TileType {
    static tileTypes = {};

    constructor(properties) {
        this.id = properties.id;
        this.interactions = mergeObjects(properties.interactions,GameEventHandler.defaultInteractions);
        this.amountOfSprites = properties.amountOfSprites;
    }
    static getById(id) {
        return TileType.tileTypes[id];
    }
    static load(data) {
        TileType.tileTypes[data.id] = new TileType(data);
    }
}