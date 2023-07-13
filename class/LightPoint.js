class LightPoint extends Point {
    constructor(x,y,properties) {
        super(x,y);
        this.strength = properties.strength;
        this.waver = properties.waver;
        this.color = properties.color;
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