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
                if (e.key == "Space") {
                        EffectHandler.addEffect(new Effect({
                            lifespan:100,
                            // startPt:mpos, linearAngle:randInt(360), displacement:100 + randInt(20) * explosionSize,
                            startPt:e.body.phys.pos.copy(), endPt:new Point(0,window.innerHeight / 2),
                            startSize:10, endSize:30,
                            startOpacity:1, endOpacity:0,
                            spinSpeed:12,
                            lightPointProperties:{
                                strength:75,
                                waver:0.1,
                                faintness:1
                            }
                        }));
                        for (var i = 0; i < 3; i++) {
                            EffectHandler.addEffect(new Effect({
                                lifetime:-randInt(10),
                                lifespan:30 + randInt(10),
                                startPt:e.body.phys.pos.copy(), linearAngle:randInt(360), displacement:100 + randInt(50),
                                // startPt:mpos, endPt:new Point(0,0),
                                startSize:3, endSize:5 + randInt(5),
                                startOpacity:0.3, endOpacity:0,
                                spinSpeed:12,
                                lightPointProperties:{
                                    strength:30,
                                    waver:0.1,
                                    faintness:1
                                }
                            }));
                            EffectHandler.addEffect(new Effect({
                                lifetime:-randInt(10),
                                lifespan:10 + randInt(20),
                                startPt:e.body.phys.pos.copy(), linearAngle:randInt(360), displacement:150 + randInt(50),
                                // startPt:mpos, endPt:new Point(0,0),
                                startSize:1, endSize:3 + randInt(5),
                                startOpacity:0.3, endOpacity:0,
                                spinSpeed:0,
                                lightPointProperties:{
                                    strength:30,
                                    waver:0.1,
                                    faintness:1
                                }
                            }));
                            EffectHandler.addEffect(new Effect({
                                lifetime:-randInt(10),
                                lifespan:50 + randInt(20),
                                startPt:e.body.phys.pos.copy(), linearAngle:randInt(360), displacement:100 + randInt(50),
                                // startPt:mpos, endPt:new Point(0,0),
                                startSize:5, endSize:75 + randInt(50),
                                startOpacity:0.0005 + randFloat(0.01), endOpacity:0,
                                spinSpeed:12,
                                lightPointProperties:{
                                    strength:100,
                                    waver:0.1,
                                    faintness:1
                                }
                            }));
                        }
                    }
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