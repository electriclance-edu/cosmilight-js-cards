class Vector {
    mag;
    deg;

    constructor(mag = 0, deg = 0) {
        this.mag = mag;
        this.deg = deg;
    }
    get rad() {
        return degToRad(this.deg);
    }
    toPoint() {
        return new Point(
            (this.mag * Math.cos(-this.rad)).toFixed(4) * 1.00,
            -(this.mag * Math.sin(-this.rad)).toFixed(4) * 1.00
        );
    }
    static add(v1,v2) {
        let v1_planar = v1.toPoint();
        let v2_planar = v2.toPoint();
        let added = new Point(
            v1_planar.x + v2_planar.x,
            v1_planar.y + v2_planar.y
        );
        return added.toVector();
    }
}