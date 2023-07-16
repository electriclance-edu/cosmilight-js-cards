//Represents all the data behind a game that needs to be saved.
class Game {
    static #current;
    #player; 
    #world;

    constructor(world, player, tickHandler) {
        this.#world = world;
        this.#player = player;
        this.tickHandler = tickHandler;
        
        Game.#current = this;
    }
    static set world(world) {
        Game.#current.#world = world;
    }
    static get board() {
        return Game.#current.#world.currentBoard;
    }
    static get world() {
        return Game.#current.#world;
    }
    static get currentTileCoords() {
        return Game.#current.#world.currentlyOpenedTileCoords;
    }
    static get currentTile() {
        return Game.#current.#world.getCurrentlyOpenedTile();
    }
    static set player(player) {
        Game.#current.#player = player;
    }
    static get player() {
        return Game.#current.#player;
    }
}