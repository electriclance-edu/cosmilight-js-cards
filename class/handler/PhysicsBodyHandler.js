class PhysicsBodyHandler {
    static canvas;
    static ctx;
    static canvasCenter;
    static bodies = [];
    static images = {};
    static selectedBody; // Body that is currently being held by the player.
    static selectionOffset; // When a body is held, it is moved to the position of the mouse + selectionOffset to correct for where exactly the cursor was clicking relative to the center.

    static initialize() {
        var canvas = document.getElementById("PhysicsBodyCanvas");
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        PhysicsBodyHandler.canvas = canvas;
        PhysicsBodyHandler.ctx = canvas.getContext("2d");;
        PhysicsBodyHandler.canvasCenter = new Point(PhysicsBodyHandler.canvas.width/2,PhysicsBodyHandler.canvas.height/2);

        // DEBUG
        PhysicsBodyHandler.addBody(new PhysicsBody({
            bounds:new Rectangle({width:100,height:100})
        }));

        PhysicsBodyHandler.renderAllBodies();
    }
    static addBody(body) {
        PhysicsBodyHandler.bodies.push(body);
    
        var img = new Image();
        img.src = body.sprite;
        PhysicsBodyHandler.images[body.sprite] = img;
    }
    static selectBody(body) {
        // Move body to the end (top) of the array.
        PhysicsBodyHandler.bodies.push(PhysicsBodyHandler.bodies.splice(PhysicsBodyHandler.bodies.indexOf(body), 1)[0]);
        body.tags["selected"] = true;
        let clientPos = Point.translate(PhysicsBodyHandler.canvasCenter,body.phys.pos);
        PhysicsBodyHandler.selectionOffset = Point.translate(mousePosition,clientPos);
        
        PhysicsBodyHandler.selectedBody = body;
    }
    static unselectBody() {
        if (PhysicsBodyHandler.selectedBody) {
            PhysicsBodyHandler.selectedBody.phys.vel = new Vector(0.5,270);
            PhysicsBodyHandler.selectedBody.tags["selected"] = false;
        }
        PhysicsBodyHandler.selectedBody = null;
    }
    static canvasClear() {
        PhysicsBodyHandler.ctx.clearRect(0,0,PhysicsBodyHandler.canvas.width,PhysicsBodyHandler.canvas.height);
    }
    static onmouseup() {
        PhysicsBodyHandler.unselectBody();
    }
    static onmousedown() {
        PhysicsBodyHandler.bodies.toReversed().every((body)=>{
            if (body.pointWithinBound(mousePosition)) {
                PhysicsBodyHandler.selectBody(body,mousePosition);
                return false;
            }
            return true;
        });
    }
    static physicsTimestep() {
        if (PhysicsBodyHandler.selectedBody) {
            let clientPos = Point.translate(PhysicsBodyHandler.canvasCenter,PhysicsBodyHandler.selectedBody.phys.pos);
            clientPos = decentralizePoint(clientPos,PhysicsBodyHandler.selectionOffset);
            PhysicsBodyHandler.selectedBody.phys.vel = new Vector(Point.translate(mousePosition,clientPos).toVector().mag,angleBetween(mousePosition,clientPos));
        }
        PhysicsBodyHandler.bodies.forEach((body)=>{
            if (body.phys.vel.mag > 0.01) {
                body.phys.pos.x -= body.phys.vel.toPoint().x;
                body.phys.pos.y += body.phys.vel.toPoint().y;
                body.phys.vel.mag *= 0.9;
            }
        });
    }
    static renderAllBodies() {
        PhysicsBodyHandler.canvasClear();
        
        PhysicsBodyHandler.bodies.forEach((body)=>{ 
            // Get top-left position of image for positioning
            var topLeftPos = Point.translate(PhysicsBodyHandler.canvasCenter,body.phys.pos);
            
            if (body.tags["selected"]) body.graphics.scale = Math.min(body.graphics.scale * 1.05,1.2);
            else body.graphics.scale = Math.max(body.graphics.scale / 1.05,1);
            let transformedBound = new Rectangle({
                width:body.bounds.width * body.graphics.scale,
                height:body.bounds.height * body.graphics.scale
            })

            topLeftPos.x -= transformedBound.width / 2;
            topLeftPos.y -= transformedBound.height / 2;
            
            // Render object
            body.lastRenderLocation = topLeftPos;
            PhysicsBodyHandler.ctx.drawImage(PhysicsBodyHandler.images[body.sprite],topLeftPos.x,topLeftPos.y,transformedBound.width,transformedBound.height);
        });
    }
}