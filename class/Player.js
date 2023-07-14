class Player {
    constructor() {
        this.hand = new Inventory(4,"PLAYER HAND");
        this.location = new Point(0,0);
        this.movementVelocity = 0.07;
    }
    getRoundedLocation() {
        return new Point(
            Math.round(this.location.x),
            Math.round(this.location.y)
        );
    }
    distanceTo(point) {
        return dist(point,this.location);
    }
    move(x,y) {
        this.location = new Point(x,y);
        GUIHandler.moveTileBoard(x,y); 
        LightHandler.moveLight("player",x,y);
    }
    moveLocation(x,y) {
        this.location = new Point(x,y);
    }
    translate(x,y) {
        //Move by 1/10th towards the desired position
        const deltaX = x / 6;
        const deltaY = y / 6;

        var movements = 0;
        var movementInterval = setInterval(()=>{
            var newPoint = new Point((parseFloat(Game.current.getPlayer().location.x) + deltaX).toFixed(2), (parseFloat(Game.current.getPlayer().location.y) + deltaY).toFixed(2));
            Game.current.getPlayer().moveLocation(newPoint.x,newPoint.y);
            GUIHandler.moveTileBoard(newPoint.x,newPoint.y); 
            LightHandler.moveLight("player",newPoint.x,newPoint.y);
            if (++movements == 6) {
                clearInterval(movementInterval);
            }
        },16);
    }
}