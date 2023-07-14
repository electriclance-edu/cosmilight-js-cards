/*
--------------
WORLD SETTINGS
--------------
*/
//noise stuff
//rarity of x


/*
World represents the two-dimensional grid of all boards. Players can travel between boards, but can only access one board at a time.
*/
class World {
    constructor() {
        this.currentBoardCoords = new Point(0,0);
        this.worldBoard = {};
        this.currentlyOpenedInventory = "none";
        this.currentlyOpenedTileCoords = "none";

        this.populateWorldBoard();
    }
    populateWorldBoard() {
        var debug_startingBoard = new Board();
        debug_startingBoard.populateBoard();
        this.setBoard(0,0,debug_startingBoard);
        //steal world creation from cosmi-js
    }
    setBoard(x,y,board) {
        this.worldBoard[`${x},${y}`] = board;
    }
    getBoard(x,y) {
        return this.worldBoard[`${x},${y}`];
    }
    getCurrentBoard() {
        return this.getBoard(this.currentBoardCoords.x,this.currentBoardCoords.x);
    }
    addCardToOpenedInventory(card) {
        this.currentlyOpenedInventory.addCard(card);
    }
    closeInventory() {
        this.currrentlyOpenedInventory = "none";
        GUIHandler.removeClassFromTileElem(this.currentlyOpenedTileCoords.x,this.currentlyOpenedTileCoords.y,"selectedTile");
        this.currentlyOpenedTileCoords = new Point(0,0);
        GUIHandler.closeInventory();
    }
    openInventory(inventory) {
        this.currentlyOpenedInventory = inventory;
        this.currentlyOpenedInventory.renderElement = GUIHandler.ExternalInventoryElem;
        GUIHandler.displayInventory(inventory);
    }
}