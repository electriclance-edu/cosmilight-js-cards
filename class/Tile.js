class Tile {
    constructor(typeId = "grass") {
        this.typeId = typeId;
        this.structure = Structure.none;
        this.inventory = new Inventory(0,"THE GROUND");
    }
    setStructure(struct) {
        if (!StructureType.typeExists(struct.getTypeId())) {
            console.warn(`Tile.constructor(): Tile constructed with structure "${struct.getTypeId()}", however no such StructureType exists.`);
        }
        this.structure = struct;
    }
    getStructure() {
        return this.structure;
    }
    //if the structure isnt defined OR if the structure isnt none, then there is a structure
    hasStructure() {
        if (typeof this.structure == 'undefined' || !this.hasOwnProperty('structure')) {
            return false;
        } else if (this.structure.typeId != "none") {
            return true;
        }

        return false;
    }
    getType() {
        return TileType.tileTypes[this.typeId];
    }
}