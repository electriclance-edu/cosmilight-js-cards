class Shape {
    type;
    position;
    constructor(type,position = new Point(0,0)) {
        this.type = type;
        this.position = position;
    }
}