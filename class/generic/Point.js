class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    static translate(point,translator) {
        var translated = new Point(point.x,point.y);
        translated.x -= translator.x;
        translated.y -= translator.y;
        return translated
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
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