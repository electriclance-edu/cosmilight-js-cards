DataHandler.addObjectToLoad("CardType","baseCosmilight",[
    {
        id:"heart",
        lore:{
            mainTitle:"Heart",
            description:"ba dum ba dum ba dum",
        },
        colorName:"part",
        tags:["part","starCard"]
    },
    {
        id:"eye",
        lore:{
            superTitle:"Half-Opened",
            mainTitle:"Eyeball",
            description:"Be wary of what you let into the window of the soul.",
            technical_description:`<span class='input'>Space</span> while hovering to activate this body part.\n
                                   Allows you to see the world.`,
        },
        colorName:"item",
        tags:["item","spellpaper"],
        interactions:{
            "onCreation":(e)=>{
                e.invoker.externalInformation.bodyPart_activationState = false;
            },
            "onClick":(e)=>{
                // var area;
                // GUIHandler.displayArea(area);
            },
            "onPhysicsKeyHover":(e)=>{
                if (e.key == "Space") {
                    let state = e.invoker.externalInformation.bodyPart_activationState;
                    state = !e.invoker.externalInformation.bodyPart_activationState;
                    e.invoker.externalInformation.bodyPart_activationState = state;
                    
                    GUIHandler.toggleTab("EyeTab",PhysicsBodyHandler.getClientPos(e.body),state);
                    recalcGraphicsLayer();
                    // globalInitialize();

                    if (state) {
                        e.body.bounds.rad = graphicsDisplaySize / 2;
                        e.body.tags["immovable"] = true;
                        e.body.tags["visible"] = false;
                        PhysicsBodyHandler.retryCollisionForce(e.body);
                    } else {
                        e.body.bounds.rad = 75;
                        e.body.tags["immovable"] = false;
                        e.body.tags["visible"] = true;
                    }
                }
                // var area;
                // GUIHandler.displayArea(area);
            }
        }
    },
])