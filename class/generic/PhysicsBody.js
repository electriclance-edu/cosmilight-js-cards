class PhysicsBody {
    events = {
        "onclick":()=>{},
        "onhover":()=>{},
        "onintersect":()=>{}
    }; // functions that are fired onEvent
    bounds = new Rectangle({
        width:50,
        height:50
    }); // the bounds of the object by which onclick and onintersect events fire
    sprite = ""; // string with url to the object's sprite
    transform = { // graphical transformations
        scale:undefined,
        translate:new Point(0,0)
    };
    phys = { // Physics information variables
        vel:undefined,
        pos:undefined
    }; 
    physConsts = { // Physics information constants
        friction:undefined,
        mass:undefined
    }; 

    constructor(options) {
        this.sprite = options.sprite || "resources/img/sprites/noSprite.png";
        this.phys.pos = options.pos || new Point(0,0);
        this.phys.vel = options.vel || new Vector(1,45);
        this.physConsts.friction = options.friction || 0.1;
        this.physConsts.friction = options.mass || 1;
        this.transform.scale = 1;
        this.transform.translate = new Point(0,0);

    }

    applyForce(vec) {
        this.vel = Vector.add(this.vel,vec);
    }
}