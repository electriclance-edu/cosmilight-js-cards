class Stat {
    #value;
    #max;
    #min;
    
    constructor(typeId,props = {}) {
        this.typeId = typeId;
        
        if (!StatType.typeExists(typeId)) {
            console.warn(`Stat.constructor(): StatType with id "${typeId}" does not exist.`);
        }
        var type = StatType.getById(typeId);
        this.#value = selectFirstDefined(props.value,type.defaults.value,0);
        this.#max = selectFirstDefined(props.max,type.defaults.max,100000);
        this.#min = selectFirstDefined(props.min,type.defaults.min,0);
    }
    get value() {
        return this.#value;
    }
    get max() {
        return this.#max;
    }
    get min() {
        return this.#min;
    }
    get type() {
        return StatType.getById(this.typeId);
    }
    increment(value,limited = true) {
        if (limited) {
            this.value = Math.clamp(this.value += amt, this.min, this.max);
        } else {
            this.value += amt;
        }
        var type = this.type;
        this.value = Math.clamp(this.value,type.strictLimits.min,type.strictLimits.max);
    }
}