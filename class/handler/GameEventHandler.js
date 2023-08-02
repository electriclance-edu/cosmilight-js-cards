class GameEventHandler {
    static defaultInteractions = {
        "changeStat":(gameEvent)=>{
            gameEvent.target.getStat(gameEvent.stat).increment(gameEvent.amt,true);
        }
    };
    static callInteractions(eventObject,interactions) {
        if (!interactions) {
            return;
        }

        if (interactions.hasOwnProperty(eventObject.type)) {
            if (eventObject.type == "onSelection") {
                console.log(interactions[eventObject.type]);
            }
            interactions[eventObject.type](eventObject);
        } else {
            // console.warn(`GameEventHandler.callInteractions(): Attempted to call interaction of type ${eventObject.type}, however interactions object given has no such type.`,eventObject,interactions);
        }
    }
    static validEventArguments(...args) {
        return args.every((elem)=>!!elem);
    }
    static verifyArgs(args,type) {
        if (!GameEventHandler.validEventArguments(...args)) {
            console.error(`Event ${type} attempted to trigger, however arguments are invalid.`,args)
        }
    }
    static onTick(invoker,time) {
        var gameEvent = {
            type:"onTick",
            invoker:invoker,
            time:time
        };
        
        GameEventHandler.verifyArgs([invoker],gameEvent.type);

        GameEventHandler.callInteractions(gameEvent,invoker.interactions);
    }
    static onSpawn(invoker) {
        var gameEvent = {
            type:"onSpawn",
            invoker:invoker
        };
        
        GameEventHandler.verifyArgs([invoker],gameEvent.type);

        GameEventHandler.callInteractions(gameEvent,invoker.interactions);
    }
    static changeStat(target,stat,amt) {
        var gameEvent = {
            type:"changeStat",
            target:target,
            stat:stat,
            amt:amt
        };

        GameEventHandler.verifyArgs([target,stat,amt],gameEvent.type);

        GameEventHandler.callInteractions(gameEvent,target.interactions);
    }
    static onSelect(target) {
        var gameEvent = {
            type:"onSelect",
            target:target
        };

        GameEventHandler.verifyArgs([target],gameEvent.type);

        GameEventHandler.callInteractions(gameEvent,target.interactions);
    }
    static onClick(invoker) {
        var gameEvent = {
            type:"onClick",
            invoker:invoker
        };

        GameEventHandler.verifyArgs([invoker],gameEvent.type);

        GameEventHandler.callInteractions(gameEvent,invoker.interactions);
    }
    static onDrop(invoker,target) {
        var gameEvent = {
            type:"onDrop",
            invoker:invoker,
            target:target,
        };

        GameEventHandler.verifyArgs([invoker,target],gameEvent.type);

        GameEventHandler.callInteractions(gameEvent,invoker.interactions);

        gameEvent.type = "!onDrop";
        GameEventHandler.callInteractions(gameEvent,target.interactions);
    }
}