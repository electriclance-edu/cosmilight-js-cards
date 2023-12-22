/*
Grids contain a set of tiles, structures, and LightPoints that fully represent a given space's physical attributes.
Grids do not inherently contain any types
*/
class Grid {
    constructor() {
        this.tiles = {};
        this.structures = {};
        this.lightPoints = {};
    }
    getTile(point) {
        if (!Object.keys(this.tiles).includes(point.str)) {
            // console.log(`Grid.getTile(${point.str}): Tile does not exist`);
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
    populateGrid() {
        const dimensions = new Point(30,30);
        for (var y = -dimensions.y; y <= dimensions.y; y++) {
            for (var x = -dimensions.x; x <= dimensions.x; x++) {
                let tile = new Tile("grass");
                if (!this.getTile(new Point(x,y))) {
                    this.setTile(new Point(x,y),tile);
                }
                let distFromCenter = dist(new Point(x, y), new Point(0,0));
                if (distFromCenter > dimensions.x * 0.9) {
                    tile.typeId = "deep_water";
                } else {
                    if (x == 0 && y == 0) {
                        //central disc
                        let discCenter = new Point(x,y);
                        let centralDisc = discIntCoords(discCenter, 4);
                        centralDisc.forEach((point) => {
                            // let distance = dist(discCenter,point);
                            let discTile = new Tile(randElem(["grass","grass","grass","grass","flowered_grass"]));
                            discTile.position = point;
                            this.setTile(point,discTile);
                        });
                    } else if ((chance(0.02) && distFromCenter > 8)) {
                        // forest disc
                        let discCenter = new Point(x,y);
                        let forestDisc = discIntCoords(discCenter, 4.5);

                        forestDisc.forEach((point) => {
                            // let distance = dist(discCenter,point);
                            let discTile = new Tile(randElem(["grass","grass","grass","grass","flowered_grass"]));
                            discTile.position = point;
                            this.setTile(point,discTile);
                        });

                    } else if (chance(0.0015) && distFromCenter > 7) {
                        // clay disc

                    }
                }
            }
        }
    }
}