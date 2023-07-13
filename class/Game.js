//Represents all the data behind a game that needs to be saved.
class Game {
    static current;

    constructor(world, player, tickHandler) {
        this.world = world;
        this.player = player;
        this.tickHandler = tickHandler;
        
        Game.current = this;
    }
    getPlayer() {
        return this.player;
    }
    getWorld() {
        return this.world;
    }
}