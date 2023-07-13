class TileType {
    static tileTypes = {};

    constructor(properties) {
        this.id = properties.id;
        this.interactions = properties.interactions;
        this.amountOfSprites = properties.amountOfSprites;
    }
    static load(data) {
        TileType.tileTypes[data.id] = new TileType(data);
    }
}