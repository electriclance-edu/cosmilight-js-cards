class PhysicsBodyHandler {
    static canvas;
    static ctx;
    static canvasCenter;
    static bodies = [];
    static images = {};
    static titledBody;
    static intersectedBody; // Body that is currently intersecting with the selectedBody.
    static selectedBody; // Body that is currently being held by the player.
    static selectionOffset; // When a body is held, it is moved to the position of the mouse + selectionOffset to correct for where exactly the cursor was clicking relative to the center.
    static selectionStartPoint; // Position where the selection was started. Used to calculate onclick.
    static clickStartTime; // MS where a click attempt was started. Used to calculate onclick.
    static clickMillisecondLength = 500;
    static intersectionCorrectionForceMagnitude = -1;

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

        PhysicsBodyHandler.renderAllBodies();
    }
    static addManyBodies() {
        PhysicsBodyHandler.addBody(new PhysicsBody({
            bounds:new Circle({rad:80}),
            pos:new Point(-300,0),
            interactionBounds:new Circle({rad:10}),
            obj:new Card("eye"),
            sprite:"resources/img/cards/part/eye.png"
        }));
        PhysicsBodyHandler.addBody(new PhysicsBody({
            bounds:new Circle({rad:100}),
            pos:new Point(-300,0),
            interactionBounds:new Circle({rad:10}),
            obj:new Card("heart"),
            sprite:"resources/img/sprites/heart.png"
        }));
        // PhysicsBodyHandler.addBody(new PhysicsBody({
        //     bounds:new Rectangle({width:150,height:200,radius:10}),
        //     pos:new Point(-300,0),
        //     interactionBounds:new Circle({rad:10})
        // }));
        // for (var i = 0; i < 100; i++) {
        //     PhysicsBodyHandler.addBody(new PhysicsBody({
        //         bounds:new Circle({rad:20}),
        //         // bounds:new Rectangle({width:150*0.7,height:200*0.7,radius:10}),
        //         pos:new Point(-300,0),
        //         interactionBounds:new Circle({rad:30}),
        //         sprite:"resources/img/sprites/noSpriteCircle.png"
        //     }));
        //     PhysicsBodyHandler.addBody(new PhysicsBody({
        //         // bounds:new Circle({rad:20}),
        //         bounds:new Rectangle({width:40,height:40,radius:10}),
        //         pos:new Point(-300,0),
        //         interactionBounds:new Circle({rad:30})
        //     }));
        // }
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
        let clientPos = PhysicsBodyHandler.getClientPos(body);
        PhysicsBodyHandler.selectionOffset = Point.translate(mousePosition,clientPos);
        PhysicsBodyHandler.selectionStartPoint = new Point(body.phys.pos.x, body.phys.pos.y);
        PhysicsBodyHandler.selectedBody = body;

        PhysicsBodyHandler.startOnclickAttempt(body,0);
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
    static onPhysicsKeyHover(key) {
        // A key hover event is when a key is pressed, while the mouse is over a card.
        PhysicsBodyHandler.bodies.toReversed().forEach((body)=>{
            if (body.obj) {
                // Attempt key hover 
                // Check mouse position if there is an intersecting body
                if (!body.pointWithinBound(mousePosition)) {
                    return false;
                }
    
                // If there is, perform event
                GameEventHandler.onPhysicsKeyHover(body.obj,body,key);
            }
        });

    }
    static startOnclickAttempt(body,button) {
        PhysicsBodyHandler.clickStartTime = new Date().getTime();
        PhysicsBodyHandler.clickedObject = body;
        PhysicsBodyHandler.clickType = {
            0:"left",
            1:"middle",
            2:"right"
        }[button];
    }
    static attemptOnclick() {
        if (!PhysicsBodyHandler.clickedObject) return;
        if (PhysicsBodyHandler.clickType == "left") {
            if (!dist(PhysicsBodyHandler.selectionStartPoint,PhysicsBodyHandler.selectedBody.phys.pos) < 0.001) {
                PhysicsBodyHandler.endClickAttempt();
                return;
            }
        }
        if (new Date().getTime() - PhysicsBodyHandler.clickStartTime < PhysicsBodyHandler.clickMillisecondLength) {
            PhysicsBodyHandler.onclick(PhysicsBodyHandler.clickedObject,PhysicsBodyHandler.clickType);
        }
        PhysicsBodyHandler.endClickAttempt();
    }
    static endClickAttempt() {
        PhysicsBodyHandler.clickType = null;
        PhysicsBodyHandler.clickedObject = null;
        PhysicsBodyHandler.clickStartTime = null;
    }
    static onclick(body,button) {
        if (body.obj) {
            GameEventHandler.onClick(body.obj,button);
        }
    }
    static displayControls() {
        PhysicsBodyHandler.bodies.forEach((body)=>{
            if (body.obj) {
                console.log(body.obj.technicalDescription);
            }
        })
    }
    static onmouseup() {
        if (!PhysicsBodyHandler.clickedObject) {
            return;
        }
        if (PhysicsBodyHandler.clickedObject.obj) {
            GameEventHandler.onMouseUp(PhysicsBodyHandler.clickedObject,PhysicsBodyHandler.clickType);
        }
        PhysicsBodyHandler.attemptOnclick();
        PhysicsBodyHandler.unselectBody();
    }
    static onmousemove() {
        // if (PhysicsBodyHandler.selectedBody) {
        //     GameEventHandler.onPhysicsDrag(PhysicsBodyHandler.selectedBody);
        // } 
    }
    static onmousedown(button) {
        PhysicsBodyHandler.bodies.toReversed().every((body)=>{
            if (body.pointWithinBound(mousePosition)) {
                if (body.obj) {
                    GameEventHandler.onMouseDown(body,button);
                }
                if (button == 0) PhysicsBodyHandler.selectBody(body);
                else if (button == 2) PhysicsBodyHandler.startOnclickAttempt(body,2);
                return false;
            }
            return true;
        });
    }
    static onhoverenter(body) {
        if (body.obj instanceof Card) {
            GUIHandler.openTitleTab(body.obj);
        }
        if (body.obj) {
            GameEventHandler.onPhysicsHoverEnter(body.obj,body);
        }

    }
    static onhoverexit(body) {
        if (body.obj instanceof Card) {
            GUIHandler.closeTitleTab();
        }
        if (body.obj) {
            GameEventHandler.onPhysicsHoverExit(body.obj,body);
        }
    }
    static setZoom(delta) {
        // PhysicsBodyHandler.zoom -= delta * 0.1;
        // PhysicsBodyHandler.zoom = Math.min(PhysicsBodyHandler.zoom,2.5);
        // PhysicsBodyHandler.zoom = Math.max(PhysicsBodyHandler.zoom,0.5);
    }
    static getClientPos(body) {
        return Point.translate(PhysicsBodyHandler.canvasCenter,body.phys.pos);
    }
    static physicsTimestep() {
        if (PhysicsBodyHandler.selectedBody) {
            let clientPos = PhysicsBodyHandler.getClientPos(PhysicsBodyHandler.selectedBody);
            clientPos = decentralizePoint(clientPos,PhysicsBodyHandler.selectionOffset);
            PhysicsBodyHandler.selectedBody.phys.vel = new Vector(Point.translate(mousePosition,clientPos).toVector().mag,angleBetween(mousePosition,clientPos));
            
        }
        PhysicsBodyHandler.bodies.forEach((body)=>{
            // Check if out of bounds
            if (Math.abs(body.phys.pos.x) > PhysicsBodyHandler.canvas.width / 2 || 
            Math.abs(body.phys.pos.y) > PhysicsBodyHandler.canvas.height / 2) {
                let clientPos = PhysicsBodyHandler.getClientPos(body);
                body.applyForce(new Vector(10,angleBetween(PhysicsBodyHandler.canvasCenter,clientPos)));
            }
            // Check if intersecting with selectedBody
            if (PhysicsBodyHandler.selectedBody) {
                if (body.id != PhysicsBodyHandler.selectedBody.id) {
                    if (!PhysicsBodyHandler.intersectedBody && body.interactionBounds.rad + PhysicsBodyHandler.selectedBody.interactionBounds.rad > dist(body.phys.pos,PhysicsBodyHandler.selectedBody.phys.pos)) {
                        PhysicsBodyHandler.intersectBody(body);
                    } else {
                        PhysicsBodyHandler.unintersectBody(body);
                    }
                }
            } else {
                PhysicsBodyHandler.unintersectBody(body);
            }

            if (body.phys.vel.mag > 0.01) {
                // Apply push/collision force
                PhysicsBodyHandler.bodies.forEach((nearby)=>{
                    if (nearby.id == body.id) return false;
                    if (nearby.tags["intersecting"]) return false;
                    if (PhysicsBodyHandler.selectedBody) if (PhysicsBodyHandler.selectedBody.id == body.id) return false;
                    if (PhysicsBodyHandler.selectedBody) if (nearby.id == PhysicsBodyHandler.selectedBody.id) return false;
                    let isIntersecting = nearby.intersects(body);
                    // Gravitational force
                    // nearby.applyForce(new Vector(0.00001 * Math.pow(body.bounds.size,3),angleBetween(nearby.phys.pos,body.phys.pos)));
                    // Standard gravity force
                    // nearby.applyForce(new Vector(0.1,270));
                    if (isIntersecting) {
                        // Force based on radius
                        // nearby.applyForce(new Vector(body.bounds.rad / -20,angleBetween(nearby.phys.pos,body.phys.pos)));
                        // Correct force based on default
                        nearby.applyForce(new Vector(PhysicsBodyHandler.intersectionCorrectionForceMagnitude,angleBetween(nearby.phys.pos,body.phys.pos)));
                    }
                });

                if (!body.tags["immovable"]) {
                    body.phys.pos.x -= body.phys.vel.toPoint().x;
                    body.phys.pos.y += body.phys.vel.toPoint().y;
                }
                body.phys.vel.mag *= 0.7;
            }
        });
    }
    static retryCollisionForce(body) {
        PhysicsBodyHandler.bodies.forEach((nearby)=>{
            if (nearby.id == body.id) return false;
            if (nearby.tags["intersecting"]) return false;
            if (PhysicsBodyHandler.selectedBody) return false;
            if (PhysicsBodyHandler.selectedBody) if (nearby.id == PhysicsBodyHandler.selectedBody.id) return false;
            let isIntersecting = nearby.intersects(body);
            if (isIntersecting) {
                // Force based on radius
                // nearby.applyForce(new Vector(body.bounds.rad / -20,angleBetween(nearby.phys.pos,body.phys.pos)));
                // Correct force based on default
                nearby.applyForce(new Vector(PhysicsBodyHandler.intersectionCorrectionForceMagnitude,angleBetween(nearby.phys.pos,body.phys.pos)));
            }
        });
    }
    static renderAllBodies() {
        PhysicsBodyHandler.canvasClear();
        
        PhysicsBodyHandler.bodies.toReversed().every((body)=>{
            if (body.pointWithinBound(mousePosition)) {
                if (!body.tags["hovered"]) {
                    PhysicsBodyHandler.onhoverenter(body);
                }
                body.tags["hovered"] = true;
                return false;
            } else {
                if (body.tags["hovered"]) {
                    PhysicsBodyHandler.onhoverexit(body);
                }
                body.tags["hovered"] = false;
                return true;
            }
        });
        
        PhysicsBodyHandler.bodies.forEach((body)=>{ 
            if (!body.tags["visible"]) return false;
            // Get top-left position of image for positioning
            var topLeftPos = Point.translate(PhysicsBodyHandler.canvasCenter,body.phys.pos);
            
            if (body.tags["selected"]) body.graphics.scale = Math.min(body.graphics.scale * 1.05,1.2);
            else body.graphics.scale = Math.max(body.graphics.scale / 1.05,1);
            
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

            if (body.tags["hovered"]) {
                PhysicsBodyHandler.ctx.shadowColor = "rgba(255,255,255,0.5)";
                PhysicsBodyHandler.ctx.shadowBlur = 10;
            } else {
                PhysicsBodyHandler.ctx.shadowColor = "rgba(0,0,0,0.3)";
                PhysicsBodyHandler.ctx.shadowBlur = 25;
            }

            if (body.bounds.type == "Rectangle") {
                let transformedBound = new Rectangle({
                    width:body.bounds.width * body.graphics.scale,
                    height:body.bounds.height * body.graphics.scale
                })
                
                topLeftPos.x -= transformedBound.width / 2;
                topLeftPos.y -= transformedBound.height / 2;
                
                if (body.sprite) {
                    PhysicsBodyHandler.ctx.drawImage(
                        PhysicsBodyHandler.images[body.sprite],
                        topLeftPos.x,
                        topLeftPos.y,
                        transformedBound.width,
                        transformedBound.height
                    );
                } else {
                    PhysicsBodyHandler.ctx.roundRect(
                        topLeftPos.x,
                        topLeftPos.y,
                        transformedBound.width,
                        transformedBound.height,
                        body.bounds.radius // radius
                    );
                    PhysicsBodyHandler.ctx.fill();
                    PhysicsBodyHandler.ctx.stroke();
                }
            } else if (body.bounds.type == "Circle") {
                if (body.sprite) {
                    PhysicsBodyHandler.ctx.drawImage(
                        PhysicsBodyHandler.images[body.sprite],
                        topLeftPos.x - body.bounds.rad,
                        topLeftPos.y - body.bounds.rad,
                        body.bounds.rad * 2,
                        body.bounds.rad * 2
                    );
                } else {
                    PhysicsBodyHandler.ctx.arc(
                        topLeftPos.x,
                        topLeftPos.y,
                        body.bounds.rad,
                        0,
                        2 * Math.PI
                    );
                    PhysicsBodyHandler.ctx.fill();
                    PhysicsBodyHandler.ctx.stroke();
                }
            } else {
                console.warn(`PhysicsBodyHandler.renderAllBodies(): Attempted to render body of unknown bounds type '${body.bounds.type}'.`);
            }
            // PhysicsBodyHandler.ctx.drawImage(PhysicsBodyHandler.images[body.sprite],topLeftPos.x,topLeftPos.y,transformedBound.width,transformedBound.height);
        });
    }
}