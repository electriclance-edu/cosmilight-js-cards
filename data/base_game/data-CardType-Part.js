DataHandler.addObjectToLoad("CardType","baseCosmilight",[
    {
        id:"heart",
        lore:{
            superTitle:"Old",
            mainTitle:"Heart",
            description:"You can barely feel it throb.",
            technical_description:`<span class='input'>Space</span> while hovering to activate.\n
                                   Produces blood.`,
        },
        colorName:"part",
        tags:["part","starCard"],
        interactions:{
            "onPhysicsSpawn":(e)=>{

            },
            "onPhysicsKeyHover":(e)=>{
            }
        }
    },
    {
        id:"eye",
        lore:{
            superTitle:"Half-Opened",
            mainTitle:"Eyeball",
            description:"Be wary of what you let into the window of the soul.",
            technical_description:`<span class='input'>Space</span> while hovering to activate.\n
                                   Allows you to see the world.`,
        },
        colorName:"item",
        tags:["item","spellpaper"],
        interactions:{
            "onCreation":(e)=>{
                e.invoker.externalInformation.bodyPart_activationState = false;
            },
            "onClick":(e)=>{
            },
            "onPhysicsKeyHover":(e)=>{
                if (e.key == "Space") {
                    // let state = e.invoker.externalInformation.bodyPart_activationState;
                    // state = !e.invoker.externalInformation.bodyPart_activationState;
                    // e.invoker.externalInformation.bodyPart_activationState = state;
                    

                    // if (state) {
                    //     e.body.bounds.rad = graphicsDisplaySize / 2 - 20;
                    //     e.body.tags["immovable"] = true;
                    //     e.body.tags["visible"] = false;
                    //     PhysicsBodyHandler.retryCollisionForce(e.body);
                    // } else {
                    //     e.body.bounds.rad = 100;
                    //     e.body.tags["immovable"] = false;
                    //     e.body.tags["visible"] = true;
                    // }
                }
            }
        }
    },
])