class Trigger {
    constructor(id,properties) {
        this.id = id;
        this.properties = properties;
    }
    getInterval() {
        if (Object.keys(this).includes("ticks")) {
            return this.properties.ticks;
        } else {
            console.warn(`Trigger.getInterval(): Trigger of id ${this.id} tried to return tick interval, but has no such value.`);
        }
    }
}
/*
**triggers** of the interaction 
- represents the type of events that trigger the interaction
- for anything: onDrop, onTick, onInterval
- for structures: castedOn, onAttack, onDestroy
*/