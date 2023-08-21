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
        const boardSize = new Point(30,30);
        for (var y = -boardSize.y; y <= boardSize.y; y++) {
            for (var x = -boardSize.x; x <= boardSize.x; x++) {
                let tile = new Tile("grass");
                if (!this.getTile(new Point(x,y))) {
                    this.setTile(new Point(x,y),tile);
                }
                let distFromCenter = dist(new Point(x, y), new Point(0,0));
                if (distFromCenter > boardSize.x * 0.9) {
                    tile.typeId = "deep_water";
                } else {
                    if (x == 0 && y == 0) {
                        //central disc
                        let discCenter = new Point(x,y);
                        let centralDisc = disc(discCenter, 4);
                        centralDisc.forEach((point) => {
                            let distance = dist(discCenter,point);
                            let discTile = new Tile(randElem(["grass","grass","grass","grass","flowered_grass"]));
                            discTile.position = point;
                            this.setTile(point,discTile);
                            if (point.x == 0 && point.y == 0) {
                                discTile.setStructure(new Structure("monarchtree"));
                                GameEventHandler.onSpawn(discTile.structure);
                            } else if (distance > 1 && distance < 3) {
                                if (chance(0.8)) {
                                    discTile.setStructure(new Structure(randElem(["plainsFoliage","plainsTree","plainsTree","plainsTree","boulder"])));
                                    GameEventHandler.onSpawn(discTile.structure);
                                }
                            } else if (distance > 3) {
                                if (chance(0.3)) {
                                    discTile.setStructure(new Structure("taproot"));
                                    GameEventHandler.onSpawn(discTile.structure);
                                }
                            }
                        });
                    } else if ((chance(0.02) && distFromCenter > 8)) {
                        // forest disc
                        let discCenter = new Point(x,y);
                        let forestDisc = disc(discCenter, 4.5);

                        forestDisc.forEach((point) => {
                            let distance = dist(discCenter,point);
                            let discTile = new Tile(randElem(["grass","grass","grass","grass","flowered_grass"]));
                            discTile.position = point;
                            this.setTile(point,discTile);
                            if (point.x == discCenter.x && point.y == discCenter.y) {
                                discTile.setStructure(new Structure("hearthtree"));
                                GameEventHandler.onSpawn(discTile.structure);
                            } else if (distance > 1.5 && distance < 3.5) {
                                if (chance(0.8)) {
                                    discTile.setStructure(new Structure(randElem(["plainsFoliage","plainsTree","plainsTree","plainsTree","boulder"])));
                                    GameEventHandler.onSpawn(discTile.structure);
                                }
                            } else if (distance > 3.5) {
                                if (chance(0.3)) {
                                    discTile.setStructure(new Structure("taproot"));
                                    GameEventHandler.onSpawn(discTile.structure);
                                }
                            }
                        });

                    } else if (chance(0.0015) && distFromCenter > 7) {
                        // clay disc

                    }
                }
                // let distFromStoneShaper = dist(new Point(x, y), shaperPointA);
                // let distFromGrassShaper = dist(new Point(x, y), shaperPointB);
                // // Points can generate if they are any of the following distances from two points
                // // Shaper point exists to add another disc on top of the central disc for a more interesting, albeit useless shape  
                // if (distFromCenter < 7.5 || distFromStoneShaper < 2.5 || distFromGrassShaper < 2.5) {
                //     if (distFromStoneShaper < 3.5) {
                //         if (distFromStoneShaper < 2.9) {
                //             tile = new Tile("soil");
                //         } else {
                //             tile = new Tile("soil");

                //         }
                //     } else if (distFromGrassShaper < 3.5) {
                //         tile = new Tile(randElem(["grass","grass","grass","flowered_grass"]));
                //     } else {
                //         tile = new Tile("grass");
                //     }
                    
                //     tile.position = new Point(x,y);

                //     if (tile.typeId != "deep_water") {
                //         if (x == 0 && y == 0) {
                //             tile.setStructure(new Structure("hearthtree"));
                //         } 
                //         if (tile.typeId == "grass" || tile.typeId == "flowered_grass") {
                //             if (distFromCenter < 3.5) {
    
                //             } else if (chance(0.4)) {  
                //                 if (chance(0.005)) {
                //                     // tile.setStructure(new Structure("rat"));
                //                 } else if (chance(0.7)) {
                //                     tile.setStructure(new Structure(randElem(["plainsTree","plainsFoliage"])));
                //                 }
                //             }
                //         } else {
                //             if (chance(0.4)) {
                //                 tile.setStructure(new Structure(randElem(["boulder","clay","clay","clay","clay","clay"])));
                //             } else if (chance(0.1)) {
                //                 tile.setStructure(new Structure("taproot"));
                //             }
                //         }
                //     }
                // } else if (distFromCenter < 9.5 || distFromStoneShaper < 6.5 || distFromGrassShaper < 6.5) {
                //     tile = new Tile("deep_water");
                //     tile.position = new Point(x,y);
                    
                //     this.setTile(new Point(x,y),tile);
                //     if (!!tile.structure) {
                //         GameEventHandler.onSpawn(tile.structure);
                //     }
                // }
            }
        }
    }
}