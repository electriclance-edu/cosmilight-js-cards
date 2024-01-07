class Rectangle extends Shape {
    width;
    height;
    constructor(options) {
        super("Rectangle",options.center);
        this.width = options.width;
        this.height = options.height;
        this.radius = options.radius ? options.radius : 10;
    }
    // Given the center of the rectangle, returns the corners of that rectangle.
    getCorners(c = new Point(0,0)) {
        let topLeft = new Point(
            c.x - this.width/2,
            c.y + this.height/2
        );
        let topRight = new Point(
            c.x + this.width/2,
            c.y + this.height/2
        );
        let bottomRight = new Point(
            c.x + this.width/2,
            c.y - this.height/2
        );
        let bottomLeft = new Point(
            c.x - this.width/2,
            c.y - this.height/2
        );
        
        return [
            topLeft,
            topRight,
            bottomRight,
            bottomLeft
        ];
    }
    get size() {
        return (this.width + this.height) / 2;
    }
}