/*
Board represents the current set of tiles that the player is at.
*/
class Board {
    constructor() {
        this.tiles = {};
    }
    getTile(point) {
        if (!Object.keys(this.tiles).includes(point.str)) {
            console.log(`Board.getTile(${point.str}): Tile does not exist`);
        }
        return this.tiles[point.str];
    }
    setTile(point,tile) {
        this.tiles[point.str] = tile;
    }
    populateBoard() {
        //currently debug code
        const boardSize = {x:8,y:8};
        var tileData;
        var shaperPointA = new Point(randIntNeg(3), randIntNeg(3));
        var shaperPointB = new Point(randIntNeg(3), randIntNeg(3));
        for (var y = -boardSize.y; y <= boardSize.y; y++) {
            for (var x = -boardSize.x; x <= boardSize.x; x++) {
                var distFromCenter = dist(new Point(x, y), new Point(0,0));
                var distFromStoneShaper = dist(new Point(x, y), shaperPointA);
                var distFromGrassShaper = dist(new Point(x, y), shaperPointB);
                // Points can generate if they are any of the following distances from two points
                // Shaper point exists to add another disc on top of the central disc for a more interesting, albeit useless shape  
                if (distFromCenter < 4.5 || distFromStoneShaper < 3.5 || distFromGrassShaper < 3.5) {
                    if (distFromGrassShaper < 2.5) {
                        tileData = new Tile(randElem(["grass","grass","grass","flowered_grass","stone"]));
                    } else if (distFromStoneShaper < 2.5) {
                        tileData = new Tile(randElem(["stone","stone","stone","stone","grass"]));
                    } else {
                        tileData = new Tile(randElem(["stone","grass","grass","stone","grass","grass","stone","grass","grass","grass","grass","flowered_grass"]));
                    }
                    if (x == 0 && y == 0) {
                        tileData.setStructure(new Structure("fire"));
                    } else if (chance(0.2)) {  
                        if (chance(0.3)) {
                            tileData.setStructure(new Structure("torchtree"));
                            LightHandler.addLight(`#${x},${y}`,new LightPoint(x,y,{strength:1.5,waver:0.05,faintness:0.3}));
                            tileData.inventory.addCard(new Card(randElem(["sap","wood","hearthberry"])));
                        } else if (chance(0.7)) {
                            tileData.setStructure(new Structure("plainsTree"));
                            tileData.inventory.addCard(new Card(randElem(["sap","wood"])));
                            tileData.inventory.addCard(new Card(randElem(["sap","wood"])));
                            tileData.inventory.addCard(new Card(randElem(["sap","wood"])));
                        } else {
                            tileData.setStructure(new Structure("rock"));
                            tileData.inventory.addCard(new Card("pebble"));
                            tileData.inventory.addCard(new Card("pebble"));
                        }
                    }
                    this.setTile(new Point(x,y),tileData);
                }
            }
        }
    }
}