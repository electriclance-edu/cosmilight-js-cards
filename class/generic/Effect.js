class Effect {
    static id = 0;
    life;
    startPt;
    endPt;
    startSize;
    endSize;
    pos;
    id;
    
    constructor(options) {
        this.id = Effect.id++;
        this.lifespan = options.lifespan;
        
        // Basal parameters.
        this.startPt = options.startPt;
        if (options.endPt) {
            this.endPt = options.endPt;
        }
        this.startSize = options.startSize;
        this.endSize = options.endSize;
        this.startOpacity = options.startOpacity;
        this.endOpacity = options.endOpacity;
        
        // Style parameters.
        this.inherentNumber = randInt(1000);
        this.color = options.color || new RGBA(255,255,255);
        this.spinSpeed = options.spinSpeed || 10;
        
        // State parameters, ones that are used to track the current progress of the effect.
        this.lifetime = 0;
        this.pos = options.startPt;
        this.size = options.startSize;
        this.opacity = options.startOpacity;

        // Parameters for the associated light point
        if (options.lightPointProperties) {
            this.lightPoint = new LightPoint(
                this.pos.x,
                this.pos.y,
                options.lightPointProperties
            );
        } else {
            this.lightPoint = new LightPoint(
                this.pos.x,
                this.pos.y,
                {
                    strength:this.size / 2,
                    waver:0.1,
                    color:new RGBA(255,255,255,0.1),
                    faintness:randFloat(0.3)
                }
            );

        }
        LightHandler.addLight(`effect${this.id}`,this.lightPoint);

        // Emergent parameters, calculated from the basal parameters.
        if (!options.endPt) {
            if (!(options.linearAngle === undefined) && options.displacement) {
                this.linearAngle = options.linearAngle + 180;
                this.displacement = options.displacement;
            } else {
                console.warn("Effect.constructor(): Attempted to construct effect without supplying a valid [endPt] or [angle and displacement].")
            }
        } else {
            this.linearAngle = -angleBetween(this.startPt,this.endPt) + 180;
            this.displacement = dist(this.startPt,this.endPt);
        }
        this.deltaSize = this.endSize - this.startSize;
        this.deltaOpacity = this.endOpacity - this.startOpacity;
    }
    getLightPoint() {
        return this.lightPoint;
    }
    getPosAtLifetime(lifetime) {
        if (this.inherentNumber % 2 == 0) {
            return Point.angleTranslate(this.startPt,this.linearAngle,this.displacement / this.lifespan * lifetime).shiftY(Math.sin(lifetime / this.lifespan * this.spinSpeed)*20).shiftX(Math.cos(lifetime / this.lifespan)*20);
        } else {
            return Point.angleTranslate(this.startPt,this.linearAngle,this.displacement / this.lifespan * lifetime).shiftY(Math.cos(lifetime / this.lifespan * this.spinSpeed)*20).shiftX(Math.sin(lifetime / this.lifespan)*20);

        }
    }
    getSizeAtLifetime(lifetime) {
        return this.startSize + (this.deltaSize / this.lifespan)*lifetime;
    }
    getOpacityAtLifetime(lifetime) {
        return this.startOpacity + (this.deltaOpacity / this.lifespan) * lifetime;
    }
}