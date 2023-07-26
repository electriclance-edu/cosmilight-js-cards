/*
Board represents the current set of tiles that the player is at.
*/
class Board {
    constructor() {
        this.tiles = {};
    }
    getTile(point) {
        if (!Object.keys(this.tiles).includes(point.str)) {
            // console.log(`Board.getTile(${point.str}): Tile does not exist`);
        }
        return this.tiles[point.str];
    }
    setTile(point,tile) {
        this.tiles[point.str] = tile;
    }
    isRendered(point) {
        var tile = this.getTile(point);
        if (!!tile) {
            return tile.isRendered;
        }
    }
    setIsRendered(point,state) {
        var tile = this.getTile(point);
        if (!!tile) {
            tile.setIsRendered(state);
        }
    }
    populateBoard() {
        //currently debug code
        const boardSize = new Point(30,30);
        var shaperPointA = new Point(randIntNeg(3), randIntNeg(3));
        shaperPointA.x *= 3;
        shaperPointA.y *= 3;
        var shaperPointB = new Point(randIntNeg(3), randIntNeg(3));
        shaperPointB.x *= 2;
        shaperPointB.y *= 2;
        for (var y = -boardSize.y; y <= boardSize.y; y++) {
            for (var x = -boardSize.x; x <= boardSize.x; x++) {
                let tile;
                let distFromCenter = dist(new Point(x, y), new Point(0,0));
                let distFromStoneShaper = dist(new Point(x, y), shaperPointA);
                let distFromGrassShaper = dist(new Point(x, y), shaperPointB);
                // Points can generate if they are any of the following distances from two points
                // Shaper point exists to add another disc on top of the central disc for a more interesting, albeit useless shape  
                if (distFromCenter < 3.5 || distFromStoneShaper < 2.5 || distFromGrassShaper < 2.5) {
                    if (distFromStoneShaper < 3.5) {
                        tile = new Tile(randElem(["deep_water","stone","stone","stone","grass"]));
                    } else if (distFromGrassShaper < 3.5) {
                        tile = new Tile(randElem(["grass","grass","grass","flowered_grass","stone"]));
                    } else {
                        tile = new Tile(randElem(["stone","grass","grass","stone","grass","grass","stone","grass","grass","grass","grass","flowered_grass"]));
                    }
                    
                    tile.position = new Point(x,y);

                    if (tile.typeId != "deep_water") {
                        if (x == 0 && y == 0) {
                            // tile.setStructure(new Structure("fire"));
                        } 
                        if (tile.typeId == "grass" || tile.typeId == "flowered_grass") {
                            if (distFromCenter < 3.5) {
    
                            } else if (chance(0.4)) {  
                                if (chance(0.02)) {
                                    tile.setStructure(new Structure("rat"));
                                } else if (chance(0.3)) {
                                    tile.setStructure(new Structure("torchtree"));
                                    tile.inventory.addCard(new Card(randElem(["sap","wood","hearthberry"])));
                                } else if (chance(0.7)) {
                                    tile.setStructure(new Structure("plainsTree"));
                                    tile.inventory.addCard(new Card(randElem(["sap","wood"])));
                                    tile.inventory.addCard(new Card(randElem(["sap","wood"])));
                                    tile.inventory.addCard(new Card(randElem(["sap","wood"])));
                                }
                            }
                        } else {
                            if (chance(0.3)) {
                                tile.setStructure(new Structure(randElem(["rock","boulder"])));
                                tile.inventory.addCard(new Card("pebble"));
                                tile.inventory.addCard(new Card("pebble"));
                            }
                        }
                    }
                    
                    this.setTile(new Point(x,y),tile);
                    if (!!tile.structure) {
                        GameEventHandler.onSpawn(tile.structure);
                    }
                } else if (distFromCenter < 9.5 || distFromStoneShaper < 6.5 || distFromGrassShaper < 6.5) {
                    tile = new Tile("deep_water");
                    tile.position = new Point(x,y);
                    
                    this.setTile(new Point(x,y),tile);
                    if (!!tile.structure) {
                        GameEventHandler.onSpawn(tile.structure);
                    }
                }
            }
        }
    }
}