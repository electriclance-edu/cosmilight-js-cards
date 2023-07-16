class Trigger {
    static initializables = {
        onTick:()=>{
            //add self to gametickmanager
        }
    };
    constructor(id,properties = "none") {
        this.id = id;
        this.properties = properties;
    }
    isSimple() {
        return this.properties == "none";
    }
    initialize() {
        if (Object.keys(Trigger.initializables).includes(this.id)) {
            Trigger.initializables[this.id]();
        }
    }
    trigger(eventId, param) {
        if (this.isSimple() && eventId == this.id) {
            return true;
        } else {
            //look at param n determine whether or not it's a valid event based on this.properties 
        }
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