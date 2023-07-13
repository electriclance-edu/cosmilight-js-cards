class Structure {
    static none = new Structure("none");
    constructor(typeId = "none") {
        if (!StructureType.typeExists(typeId)) {
            console.warn(`Structure.constructor(): StructureType with id "${typeId}" does not exist.`);
        }
        this.typeId = typeId;
    }
    getTypeId() {
        return this.typeId;
    }
    getType() {
        return StructureType.getById(this.typeId);
    }
}