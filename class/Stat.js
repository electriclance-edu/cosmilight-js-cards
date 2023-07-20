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
        this.#value = selectFirstDefined(props.value,0);
        this.#max = selectFirstDefined(props.max,100);
        this.#min = selectFirstDefined(props.min,0);
    }
    get value() {
        return this.#value;
    }
    set value(value) {
        this.#value = value;
    }
    get max() {
        return this.#max;
    }
    set max(max) {
        this.#max = max;
    }
    get min() {
        return this.#min;
    }
    set min(min) {
        this.#min = min;
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