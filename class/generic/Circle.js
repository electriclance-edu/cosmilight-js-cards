class Circle extends Shape {
    rad;
    constructor(options) {
        super("Rectangle",options.center);
        this.rad = options.rad;
    }
}