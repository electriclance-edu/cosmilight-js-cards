class Interaction {
    constructor(properties) {
        this.triggers = properties.triggers;
        this.conditions = properties.conditions;
        this.consequences = properties.consequences;
        this.target = properties.target;
    }
}
/*
kinds of interactions to support:
- spells with tag destroy break down buildings
- spells with tag construct make a building goa  spooekr!!!!
- drag resource onto compatible building to repair it
- drag resource onto compatible building's drop in order to... construct? build? whatever
- buildings have inventory slots that the building can take from (like to build things) or the player can take from (into their inventory, like for spells) 
*/
