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

        this.renderElem = undefined;
    }
    copy() {
        return new Stat(this.typeId,{
            value:this.value,
            max:this.max,
            min:this.min
        });
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
    increment(amt,limited = true) {
        this.value += amt;
        if (limited) {
            this.value = clamp(this.value, this.min, this.max);
        }
        if (!!this.renderElem) {
            GUIHandler.updateStatElem(this.value,this.max,this.renderElem);
        }
    }
}