class Shape {
    type;
    position;
    constructor(type = "Shape",position = new Point(0,0)) {
        this.type = type;
        this.position = position;
    }
    get genericWidth() {
        if (this.type == "Circle") return this.rad * 2;
        else if (this.type == "Rectangle") return this.width;
    }
}