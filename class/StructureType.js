//
class StructureType extends CardType {
    static structureTypes = {
        "none":"none",
    };
    
    constructor(properties) {
        //verify
        const requiredProperties = ["cardProperties","structureProperties"];
        verifyIfValidKeys(properties,requiredProperties,`StructureType.constructor(): StructureType initialized has incomplete data`);
        
        //inherit from cardtype
        super(properties.cardProperties);
        CardType.addType(this.id,this);

        //verify structure properties
        const requiredStructureProperties = ["amountOfSprites"];
        verifyIfValidKeys(properties.structureProperties,requiredStructureProperties,`StructureType.constructor(): Structure properties of StructureType has incomplete data`);

        //setup structure properties
        this.interactions = mergeObjects(properties.structureProperties.interactions,GameEventHandler.defaultInteractions);
        this.amountOfSprites = properties.structureProperties.amountOfSprites;
        this.stats = properties.structureProperties.stats;
    }
    static typeExists(id) {
        return Object.keys(this.structureTypes).includes(id);
    }
    static getById(id) {
        return StructureType.structureTypes[id];
    }
    static load(data) {
        StructureType.structureTypes[data.cardProperties.id] = new StructureType(data);
    }
}