class GameTickHandler {
    constructor() {
        this.tickInteractions = {};
    }
    runTick() {
        Object.values(this.tickInteractions).forEach((interaction) => {
            if (time % interaction.trigger.getInterval() == 0) {
                interaction.trigger();
            }
        })
    }
    addInteraction(id,interaction) {
        if (Object.keys(this.tickInteractions).includes(id)) {
            console.warn(`addTickFunction(${id}): Tried to add interaction with id '${id}, however tickInteractions already contains a function with that id.'`);
            console.warn(this.tickInteractions);
        }
        this.tickInteractions[id] = interaction;
    }
    removeInteraction(id) {
        delete this.tickInteractions[id];
    }
}