class PhysicsBody {
    static id = 0;
    bounds = new Rectangle({
        width:undefined,
        height:undefined
    }); // the bounds of the object by which onclick events fire
    interactionBounds = new Circle({
        rad:undefined
    })
    sprite = ""; // string with url to the object's sprite
    graphics = { // graphical information
        scale:undefined, // scale transformation
        translate:undefined, // visual translation, true location remains the same
        lastRenderLocation:undefined, // location of last render
    };
    phys = { // Physics information variables
        vel:undefined,
        pos:undefined
    }; 
    physConsts = { // Physics information constants
        friction:undefined,
        mass:undefined
    }; 
    tags = {
        selected:false,
        intersecting:false,
        immovable:false,
        visible:true,
        hovered:false,
        type:["draggable","tabbable"] 
    };
    obj = undefined;

    constructor(options) {
        this.id = PhysicsBody.id++;
        this.obj = options.obj || null;
        this.phys.pos = options.pos || new Point(0,0);
        this.phys.vel = options.vel || new Vector(3,270);
        this.physConsts.friction = options.friction || 0.1;
        this.physConsts.friction = options.mass || 1;
        this.graphics.scale = 1;
        this.graphics.translate = new Point(0,0);
        this.graphics.lastRenderLocation = new Point(0,0);
        this.bounds = options.bounds || new Rectangle({width:50,height:50});
        this.interactionBounds = options.interactionBounds || new Circle({rad:25});
        this.sprite = options.sprite || `resources/img/sprites/noSprite${this.bounds.type}.png`;
        this.next = null;
        this.prev = null;
    }

    bindTo(next) {
        // If the object is already in the chain of bounded objects, do not bind.
        if (!this.getBoundList().every((body)=>body.id != next.id)) return false;

        // If there is a next, clear out all the nexts after that first
        if (this.next) {
            this.breakBinds();
        }
        this.next = next;
        next.prev = this;
    }
    breakBinds() {
        let pointer = this;
        let newNext = pointer.next;
        pointer.next = null;
        while (newNext) {
            pointer = newNext;
            newNext = pointer.next;
            pointer.next = null;
            pointer.prev = null;
        }
    }
    getHead() {
        let pointer = this;
        let prev = pointer.prev;
        while (prev) {
            pointer = prev;
            prev = pointer.prev;
        }
        // pointer is now head
        return pointer;
    }
    getBoundList() {
        let pointer = this.getHead();
        let list = [pointer];
        let next = pointer.next;
        while (next) {
            pointer = next;
            next = pointer.next;
            list.push(pointer);
        }
        return list;
    }
    intersects(body) {
        if (body.bounds.type == "Rectangle" && this.bounds.type == "Rectangle") {
            let a1 = new Point(
                this.phys.pos.x - this.bounds.width/2, 
                this.phys.pos.y - this.bounds.height/2
            );
            let a2 = new Point(
                this.phys.pos.x + this.bounds.width/2, 
                this.phys.pos.y + this.bounds.height/2
            );
            let b1 = new Point(
                body.phys.pos.x - body.bounds.width/2, 
                body.phys.pos.y - body.bounds.height/2
            );
            let b2 = new Point(
                body.phys.pos.x + body.bounds.width/2, 
                body.phys.pos.y + body.bounds.height/2
            );
            return (a1.x < b2.x) && (a2.x > b1.x) && (a1.y < b2.y) && (a2.y > b1.y);
        } else if (this.bounds.type == "Rectangle" && body.bounds.type == "Circle") {
            return rectangleIntersectsCircle(this.bounds.getCorners(this.phys.pos),body.phys.pos,body.bounds.rad);
        } else if (this.bounds.type == "Circle" && body.bounds.type == "Rectangle") {
            return rectangleIntersectsCircle(body.bounds.getCorners(body.phys.pos),this.phys.pos,this.bounds.rad);
        } else if (body.bounds.type == "Circle" && this.bounds.type == "Circle") {
            return dist(body.phys.pos,this.phys.pos) < body.bounds.rad + this.bounds.rad;
        }
        return false;
    }
    pointWithinBound(point) {
        let clientPos = Point.translate(PhysicsBodyHandler.canvasCenter,this.phys.pos);
        if (this.bounds.type == "Rectangle") {
            // Check if point is within given rectangle positioned around center
            let isWithinX = Math.abs(clientPos.x - point.x) < this.bounds.width / 2;
            let isWithinY = Math.abs(clientPos.y - point.y) < this.bounds.height / 2;
            return isWithinX && isWithinY;
        } else if (this.bounds.type == "Circle") {
            return dist(point,clientPos) < this.bounds.rad;
        }
        return false;
    }
    getCorners() {
        // Currently not translated
        let relativeCorners = this.bounds.getCorners();
        let worldCorners = [];
        relativeCorners .forEach((relCorner)=>{
            worldCorners.push(decentralizePoint(relCorner,this.phys.pos));
        });
        return worldCorners;
    }
    // Strong intersection is when the center of a body is within the bounds of another.
    stronglyIntersects(body) {
        if (this.bounds.type == "Rectangle") {
            return pointIntersectsRectangle(body.phys.pos,this.getCorners());
        } else if (this.bounds.type == "Circle") {
            return dist(body.phys.pos,this.phys.pos) < this.bounds.rad;
        }
        return false;
    }
    applyForce(vec) {
        this.phys.vel = Vector.add(this.phys.vel,vec);
    }
    getBindingPoint() {
        return this.phys.pos.copy().shiftX(-this.bounds.width);
    }
    getBoundPoint() {
        return this.phys.pos.copy().shiftX(this.bounds.width);
    }
}