class StatType {
    static statTypes = {};
    constructor(id,props) {
        this.id = id;
        this.name = props.lore.name;
        this.desc = props.lore.desc;
        this.style = {};
        this.style.fillColor = props.style.fillColor;
        this.style.fillColorComplement = props.style.fillColorComplement;
        this.style.fillColorAccent = props.style.fillColorAccent ? props.style.fillColorAccent : "var(--bg-white)";
        this.style.visibility = props.style.visibility ? props.style.visibility : "visible";
        this.defaults = props.defaults ? props.defaults : {};
        this.strictLimits = mergeObjects(props.strictLimits,{min:100000,max:100000});
    }
    static typeExists(id) {
        return Object.keys(this.statTypes).includes(id);
    }
    static load(data) {
        StatType.statTypes[data.id] = new StatType(data.id,data.properties);
    }
    static getById(id) {
        return StatType.statTypes[id];
    }
}