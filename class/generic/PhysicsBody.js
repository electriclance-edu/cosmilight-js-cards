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
        type:["draggable","tabbable"]
    };
    obj = undefined;

    constructor(options) {
        this.obj = options.obj || null;
        this.id = PhysicsBody.id++;
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
        } else {
            return false;
        }

    }
    applyForce(vec) {
        this.phys.vel = Vector.add(this.phys.vel,vec);
    }
}