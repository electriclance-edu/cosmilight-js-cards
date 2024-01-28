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
            interactions[eventObject.type](eventObject);
            // if (eventObject.type == "onSelection") {
            //     console.log(interactions[eventObject.type]);
            // }
        } else {
            // console.warn(`GameEventHandler.callInteractions(): Attempted to call interaction of type ${eventObject.type}, however interactions object given has no such type.`,eventObject,interactions);
        }
    }
    static validEventArguments(...args) {
        return args.every((elem)=>{
            return !(elem === undefined)
        });
    }
    static verifyArgs(requiredArgs,type) {
        if (!GameEventHandler.validEventArguments(...requiredArgs)) {
            console.warn(`Event ${type} attempted to trigger, however arguments are invalid.`,requiredArgs);
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
    static onRemove(target) {
        var gameEvent = {
            type:"onRemove",
            target:target
        };
        
        GameEventHandler.verifyArgs([target],gameEvent.type);

        GameEventHandler.callInteractions(gameEvent,target.interactions);
    }
    static onCreation(invoker) {
        var gameEvent = {
            type:"onCreation",
            invoker:invoker
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
    // When a Selection event invoked by something succeeds.
    static onSelectionInvocationSuccess(invoker) {
        var gameEvent = {
            type:"onSelectionInvocationSuccess",
            invoker:invoker
        };

        GameEventHandler.verifyArgs([invoker],gameEvent.type);

        GameEventHandler.callInteractions(gameEvent,invoker.interactions);
    }
    // When a Selection event invoked by something is cancelled, or fails.
    static onSelectionInvocationFailure(invoker) {
        var gameEvent = {
            type:"onSelectionInvocationFailure",
            invoker:invoker
        };

        GameEventHandler.verifyArgs([invoker],gameEvent.type);

        GameEventHandler.callInteractions(gameEvent,invoker.interactions);
    }
    // When a card during a Selection event is selected.
    static onSelect(target) {
        var gameEvent = {
            type:"onSelect",
            target:target
        };

        GameEventHandler.verifyArgs([target],gameEvent.type);

        GameEventHandler.callInteractions(gameEvent,target.interactions);
    }
    static onPhysicsKeyHover(invoker,body,key) {
        var gameEvent = {
            type:"onPhysicsKeyHover",
            invoker:invoker,
            body:body,
            key:key
        };

        GameEventHandler.verifyArgs([invoker,body,key],gameEvent.type);

        GameEventHandler.callInteractions(gameEvent,invoker.interactions);
    }
    static onMouseUp(invoker,button) {
        var gameEvent = {
            type:"onMouseUp",
            invoker:invoker,
            button:button
        };

        GameEventHandler.verifyArgs([invoker,button],gameEvent.type);

        GameEventHandler.callInteractions(gameEvent,invoker.interactions);
    }
    static onMouseDown(invoker,button) {
        var gameEvent = {
            type:"onMouseDown",
            invoker:invoker,
            button:button
        };

        GameEventHandler.verifyArgs([invoker,button],gameEvent.type);

        GameEventHandler.callInteractions(gameEvent,invoker.interactions);
    }
    stati
    static onClick(invoker,button) {
        var gameEvent = {
            type:"onClick",
            invoker:invoker,
            button:button
        };

        GameEventHandler.verifyArgs([invoker,button],gameEvent.type);

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