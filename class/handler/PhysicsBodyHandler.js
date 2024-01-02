class PhysicsBodyHandler {
    static canvas;
    static ctx;
    static canvasCenter;
    static bodies = [];
    static images = {};
    static zoom = 1;
    static selectedBody; // Body that is currently being held by the player.
    static selectionOffset; // When a body is held, it is moved to the position of the mouse + selectionOffset to correct for where exactly the cursor was clicking relative to the center.

    static initialize() {
        var canvas = document.getElementById("PhysicsBodyCanvas");
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        PhysicsBodyHandler.canvas = canvas;
        PhysicsBodyHandler.ctx = canvas.getContext("2d");
        PhysicsBodyHandler.canvasCenter = new Point(PhysicsBodyHandler.canvas.width/2,PhysicsBodyHandler.canvas.height/2);

        // DEBUG
        // PhysicsBodyHandler.addBody(new PhysicsBody({
        //     bounds:new Rectangle({width:150,height:200}),
        //     interactionBounds:new Circle({rad:50})
        // }));
        // PhysicsBodyHandler.addBody(new PhysicsBody({
        //     bounds:new Rectangle({width:150,height:200}),
        //     pos:new Point(100,0),
        //     interactionBounds:new Circle({rad:50})
        // }));
        PhysicsBodyHandler.addBody(new PhysicsBody({
            bounds:new Rectangle({width:150,height:150}),
            pos:new Point(-100,0),
            interactionBounds:new Circle({rad:50})
        }));

        PhysicsBodyHandler.renderAllBodies();
    }
    static addManyBodies() {
        for (var i = 0; i < 10; i++) {
            PhysicsBodyHandler.addBody(new PhysicsBody({
                bounds:new Rectangle({width:150*0.7,height:200*0.7}),
                interactionBounds:new Circle({rad:30})
            }));
        }
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
    static unintersectBody(body) {
        body.tags["intersecting"] = false;
        PhysicsBodyHandler.intersectedBody = null;
    }
    static intersectBody(body) {
        body.tags["intersecting"] = true;
        PhysicsBodyHandler.intersectedBody = body;
    }
    static canvasClear() {
        PhysicsBodyHandler.ctx.clearRect(0,0,PhysicsBodyHandler.canvas.width,PhysicsBodyHandler.canvas.height);
    }
    static onmouseup() {
        PhysicsBodyHandler.unselectBody();
    }
    static onmousedown(button) {
        PhysicsBodyHandler.bodies.toReversed().every((body)=>{
            if (body.pointWithinBound(PhysicsBodyHandler.dezoomify(mousePosition))) {
                if (button == 0) PhysicsBodyHandler.selectBody(body,mousePosition);
                else if (button == 2) GUIHandler.openTooltipTab(body.card,mousePosition);
                return false;
            }
            return true;
        });
    }
    static setZoom(delta) {
        // PhysicsBodyHandler.zoom -= delta * 0.1;
        // PhysicsBodyHandler.zoom = Math.min(PhysicsBodyHandler.zoom,2.5);
        // PhysicsBodyHandler.zoom = Math.max(PhysicsBodyHandler.zoom,0.5);
    }
    static physicsTimestep() {
        if (PhysicsBodyHandler.selectedBody) {
            let clientPos = Point.translate(PhysicsBodyHandler.canvasCenter,PhysicsBodyHandler.selectedBody.phys.pos);
            clientPos = decentralizePoint(clientPos,PhysicsBodyHandler.selectionOffset);
            PhysicsBodyHandler.selectedBody.phys.vel = new Vector(Point.translate(mousePosition,clientPos).toVector().mag,angleBetween(mousePosition,clientPos));
            
        }
        PhysicsBodyHandler.bodies.forEach((body)=>{
            // Check if out of bounds
            if (Math.abs(body.phys.pos.x) > PhysicsBodyHandler.canvas.width / 2 || 
            Math.abs(body.phys.pos.y) > PhysicsBodyHandler.canvas.height / 2) {
                let clientPos = Point.translate(PhysicsBodyHandler.canvasCenter,body.phys.pos);
                body.applyForce(new Vector(10,angleBetween(PhysicsBodyHandler.canvasCenter,clientPos)));
            }
            // Check if intersecting with selectedBody
            if (PhysicsBodyHandler.selectedBody) {
                if (body.id != PhysicsBodyHandler.selectedBody.id) {
                    if (body.interactionBounds.rad + PhysicsBodyHandler.selectedBody.interactionBounds.rad > dist(body.phys.pos,PhysicsBodyHandler.selectedBody.phys.pos)) {
                        PhysicsBodyHandler.intersectBody(body);
                    } else {
                        PhysicsBodyHandler.unintersectBody(body);
                    }
                }
            } else {
                PhysicsBodyHandler.unintersectBody(body);
            }

            if (body.phys.vel.mag > 0.01) {
                // Apply push force
                PhysicsBodyHandler.bodies.forEach((nearby)=>{
                    if (nearby.id == body.id) return false;
                    if (nearby.tags["intersecting"]) return false;
                    if (PhysicsBodyHandler.selectedBody) return false;
                    if (PhysicsBodyHandler.selectedBody) if (nearby.id == PhysicsBodyHandler.selectedBody.id) return false;
                    let isIntersecting = nearby.intersects(body);
                    if (isIntersecting) {
                        nearby.applyForce(new Vector(-0.5,angleBetween(nearby.phys.pos,body.phys.pos)));
                    }
                });
                body.phys.pos.x -= body.phys.vel.toPoint().x;
                body.phys.pos.y += body.phys.vel.toPoint().y;
                body.phys.vel.mag *= 0.8;
            }
        });
    }
    static dezoomify(point) {
        return new Point(
            point.x / PhysicsBodyHandler.zoom,
            point.y / PhysicsBodyHandler.zoom
        );
    }
    static zoomify(point) {
        return new Point(
            point.x * PhysicsBodyHandler.zoom,
            point.y * PhysicsBodyHandler.zoom
        );
    }
    static renderAllBodies() {
        PhysicsBodyHandler.canvasClear();
        
        PhysicsBodyHandler.bodies.forEach((body)=>{ 
            // Get top-left position of image for positioning
            var topLeftPos = Point.translate(PhysicsBodyHandler.canvasCenter,PhysicsBodyHandler.zoomify(body.phys.pos));
            
            if (body.tags["selected"]) body.graphics.scale = Math.min(body.graphics.scale * 1.05,1.2);
            else body.graphics.scale = Math.max(body.graphics.scale / 1.05,1);
            let transformedBound = new Rectangle({
                width:body.bounds.width * body.graphics.scale * PhysicsBodyHandler.zoom,
                height:body.bounds.height * body.graphics.scale * PhysicsBodyHandler.zoom
            })

            topLeftPos.x -= transformedBound.width / 2;
            topLeftPos.y -= transformedBound.height / 2;
            
            // Render object
            if (PhysicsBodyHandler.selectedBody) {
                if (body.id == PhysicsBodyHandler.selectedBody.id) {
                    PhysicsBodyHandler.ctx.globalAlpha = 0.3
                } else {
                    PhysicsBodyHandler.ctx.globalAlpha = 1;
                }
            } else {
                PhysicsBodyHandler.ctx.globalAlpha = 1;
            }
            PhysicsBodyHandler.ctx.beginPath();
            PhysicsBodyHandler.ctx.fillStyle = body.tags["intersecting"] ? "rgb(201, 53, 122)" : 
                                               body.tags["selected"] ? "#ffce46" : 
                                               "#12d48a";
            PhysicsBodyHandler.ctx.strokeStyle = body.tags["intersecting"] ? "rgb(135, 47, 207)" : 
                                               body.tags["selected"] ? "#ff4664" : 
                                               "#1bada1";
            PhysicsBodyHandler.ctx.lineWidth = 2;
            PhysicsBodyHandler.ctx.roundRect(
                topLeftPos.x,
                topLeftPos.y,
                transformedBound.width,
                transformedBound.height,
                10 // radius
            );
            PhysicsBodyHandler.ctx.fill();
            PhysicsBodyHandler.ctx.stroke();
            // PhysicsBodyHandler.ctx.drawImage(PhysicsBodyHandler.images[body.sprite],topLeftPos.x,topLeftPos.y,transformedBound.width,transformedBound.height);
        });
    }
}