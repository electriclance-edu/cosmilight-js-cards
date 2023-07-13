/*
Board represents the current set of tiles that the player is at.
*/
class Board {
    constructor() {
        this.tiles = {};
    }
    setTile(x,y,tile) {
        this.tiles[`${x},${y}`] = tile;
    }
    populateBoard() {
        //currently debug code
        const boardSize = {x:8,y:8};
        var tileData;
        var shaperPoint = new Point(randIntNeg(3), randIntNeg(3));
        for (var y = -boardSize.y; y <= boardSize.y; y++) {
            for (var x = -boardSize.x; x <= boardSize.x; x++) {
                var distFromCenter = dist(new Point(x, y), new Point(0,0));
                var distFromShaper = dist(new Point(x, y), shaperPoint);
                // Points can generate if they are any of the following distances from two points
                // Shaper point exists to add another disc on top of the central disc for a more interesting, albeit useless shape  
                if (distFromCenter < 3.5 || distFromShaper < 2.5) {
                    if (distFromShaper < 2.5) {
                        tileData = new Tile(randElem(["stone","stone","stone","stone","grass"]));
                    } else {
                        tileData = new Tile(randElem(["stone","grass","grass"]));
                    }
                    if (x == 0 && y == 0) {
                        tileData.setStructure(new Structure("fire"));
                    } else if (chance(0.2)) {  
                        if (chance(0.7)) {
                            tileData.setStructure(new Structure("plainsTree"));
                            tileData.inventory.addCard(new Card("breakfast"));
                        } else {
                            tileData.setStructure(new Structure("rock"));
                        }
                    }
                    this.setTile(x,y,tileData);
                }
            }
        }
    }
    getTile(x,y) {
        if (!Object.keys(this.tiles).includes(`${x},${y}`)) {
            console.log(`Board.getTile(${x},${y}): Tile does not exist`);
        }
        return this.tiles[`${x},${y}`];
    }
}