class RGBA {
    constructor(r,g,b,a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    get name() {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }
}