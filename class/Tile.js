class Tile {
    constructor(typeId = "grass") {
        this.typeId = typeId;
        this.structure = undefined;
        this.inventory = new Inventory(0,"TILE");
        this.isRendered = false;
        this.lightPointInformation = {
            maxDeterminers:{
                structure:0,
                other:0
            },
            valueDeterminers:{
                structure:0,
                other:0,
            },
        }
    }
    setIsRendered(state) {
        this.isRendered = state;
    }
    setStructure(struct) {
        if (!StructureType.typeExists(struct.getTypeId())) {
            console.warn(`Tile.constructor(): Tile constructed with structure "${struct.getTypeId()}", however no such StructureType exists.`);
        }
        struct.position = this.position;
        this.structure = struct;
    }
    getInventory(type) {
        if (type == "tile") {
            return this.inventory;
        } else if (type == "structure") {
            return this.structure.getInventory();
        }
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