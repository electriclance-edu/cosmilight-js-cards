class PhysicsBodyHandler {
    static canvas;
    static ctx;
    static canvasCenter;
    static bodies = [];
    static initialize() {
        var canvas = document.getElementById("PhysicsBodyCanvas");
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        PhysicsBodyHandler.canvas = canvas;
        PhysicsBodyHandler.ctx = canvas.getContext("2d");;
        PhysicsBodyHandler.canvasCenter = new Point(PhysicsBodyHandler.canvas.width/2,PhysicsBodyHandler.canvas.height/2);

        // DEBUG
        PhysicsBodyHandler.addBody(new PhysicsBody({
            
        }));

        PhysicsBodyHandler.renderAllBodies();
    }
    static addBody(body) {
        PhysicsBodyHandler.bodies.push(body);
    }
    static physicsTimestep() {
        PhysicsBodyHandler.bodies.forEach((body)=>{ 
            body.phys.pos.x -= body.phys.vel.toPoint().x;
            body.phys.pos.y += body.phys.vel.toPoint().y;
            console.log(body.phys.vel.toPoint());
        });
    }
    static renderAllBodies() {
        PhysicsBodyHandler.bodies.forEach((body)=>{ 
            var clientLocation = Point.translate(PhysicsBodyHandler.canvasCenter,body.phys.pos);
            clientLocation.x -= body.bounds.width / 2;
            clientLocation.y -= body.bounds.height / 2;
            
            // Render the object's sprite
            var img = new Image();
            img.src = body.sprite;
            img.onload = ()=>{
                PhysicsBodyHandler.ctx.drawImage(img,clientLocation.x,clientLocation.y,body.bounds.width,body.bounds.height);
            }
            // PhysicsBodyHandler.ctx.beginPath();
            // PhysicsBodyHandler.ctx.arc(50, 50, 50, 0, 2 * Math.PI);
            // PhysicsBodyHandler.ctx.fillStyle = "orange";
            // PhysicsBodyHandler.ctx.fill();
        });
    }
}