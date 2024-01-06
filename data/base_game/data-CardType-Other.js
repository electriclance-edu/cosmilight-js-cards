DataHandler.addObjectToLoad("CardType","baseCosmilight",[
    {
        id:"spellpaper",
        lore:{
            superTitle:"Spell",
            mainTitle:"Paper",
            description:"Absorbs magic into itself for the creation of spells.",
            technical_description:"Can be turned into spells by Instruments.",
        },
        colorName:"item",
        tags:["item","spellpaper"]
    },
    {
        id:"lightfruit",
        lore:{
            superTitle:"Light",
            mainTitle:"Fruit",
            description:"Remnants of the blessing of light itself.",
            technical_description:"",
        },
        colorName:"item",
        tags:["item","spellpaper"]
    },
    {
        id:"debug_map",
        lore:{
            superTitle:"Debug",
            mainTitle:"Map",
            description:"",
            technical_description:"<span class='input'>Click</span> to open a default Plains area expedition.",
        },
        colorName:"item",
        tags:["item","spellpaper"],
        interactions:{
            "onCreation":(e)=>{
                e.invoker.externalInformation.bodyPart_activationState = false;
            },
            "onClick":(e)=>{
                console.log("debug_map detected onclick :)");
                // var area;
                // GUIHandler.displayArea(area);
            },
            "onPhysicsKeyHover":(e)=>{
                console.log(`debug_map detected onkeyhover, of key ${e.key} :)`);
                if (e.key == "Space") {
                    let state = e.invoker.externalInformation.bodyPart_activationState;
                    state = !e.invoker.externalInformation.bodyPart_activationState;
                    e.invoker.externalInformation.bodyPart_activationState = state;
                    
                    globalInitialize();
                    GUIHandler.toggleTab("EyeTab",PhysicsBodyHandler.getClientPos(e.body),state);

                    if (state) {
                        e.body.bounds.width = 500;
                        e.body.bounds.height = 500;
                        e.body.tags["immovable"] = true;
                        e.body.tags["visible"] = false;
                        PhysicsBodyHandler.retryCollisionForce(e.body);
                    } else {
                        e.body.bounds.width = 150;
                        e.body.bounds.height = 150;
                        e.body.tags["immovable"] = false;
                        e.body.tags["visible"] = true;
                    }
                }
                // var area;
                // GUIHandler.displayArea(area);
            }
        }
    },
    {
        id:"expend_knowledge",
        lore:{
            superTitle:"Unlock",
            mainTitle:"Ability",
            description:"The experience you have gathered guides you forward.",
            technical_description:"<span class='input'>Drag and drop</span> anywhere to consume your experience and unlock something new.",
        },
        colorName:"item",
        tags:["item","spellpaper"],
        interactions:{
            "onClick":(e)=>{
                let info = Game.player.getCurrentKnowledgeUnlockInfo();
                GUIHandler.displaySelection(info.cards,info.lore,undefined,true);
            }
        }
    },
])