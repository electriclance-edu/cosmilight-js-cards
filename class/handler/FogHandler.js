class FogHandler {
    // static dark = new RGBA(7,0,15,1);
    static fogCircles = "unpopulated";
    // static fogCircles = {
    //     "0,0":[
    //         // new FogCircle(new Point(0,0),0.3,{other:{tagged:true}}),
    //         // new FogCircle(new Point(0,0.9),0.3),
    //     ]
    // }
    static canvas;
    static updateLoop;
    static canvasCenter;
    
    static getFirst() {

    }
    static clearCircle() {

    }
    static retrieveTile(point) {
        point.x = Math.floor(point.x);
        point.y = Math.floor(point.y);

        return FogHandler.fogCircles[point.str];
    }
    // Checks if a point intersects with any fog circles within a 3x3 bound around a tile.
    static intersects(point,checkRadius = 1) {
        point = point.asFloat();
        let state = false;
        for (var deltaX = -checkRadius; deltaX <= point.x + checkRadius; deltaX++) {
            for (var deltaY = -checkRadius; deltaY <= point.y + checkRadius; deltaY++) {
                let tile = FogHandler.retrieveTile(new Point(point.x + deltaX, point.y + deltaY));
                tile.forEach((fogCircle)=>{
                    let distance = dist(fogCircle.center,point) - fogCircle.radius;
                    if (distance <= 0.3) {
                        state = true;
                        return;
                    }
                })
                if (state) {
                    return state;
                }
            }
        }
        return state;
    }
    static clearCone(angle) {
        EffectHandler.spawnSwish(angle);
        Game.player.movement.lastAttackFrame = GUIHandler.frame;
        
        const swishRadius = 1.5;
        const swishAngle = 180;
        // Get all tiles that may contain fogCircles that fall into the swish.
        let potentialTiles = squareIntersectingIntCoords(Game.player.location.asFloat(),swishRadius);
        
        potentialTiles.forEach((tile)=>{
            try {
                let tileCircles = FogHandler.fogCircles[tile.str];
                for (var i = 0; i < tileCircles.length; i++) {
                    let fogCircle = tileCircles[i];
                    let distance = dist(fogCircle.center,Game.player.location) - fogCircle.radius;
                    if (distance < swishRadius) {
                        let angleOfCircle = 360 - angleBetween(fogCircle.center,Game.player.location);
                        let isWithinAngle = angle - angleOfCircle < (swishAngle / 2) && angle - angleOfCircle > -(swishAngle / 2);
                        if (fogCircle.other.destructionState == -Infinity && isWithinAngle) {
                            // the closer it is to (angle + swishAngle/2) the higher the delay is
                            // if it is at (angle - swishAngle/2) then it it at the start of the swish and should have no delay
                            // fogCircle.other.destructionState = 0 - 0.08*(angleOfCircle - (angle-swishAngle/2));
                            let angleDelay = 0.03*(angleOfCircle - (angle-swishAngle/2));   
                            fogCircle.other.destructionState = -Math.round(angleDelay);
                            // console.log(-Math.round(0.08*(angleOfCircle - (angle-swishAngle/2))));
                            // fogCircle.other.destructionState = -190;
                        } else if (distance < 0.4) {
                            fogCircle.other.destructionState = -10;
                        }
                    }
                }
            } catch (TypeError) {}
        });
    }
    static populate() {
        if (FogHandler.fogCircles != "unpopulated") {
            return;
        }
        FogHandler.fogCircles = {};

        let spreadSize = 30;
        let maxFogDensity = 1; // amount of fog circles per tile
        // let fogSize = 1;
        let fogSize = 0.14;
        for (var x = -spreadSize; x < spreadSize; x += 0.3) {
            for (var y = -spreadSize; y < spreadSize; y += 0.3) {
                let distFromCenter = dist(new Point(0,0),new Point(x,y));
                let fogDensity = distFromCenter < 3 ? maxFogDensity : maxFogDensity;
                // let fogDensity = Math.floor(maxFogDensity * (distFromCenter / spreadSize));
                for (var i = 0; i < fogDensity; i++) {
                    let center = new Point(
                        x + randFloat(0.1),
                        y + randFloat(0.1)
                    );
                    // let fog = new FogCircle(center,0.08);
                    let fog = new FogCircle(center,randFloat(fogSize) + fogSize);
                    FogHandler.addFogCircle(fog);
                }
            }
        }
    }
    static initialize() {
        clearInterval(LightHandler.updateLoop);

        var canvas = document.getElementById("FogCanvas");
        canvas.width = graphicsDisplaySize;
        canvas.height = graphicsDisplaySize;
        FogHandler.canvas = canvas;
        FogHandler.canvasCenter = new Point(FogHandler.canvas.width/2,FogHandler.canvas.height/2);

        FogHandler.populate();
        // for (var i = 0; i < pointCount; i++) {
        //     let center = new Point(
        //         randFloat(spreadSize ) - (spreadSize /2),
        //         randFloat(spreadSize ) - (spreadSize /2)
        //     );
        //     let fog = new FogCircle(center,randFloat(fogSize) + fogSize);
        //     FogHandler.addFogCircle(fog);
        // }

        FogHandler.renderAllFog();
    }
    static addFogCircle(fogCircle) {
        let arr = FogHandler.fogCircles[fogCircle.tileId];
        if (arr) {
            arr.push(fogCircle);
        } else {
            FogHandler.fogCircles[fogCircle.tileId] = [];
            FogHandler.fogCircles[fogCircle.tileId].push(fogCircle);
        }
    }
    static canvasClear() {
        FogHandler.canvas.getContext("2d").clearRect(0, 0, FogHandler.canvas.width, FogHandler.canvas.height);
    }
    static renderAllFog() {
        FogHandler.canvasClear();

        let ctx = FogHandler.canvas.getContext("2d");

        let loc = Game.player.getRoundedLocation();
        let cull = new Point(4,4);
        for (var x = loc.x - cull.x; x < loc.x + cull.x; x++) {
            for (var y = loc.y - cull.y; y < loc.y + cull.y; y++) {
                let coordinate = x + "," + y;
                for (var i = 0; i < FogHandler.fogCircles[coordinate].length; i++) {
                    let fogCircle = FogHandler.fogCircles[coordinate][i];
                    if (fogCircle.other.destructionState != -Infinity) {
                        if (fogCircle.other.destructionState >= 10) {
                            FogHandler.fogCircles[coordinate].splice(i,1);
                            i--;
                            continue;
                        } else {
                            fogCircle.other.destructionState++;
                        }
                    }  
    
                    let fogCenter = Point.translate(fogCircle.center,Game.player.location);
                    
                    fogCenter.x *= tileWidth;
                    fogCenter.y *= -tileHeight;
                    let centerInPixels = decentralizePoint(FogHandler.canvasCenter, fogCenter);
    
                    ctx.beginPath();
                    ctx.arc(centerInPixels.x,centerInPixels.y,fogCircle.radius * tileWidth,0,2*Math.PI);
                    // fogCircle.color.a = 1 - (dist(fogCircle.center,Game.player.location) / 2.1 - 0.3);
                    ctx.fillStyle = fogCircle.color.name;
                    ctx.fill();
                }
            }
        }
    }
}