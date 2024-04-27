//Represents all the data behind a game that needs to be saved.
class Game {
    // Objects with an "onTick" interaction.
    static #current;
    #player; 
    #world;

    constructor() {
        Game.current = this;
        this.time = 0;
    }
    start() {
        setTimeout(()=>{
            // Start rendering frames
            GUIHandler.renderFrame();
        },16);

        // Game time loop
        setInterval(()=>{
            Game.#current.time++;
        },16);
    }
    static set current(obj) {
        Game.#current = obj;
    }
    static get current() {
        return Game.#current;
    }
    static set world(world) {
        Game.#current.#world = world;
    }
    static get grid() {
        return Game.#current.#world.currentGrid;
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
    static get time() {
        return Game.#current.time;
    }
}