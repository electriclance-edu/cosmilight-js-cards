class GameEventHandler {
    static defaultInteractions = {
        "changeStat":(gameEvent)=>{
            gameEvent.target.getStat(gameEvent.stat).increment(gameEvent.amt,true);
        }
    };
    static callInteractions(eventObject,interactions) {
        if (interactions.hasOwnProperty(eventObject.type)) {
            interactions[eventObject.type](eventObject);
        } else {
            // console.warn(`GameEventHandler.callInteractions(): Attempted to call interaction of type ${eventObject.type}, however interactions object given has no such type.`,eventObject,interactions);
        }
    }
    static validEventArguments(...args) {
        return args.every((elem)=>!!elem);
    }
    static onTick(invoker,time) {
        var gameEvent = {
            type:"onTick",
            invoker:invoker,
            time:time
        };
        
        if (!GameEventHandler.validEventArguments(invoker)) {
            console.warn(`Event ${gameEvent.type} attempted to trigger, however arguments are invalid.`,arguments)
            return;
        }

        GameEventHandler.callInteractions(gameEvent,invoker.interactions);
    }
    static onSpawn(invoker) {
        var gameEvent = {
            type:"onSpawn",
            invoker:invoker
        };
        
        if (!GameEventHandler.validEventArguments(invoker)) {
            console.warn(`Event ${gameEvent.type} attempted to trigger, however arguments are invalid.`,arguments)
            return;
        }

        GameEventHandler.callInteractions(gameEvent,invoker.interactions);
    }
    static changeStat(target,stat,amt) {
        var gameEvent = {
            type:"changeStat",
            target:target,
            stat:stat,
            amt:amt
        };

        if (!GameEventHandler.validEventArguments(target,stat,amt)) {
            console.warn(`Event ${gameEvent.type} attempted to trigger, however arguments are invalid.`,arguments)
            return;
        }

        GameEventHandler.callInteractions(gameEvent,target.interactions);
    }
    static onDrop(invoker,target) {
        var gameEvent = {
            type:"onDrop",
            invoker:invoker,
            target:target,
        };

        if (!GameEventHandler.validEventArguments(invoker,target)) {
            console.warn(`Event ${gameEvent.type} attempted to trigger, however arguments are invalid.`,arguments)
            return;
        }

        GameEventHandler.callInteractions(gameEvent,invoker.interactions);

        gameEvent.type = "!onDrop";
        GameEventHandler.callInteractions(gameEvent,target.interactions);
    }
}