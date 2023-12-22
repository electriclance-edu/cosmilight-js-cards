/*
--------------
WORLD SETTINGS
--------------
*/
//noise stuff
//rarity of x


/*
World represents the two-dimensional grid of all grids. 
Players can travel between grids, but can only access one grids at a time.
*/
class World {
    constructor() {
        this.currentGridCoords = new Point(0,0);
        this.worldGrid = {}; // A grid of all grids.
        this.currentlyOpenedTileCoords = undefined;

        this.populateWorldGrid();
    }
    populateWorldGrid() {
        var debug_startingGrid = new Grid();
        debug_startingGrid.populateGrid();
        this.setGrid(new Point(0,0),debug_startingGrid);
        //steal world creation from cosmi-js
    }
    getCurrentlyOpenedTile() {
        return this.currentGrid.getTile(this.currentlyOpenedTileCoords);
    }
    setGrid(point,grid) {
        this.worldGrid[`${point.x},${point.y}`] = grid;
    }
    getGrid(point) {
        return this.worldGrid[`${point.x},${point.y}`];
    }
    get currentGrid() {
        return this.getGrid(this.currentGridCoords);
    }
    addCardToOpenedInventory(card) {
        this.currentlyOpenedInventory.addCard(card);
    }
    closeInventory() {
        GUIHandler.removeClassFromTileElem(this.currentlyOpenedTileCoords.x,this.currentlyOpenedTileCoords.y,"selectedTile");
        this.currentlyOpenedTileCoords = "none";
        GUIHandler.closeInventory();
    }
}