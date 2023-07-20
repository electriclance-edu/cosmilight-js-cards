class Structure {
    static none = new Structure("none");
    constructor(typeId = "none") {
        if (!StructureType.typeExists(typeId)) {
            console.warn(`Structure.constructor(): StructureType with id "${typeId}" does not exist.`);
        }
        this.typeId = typeId;
        this.stats = this.type.stats ? this.type.stats : "none";
    }
    hasStats() {
        return this.stats != "none";
    }
    getTypeId() {
        return this.typeId;
    }
    get type() {
        return StructureType.getById(this.typeId);
    }
}