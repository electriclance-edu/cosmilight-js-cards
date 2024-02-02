class LightPoint extends Point {
    constructor(x,y,properties) {
        super(x,y);
        this.strength = properties.strength; // in pixels
        this.waver = properties.waver;
        this.color = properties.color || new RGBA(0,0,0,0);
        this.faintness = properties.faintness || 1;
        this.delete = false;
        this.age = 0;
    }
    getStrength() {
        return this.strength;
    }
    doesWaver() {
        return Object.keys(this).includes("waver");
    }
    getRandomWaveredStrength() {
        return this.strength + randFloatNeg(this.waver);
    }
}