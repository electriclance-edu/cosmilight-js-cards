class Rectangle extends Shape {
    width;
    height;
    constructor(options) {
        super("Rectangle",options.center);
        this.width = options.width;
        this.height = options.height;
        this.radius = options.radius ? options.radius : 10;
    }
}