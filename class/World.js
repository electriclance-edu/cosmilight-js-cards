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
        this.currentlyOpenedTileCoords = "none";

        this.populateWorldBoard();
    }
    populateWorldBoard() {
        var debug_startingBoard = new Board();
        debug_startingBoard.populateBoard();
        this.setBoard(new Point(0,0),debug_startingBoard);
        //steal world creation from cosmi-js
    }
    getCurrentlyOpenedTile() {
        return this.currentBoard.getTile(this.currentlyOpenedTileCoords);
    }
    setBoard(point,board) {
        this.worldBoard[`${point.x},${point.y}`] = board;
    }
    getBoard(point) {
        return this.worldBoard[`${point.x},${point.y}`];
    }
    get currentBoard() {
        return this.getBoard(this.currentBoardCoords);
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