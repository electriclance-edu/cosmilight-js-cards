class Circle extends Shape {
    rad;
    constructor(options) {
        super("Circle",options.center);
        this.rad = options.rad;
    }
    get size() {
        return this.rad;
    }
}