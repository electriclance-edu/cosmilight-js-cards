class Rectangle extends Shape {
    width;
    height;
    constructor(options) {
        super("rectangle",options.center);
        this.width = options.width;
        this.height = options.height;
    }
}