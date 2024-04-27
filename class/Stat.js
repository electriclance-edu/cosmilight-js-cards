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
    copy() {
        return new Stat(this.typeId,{
            value:this.value,
            max:this.max,
            min:this.min
        });
    }
    isMaxed() {
        return this.value == this.#max;
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
    satisfies(amt) {
        return this.value >= amt;
    }
    consume(amt, limited = true) {
        let newValue = this.value - amt;
        if (newValue < 0) {
            return false;
        } else {
            this.setValue(newValue);
            return true;
        }
    }
    setValue(val,limited = true) {
        if (limited) {
            this.value = clamp(val, this.min, this.max);
        }
    }
    cyclicIncrement(amt) {
        this.increment(1,false);
        let newValue = (this.value > this.max) ? 1 : this.value;
        this.setValue(newValue);
    }
    increment(amt,limited = true) {
        this.value += amt;
        if (limited) {
            this.value = clamp(this.value, this.min, this.max);
        }
    }
}