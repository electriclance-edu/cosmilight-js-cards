class FogCircle {
    // static defaultFogColor = new RGBA(255,0,37,0.65);
    static defaultFogColor = new RGBA(15,10,30,0.65);
    constructor(center,radius,properties = {}) {
        this.center = center;
        this.radius = radius;
        this.other = properties.other ? properties.other : {};
        this.other.timeOffset = randFloat(3.14);
        this.other.speedOffset = randFloat(1);
        this.other.rotationDirection = randSign();
        this.other.destructionState = -Infinity;
        this.stats = properties.stats;
        let randBrightness = randFloat(1) + 1;
        this.color = new RGBA(
            FogCircle.defaultFogColor.r * (1 + randFloat(0.8)) * randBrightness,
            FogCircle.defaultFogColor.g * (1 + randFloat(0.3)) * randBrightness,
            FogCircle.defaultFogColor.b * (1 + randFloat(0.4)) * randBrightness,
            FogCircle.defaultFogColor.a,
        );
        // this.color = properties.color ? properties.color : FogCircle.defaultFogColor;
    }
    get tileId() {
        return `${Math.floor(this.center.x)},${Math.floor(this.center.y)}`;
    }
}