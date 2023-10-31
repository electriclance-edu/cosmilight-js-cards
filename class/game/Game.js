//Represents all the data behind a game that needs to be saved.
class Game {
    // Objects with an "onTick" interaction.
    static #current;
    #player; 
    #world;

    constructor() {
        Game.current = this;
        this.onTickObjects = [];
        this.#world = new World();
        this.#player = new Player();
        this.time = 0;

        setTimeout(()=>{
            GUIHandler.renderFrame();
        },16);
        setInterval(()=>{
            Game.#current.time++;
            Game.onTickObjects.forEach((obj)=>{
                GameEventHandler.onTick(obj,Game.#current.time);
            });
        },16);
    }
    static addOnTickObject(obj) {
        if (obj.interactions.hasOwnProperty("onTick")) {
            Game.onTickObjects.push(obj);
        }
    }
    static set current(obj) {
        Game.#current = obj;
    }
    static get current() {
        return Game.#current;
    }
    static get onTickObjects() {
        return Game.#current.onTickObjects;
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
    static get time() {
        return Game.#current.time;
    }
}