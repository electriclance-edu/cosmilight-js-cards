class Structure {
    constructor(typeId) {
        if (!StructureType.typeExists(typeId)) {
            console.warn(`Structure.constructor(): StructureType with id "${typeId}" does not exist.`);
        }
        this.typeId = typeId;
        this.initializeStats(this.type.stats);
    }
    initializeStats(statArray = []) {
        this.stats = {};
        statArray.forEach((stat) => {
            this.stats[stat.typeId] = stat;
        });
    }
    hasStats() {
        return this.stats != "none";
    }
    getTypeId() {
        return this.typeId;
    }
    getStat(id) {
        return this.stats[id];
    }
    get tile() {
        if (!!this.position) {
            return Game.currentBoard.getTile(this.position);
        }
    }
    get interactions() {
        return this.type.interactions;
    }
    get type() {
        return StructureType.getById(this.typeId);
    }
}