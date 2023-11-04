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

        if (!FogHandler.fogCircles.hasOwnProperty(point.str)) {
            FogHandler.fogCircles[point.str] = [];
        }
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
    static clearExplosion(size = 3,location = Game.player.location.asFloat()) {
        const rays = 10;

        for (var i = 0; i < rays; i++) {
            setTimeout(()=>{
                FogHandler.clearRay(randInt(360),undefined,0.1 * size,randFloat(0.05),randFloat(0.25 * size) + 0.25 * size);
            },randInt(100));
        }
    }
    static clearFocusedExplosion(angle,size = 4,location = Game.player.location.asFloat()) {
        const rays = 15;

        for (var i = 0; i < rays; i++) {
            setTimeout(()=>{
                FogHandler.clearRay(
                    angle + (randInt(60) * randSign()),
                    undefined,
                    0.02 * size,
                    randFloat(0.01),
                    randFloat(0.4 * size) + 0.5 * size);
            },randInt(100));
        }
    }
    static marchExplosion(angle) {
        Game.player.movement.lastAttackFrame = GUIHandler.frame;
        const marchMaximum = 5;

    }
    static clearRay(angle,origin = Game.player.location.asFloat(), rayWidthMax = 0.3, rayWidthMin = 0.1, rayLength = 3, steps = Math.floor(rayLength * 3)) {
        Game.player.movement.lastAttackFrame = GUIHandler.frame;
        let rayIterations = steps + 1;

        let endPoint = Point.angleTranslate(origin,angle,rayLength);
        EffectHandler.spawnBullet(origin,endPoint,rayWidthMax,rayWidthMin);

        let currentPoint = origin;
        let stepSize = rayLength / rayIterations;
        
        for (; rayIterations > 0; rayIterations--) {
            let rayWidth = (rayWidthMax - rayWidthMin) * (rayIterations / steps) + rayWidthMin;
            let potentialTiles = squareIntersectingIntCoords(currentPoint,rayWidth);
            potentialTiles.forEach((tile) => {
                let circles = FogHandler.retrieveTile(tile);
                circles.forEach((circle)=>{
                    let distance = dist(currentPoint,circle.center) - circle.radius;
                    let normalizedDistFromOrigin = dist(origin,circle.center) / rayLength;

                    if (distance < rayWidth) {
                        circle.destroy(-20 * normalizedDistFromOrigin);
                    }
                });
            });
            currentPoint = Point.angleTranslate(currentPoint,angle,stepSize);
        }
    } 
    static clearCone(angle) {
        const swishRadius = 1;
        const swishAngle = 90;

        EffectHandler.spawnSwish(angle,swishRadius);
        Game.player.movement.lastAttackFrame = GUIHandler.frame;
        
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
                        // console.log("angleOfCircle:",angleOfCircle);

                        let distCounterclockwise = angleOfCircle - angle;
                        // console.log("raw distCounterclockwise:",distCounterclockwise);
                        if (distCounterclockwise < 0) distCounterclockwise = 360 + distCounterclockwise;
                        // console.log("denegated distCounterclockwise:",distCounterclockwise);
                        let distClockwise = 360 - distCounterclockwise;
                        // console.log("raw distClockwise:",distClockwise);
                        if (distClockwise < 0) distClockwise = 360 + distClockwise;
                        // console.log("denegated distClockwise:",distClockwise);
                        let isWithinCounterClockwise = distCounterclockwise < (swishAngle) && distCounterclockwise > 0;
                        let isWithinClockwise = distClockwise < (swishAngle) && distClockwise > 0;
                        // console.log("isWithinCounterClockwise:",isWithinCounterClockwise);
                        // console.log("isWithinClockwise:",isWithinClockwise);
                        let isWithinAngle = isWithinCounterClockwise || isWithinClockwise;
                        if (fogCircle.other.destructionState == -Infinity && isWithinAngle) {
                            // console.log("Destroyed because within angle");
                            // the closer it is to (angle + swishAngle/2) the higher the delay is
                            // if it is at (angle - swishAngle/2) then it it at the start of the swish and should have no delay
                            let angleDelay = (Math.min(distCounterclockwise,-distClockwise + swishAngle)) / (2 * swishAngle);   
                            fogCircle.destroy(-15 * angleDelay);
                            // console.log(-Math.round(0.08*(angleOfCircle - (angle-swishAngle/2))));
                            // fogCircle.other.destructionState = -190;
                        } else if (distance < 0.4) {
                            // console.log("Destroyed because close to player");
                            fogCircle.destroy(-12);
                        } else {
                            // console.log("Not destroyed");
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

        // const hardcodedRad = 1.5;
        // let centers = [
        //     // new Point(0,0),
        //     new Point(0*hardcodedRad,0.9*hardcodedRad),
        //     new Point(0*hardcodedRad,-0.9*hardcodedRad),
        //     new Point(0.9*hardcodedRad,0*hardcodedRad),
        //     new Point(-0.9*hardcodedRad,0*hardcodedRad),
        //     new Point(-0.6*hardcodedRad,-0.6*hardcodedRad),
        //     new Point(-0.6*hardcodedRad,0.6*hardcodedRad),
        //     new Point(0.6*hardcodedRad,-0.6*hardcodedRad),
        //     new Point(0.6*hardcodedRad,0.6*hardcodedRad),
        // ];
        // centers.forEach((center)=>{
        //     let fog = new FogCircle(center,0.2);
        //     FogHandler.addFogCircle(fog);
        // });

        let spreadSize = 30;
        let maxFogDensity = 1; // amount of fog circles per tile
        // let fogSize = 1;
        let fogSize = 0.11;
        for (var x = -spreadSize; x < spreadSize; x += 0.25) {
            for (var y = -spreadSize; y < spreadSize; y += 0.25) {
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

        // Shift location displayed towards mouse slightly
        // let distanceShift;
        // try {
        //     distanceShift = dist(mousePosition,graphicsLayerLoc);
        //     distanceShift = distanceShift / (visionRadius * tileWidth);
        //     distanceShift = Math.min(distanceShift,1);
        //     distanceShift *= 2;
        //     distanceShift *= distanceShift;
        //     distanceShift *= 5;
        // } catch (Error) {
        //     distanceShift = 0;
        // }
        // let shiftedCanvasCenter = Point.angleTranslate(FogHandler.canvasCenter,-mouseAngle - 180,10);

        let cull = new Point(6,6);
        for (var x = loc.x - cull.x; x < loc.x + cull.x; x++) {
            for (var y = loc.y - cull.y; y < loc.y + cull.y; y++) {
                let coordinate = x + "," + y;
                if (!FogHandler.fogCircles.hasOwnProperty(coordinate)) {
                    continue;
                }
                for (var i = 0; i < FogHandler.fogCircles[coordinate].length; i++) {
                    let fogCircle = FogHandler.fogCircles[coordinate][i];
                    if (fogCircle.other.destructionState != -Infinity) {
                        if (fogCircle.other.destructionState >= 0) {
                            FogHandler.fogCircles[coordinate].splice(i,1);
                            i--;
                            continue;
                        } else {
                            fogCircle.center = Point.angleTranslate(fogCircle.center,fogCircle.angleFromPlayer(),0.03);
                            fogCircle.radius *= 0.95;
                            fogCircle.other.destructionState++;
                        }
                        if (fogCircle.other.destructionState >= -3) {
                            fogCircle.color = new RGBA(140,90,180,0.8);  
                        } else {
                            fogCircle.color = FogCircle.defaultFogColor;
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