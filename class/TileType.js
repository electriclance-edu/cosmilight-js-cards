class TileType {
    static tileTypes = {};

    constructor(properties) {
        this.id = properties.id;
        this.interactions = mergeObjects(properties.interactions,GameEventHandler.defaultInteractions);
        this.amountOfSprites = properties.amountOfSprites;
    }
    getSpriteUrls() {
        let urls = [];
        
        for (var i = 0; i < this.amountOfSprites; i++) {
            urls.push(`./resources/img/tiles/${this.id}/${i}.png`);
        }

        return urls;
    }
    static getById(id) {
        return TileType.tileTypes[id];
    }
    static load(data) {
        TileType.tileTypes[data.id] = new TileType(data);
    }
}