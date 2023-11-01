class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    // Translates a point given a dx and dy.
    static translate(point,translator) {
        var translated = new Point(point.x,point.y);
        translated.x -= translator.x;
        translated.y -= translator.y;
        return translated;
    }
    // Translates a point along a given angle by a given length.
    static angleTranslate(point,angle,length) {
        return new Point(
            point.x + length * Math.cos(degToRad(angle)),
            point.y + length * Math.sin(degToRad(angle)),
        );
    }
    asFloat() {
        return new Point(parseFloat(this.x),parseFloat(this.y));
    }
    asInt() {
        return new Point(parseInt(this.x),parseInt(this.y));
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    get str() {
        return `${this.x},${this.y}`;
    }
    // receives a string formatted "x,y" and returns a proper point 
    static stringToPoint(string) {
        var xyArray = string.split(",");
        return new Point(xyArray[0],xyArray[1]);
    }
    static areEqual(a,b) {
        return a.x == b.x && a.y == b.y;
    }
}