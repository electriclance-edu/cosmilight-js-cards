class PhysicsBody {
    events = {
        "onclick":()=>{},
        "onhover":()=>{},
        "onintersect":()=>{}
    }; // functions that are fired onEvent
    bounds = new Rectangle({
        width:undefined,
        height:undefined
    }); // the bounds of the object by which onclick and onintersect events fire
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
        selected:false
    }

    constructor(options) {
        this.phys.pos = options.pos || new Point(0,0);
        this.phys.vel = options.vel || new Vector(3,270);
        this.physConsts.friction = options.friction || 0.1;
        this.physConsts.friction = options.mass || 1;
        this.graphics.scale = 1;
        this.graphics.translate = new Point(0,0);
        this.graphics.lastRenderLocation = new Point(0,0);
        this.bounds = options.bounds || new Rectangle({width:50,height:50});
        this.sprite = options.sprite || `resources/img/sprites/noSprite${this.bounds.type}.png`;
    }

    intersects(shape){
        if (shape.type == "rectangle" && this.bounds.type == "rectangle") {

        }
    }
    pointWithinBound(point) {
        let clientPos = Point.translate(PhysicsBodyHandler.canvasCenter,this.phys.pos);
        if (this.bounds.type == "Rectangle") {
            // Check if point is within given rectangle positioned around center
            let isWithinX = Math.abs(clientPos.x - point.x) < this.bounds.width / 2;
            let isWithinY = Math.abs(clientPos.y - point.y) < this.bounds.height / 2;
            return isWithinX && isWithinY;
        } else {
            return false;
        }

    }
    applyForce(vec) {
        this.phys.vel = Vector.add(this.phys.vel,vec);
    }
}