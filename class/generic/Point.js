class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    // receives a string formatted "x,y" and returns a proper point 
    static stringToPoint(string) {
        var xyArray = string.split(",");
        return new Point(xyArray[0],xyArray[1]);
    }
}