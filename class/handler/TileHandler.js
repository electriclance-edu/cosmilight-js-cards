class TileHandler {
    static canvas;
    static canvasCenter;
    static ctx;
    static images = {};
    static initialize() {
        var canvas = document.getElementById("TileCanvas");
        canvas.width = graphicsDisplaySize;
        canvas.height = graphicsDisplaySize;
        TileHandler.canvas = canvas;
        TileHandler.ctx = canvas.getContext("2d");;
        TileHandler.canvasCenter = new Point(TileHandler.canvas.width/2,TileHandler.canvas.height/2);

        TileHandler.loadResources();
    }
    static loadResources() {
        Object.values(TileType.tileTypes).forEach((type)=>{
            TileHandler.loadTileResources(type);
        });
    }
    static loadTileResources(type) {
        TileHandler.images[type.id] = [];
        type.getSpriteUrls().forEach((url)=>{
            var img = new Image();
            img.src = url;
            TileHandler.images[type.id].push(img);
        })
    }
    static canvasClear() {
        TileHandler.ctx.clearRect(0,0,TileHandler.canvas.width,TileHandler.canvas.height);
    }
    static renderTiles() {
        const sizeModifier = 2;
        const employedTileWidth = tileWidth * sizeModifier;
        const employedTileHeight = tileHeight * sizeModifier;
        TileHandler.canvasClear();

        const cullRadius = 1.5;
        const cullCornerA = new Point(
            Math.floor(-Game.player.location.x / sizeModifier + 1 - cullRadius), 
            Math.floor(Game.player.location.y / sizeModifier - cullRadius)
        );
        const cullCornerB = new Point(
            Math.ceil(-Game.player.location.x / sizeModifier + 1 + cullRadius), 
            Math.ceil(Game.player.location.y / sizeModifier + cullRadius)
        );
        
        for (var x = cullCornerA.x; x < cullCornerB.x; x++) {
            for (var y = cullCornerB.y; y > cullCornerA.y; y--) {
                let tile = Game.world.currentGrid.getTile(new Point(x,y));
                let center = new Point(x,y).multiply(employedTileWidth,employedTileHeight);
                let cameraCenter = Point.translate(TileHandler.canvasCenter,Game.player.location.getMultiplied(tileWidth,-tileHeight));
                let topLeftPos = Point.translate(cameraCenter,center);
            
                TileHandler.ctx.drawImage(
                    TileHandler.images[tile.typeId][tile.inherentNumber % tile.getType().amountOfSprites],
                    topLeftPos.x,
                    topLeftPos.y,
                    employedTileWidth * 1.5,
                    employedTileHeight * 1.5
                );
            }
        }
    }
}