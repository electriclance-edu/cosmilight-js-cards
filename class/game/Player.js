class Player {
    constructor() {
        this.hand = new Inventory(4,"PLAYER HAND");
        this.location = new Point(0,0);
        this.movement = {
            excessSpeed:0,
            speed:0.1,
            direction:{
                "+y":0,
                "-y":0,
                "-x":0,
                "+x":0
            }
        };
        this.stats = {
            "interactionDistance":new Stat("interactionDistance",{value:1}),
        };
    }
    get moving() {
        return Object.values(this.movement.direction).some((elem) => elem);
    }
    get speed() {
        let directions = Object.values(this.movement.direction).reduce((acc,elem) => { return acc + elem }, 0);
        if (directions == 2) {
            return (this.movement.speed + Math.max(this.movement.excessSpeed,0)) / 1.414;
        } else {
            return this.movement.speed + Math.max(this.movement.excessSpeed,0);
        }
    }
    getRoundedLocation() {
        return new Point(
            roundCoordinate(this.location.x),
            roundCoordinate(this.location.y)
        );
    }
    distanceTo(point) {
        return dist(point,this.location);
    }
    moveLocation(x,y) {
        this.location = new Point(x,y);
    }
    getStat(id) {
        return this.stats[id];
    } 
    dash() {
        if (this.movement.excessSpeed > 0.01) {
            return;
        }

        GUIHandler.logText("Dashing.","player",1000);
        this.movement.excessSpeed = 0.08;
        setTimeout(()=>{
            this.movement.excessSpeed += 0.16;
            setTimeout(()=>{
                this.movement.excessSpeed += 0.16;
            },50);
        },50);
    }
    translate(x,y) {
        var newPosition = new Point(
            (parseFloat(Game.player.location.x) + x).toFixed(2), 
            (parseFloat(Game.player.location.y) + y).toFixed(2)
        );
        GUIHandler.updateScreenCull(newPosition);
        Game.player.moveLocation(newPosition.x,newPosition.y);
        GUIHandler.moveTileBoard(newPosition.x,newPosition.y); 
        LightHandler.moveLight("player",newPosition.x,newPosition.y);

        if (!!Game.currentTileCoords) {
            if (dist(Game.currentTileCoords,newPosition) > Game.player.getStat("interactionDistance").value + 1) {
                GUIHandler.closeAllInventories();
                toggleStructureDetailDisplay(false);
                Game.world.currentlyOpenedTileCoords = undefined;
            }
        }
    }
}

/*
HK - fast, quick, snappy movement. no acceleration, just instant moving
Stardew - extremely slow quick movements, snappy, although actions stop the player from moving which gives those actions weight
Factorio - slow, but snappy movements, 
Minecraft - fairly slow, slightly slippery movements? definitely doesnt feel good, although shift is nice
Isaac - fast, slippery movements
Forager - slippery, unsatisfying, slow movement
Mewnbase - takes time to accelerate to full speed, but immediate stop, DISGUSTING WHAT
Hammerwatch - WEIGHTY DELICIOUS. MOVEMENT SATISFYING. snappy but slowdown on actions give them weight and also is just cool for game
*/