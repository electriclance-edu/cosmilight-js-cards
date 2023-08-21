DataHandler.addObjectToLoad("StructureType","baseCosmilight",[
    {
        cardProperties: {
            id:"plainsTree",
            lore:{
                mainTitle:"Tree",
                subTitle:"",
                description:"Reaches out to the sunless sky for starlight.",
            },
            colorName:"worldObject",
            tags:["structure","natural"]
        },
        structureProperties: {
            amountOfSprites:2,
            stats:[
                // new Stat("health",{value:3}),
                // new Stat("integrity",{value:3,max:3})
            ],
            interactions:{
                // "onSpawn":(e)=>{
                //     e.invoker.getStat("health").max = e.invoker.getStat("integrity").value;
                // },
                // "changeStat":(e)=>{
                //     gameEvent.target.getStat(gameEvent.stat).increment(gameEvent.amt,true);
                //     e.invoker.getStat("health").max = e.invoker.getStat("integrity").value;
                // }
            }
        }
    },
    // {
    //     cardProperties: {
    //         id:"rock",
    //         lore:{
    //             mainTitle:"Rock",
    //             subTitle:"",
    //             description:"",
    //         },
    //         colorName:"worldObject",
    //         tags:["structure","natural"]
    //     },
    //     structureProperties: {
    //         amountOfSprites:1,
    //         stats:[
    //             new Stat("health",{value:50}),
    //             new Stat("integrity",{value:50,max:50})
    //         ],
    //         interactions:{
    //             "onSpawn":(e)=>{
    //                 e.invoker.getStat("health").max = e.invoker.getStat("integrity").value;
    //             },
    //             "changeStat":(e)=>{
    //                 gameEvent.target.getStat(gameEvent.stat).increment(gameEvent.amt,true);
    //                 e.invoker.getStat("health").max = e.invoker.getStat("integrity").value;
    //             }
    //         }
    //     }
    // },
    {
        cardProperties: {
            id:"boulder",
            lore:{
                mainTitle:"Boulder",
                subTitle:"",
                description:"",
            },
            colorName:"worldObject",
            tags:["structure","natural"]
        },
        structureProperties: {
            amountOfSprites:1,
            stats:[
                // new Stat("health",{value:100}),
                // new Stat("integrity",{value:100,max:100})
            ],
            interactions:{
                // "onSpawn":(e)=>{
                //     e.invoker.getStat("integrity").value = randInt(20) + 20;
                //     e.invoker.getStat("health").max = e.invoker.getStat("integrity").value;
                // },
                // "changeStat":(e)=>{
                //     gameEvent.target.getStat(gameEvent.stat).increment(gameEvent.amt,true);
                //     e.invoker.getStat("health").max = e.invoker.getStat("integrity").value;
                // },
                // "onTick":(tickEvent)=>{
                //     // if (tickEvent.time % 1 != 0) {
                //     //     return;
                //     // }
                //     tickEvent.invoker.getStat("health").increment(-0.05);
                //     // if (tickEvent.invoker.inventory.contains("#fuel")) {
                //     //     tickEvent.invoker.tile.changeLightLevel(0.1);
                //     // } else {
                //     //     tickEvent.invoker.tile.changeLightLevel(-0.1);
                //     // }
                // }
            }
        }
    },
    {
        cardProperties: {
            id:"clay",
            lore:{
                mainTitle:"Clay",
                subTitle:"",
                description:"",
            },
            colorName:"worldObject",
            tags:["structure","natural"]
        },
        structureProperties: {
            amountOfSprites:3,
            stats:[
                new Stat("health",{value:10,max:10})
            ],
            interactions:{
                "changeStat":(e)=>{
                    gameEvent.target.getStat(gameEvent.stat).increment(gameEvent.amt,true);
                }
            }
        }
    },
    {
        cardProperties: {
            id:"plainsFoliage",
            lore:{
                superTitle:"Old",
                mainTitle:"Foliage",
                description:"Relies on the light from a Hearthtree to grow.",
            },
            colorName:"worldObject",
            tags:["structure","natural"]
        },
        structureProperties: {
            amountOfSprites:4,
            stats:[
                // new Stat("health",{value:1,max:1}),
            ],
            interactions:{}
        }
    },
    {
        cardProperties: {
            id:"monarchtree",
            lore:{
                mainTitle:"Monarch",
                subTitle:"Tree",
                description:"Its ancient leaves sing of a bygone era of light and life.",
            },
            colorName:"worldObject",
            tags:["structure","natural","structure-giant"]
        },
        structureProperties: {
            amountOfSprites:1,
            stats:[
                // new Stat("health",{value:5,max:5}),
            ],
            interactions:{
                "onSpawn":(e)=>{
                    var x = e.invoker.position.x;
                    var y = e.invoker.position.y;
                    LightHandler.addLight(`#${x},${y}`,new LightPoint(x,y,{strength:3.5,waver:0.05,faintness:0.9}));
                    // LightHandler.addLight(`#${x},${y}`,new LightPoint(x,y,{strength:4,waver:0.05,faintness:0.0001}));
                }
            }
        }
    },
    {
        cardProperties: {
            id:"hearthtree",
            lore:{
                mainTitle:"Hearth",
                subTitle:"Tree",
                description:"Overflowing with warmth.",
            },
            colorName:"worldObject",
            tags:["structure","natural","structure-large"]
        },
        structureProperties: {
            amountOfSprites:1,
            stats:[
                new Stat("slumber",{value:3,max:3}),
                new Stat("fruitsGiven",{value:0,max:1}),
            ],
            interactions:{
                "changeStat":(e)=>{
                    e.target.getStat(e.stat).increment(e.amt,true);
                    if (e.stat == "slumber") {
                        if (e.target.getStat("slumber").value == 0 && e.target.getStat("fruitsGiven").value == 0) {
                            e.target.getStat("fruitsGiven").increment(1);
                            Game.player.hand.addCard(new Card("lightfruit"));
                            Game.player.hand.addCard(new Card("lightfruit"));
                        }
                    }
                },
                "onSpawn":(e)=>{
                    var x = e.invoker.position.x;
                    var y = e.invoker.position.y;
                    LightHandler.addLight(`#${x},${y}`,new LightPoint(x,y,{strength:3,waver:0.05,faintness:0.8}));
                }
            }
        }
    },
    {
        cardProperties: {
            id:"rat",
            lore:{
                mainTitle:"rat",
                subTitle:"",
                description:"squonk",
            },
            colorName:"worldObject",
            tags:["structure","natural","stupid"]
        },
        structureProperties: {
            amountOfSprites:1,
            stats:[
                new Stat("hairLuxuriousness",{value:200,max:200}),
                new Stat("health",{value:250,max:500}),
                new Stat("rat",{value:500,max:500}),
                new Stat("light",{value:50,max:50}),
                new Stat("integrity",{value:250,max:250})
            ],
            interactions:{
                "onSpawn":(e)=>{
                    e.invoker.getStat("health").max = e.invoker.getStat("integrity").value;
                    var x = e.invoker.position.x;
                    var y= e.invoker.position.y;
                    LightHandler.addLight(`#${x},${y}`,new LightPoint(x,y,{strength:5.5,waver:1,faintness:1}));
                }
            }
        }
    },
    {
        cardProperties: {
            id:"smalllake", 
            lore:{
                mainTitle:"Wellspring",
                description:"An old spring, overflowing with fresh water from the underground.",
            },
            colorName:"worldObject",
            tags:["structure","natural"]
        },
        structureProperties: {
            amountOfSprites:1,
            stats:[
                new Stat("water",{value:50,max:50}),
            ],
            interactions:{
                // "onSpawn":(e)=>{
                //     var x = e.invoker.position.x;
                //     var y= e.invoker.position.y;
                //     LightHandler.addLight(`#${x},${y}`,new LightPoint(
                //         x,y,
                //         {
                //             strength:2,
                //             waver:0.05,
                //             faintness:0.5
                //         }
                //     ));
                // },
            }
        }
    },
    {
        cardProperties: {
            id:"taproot", 
            lore:{
                mainTitle:"Taproot",
                subTitle:"",
                description:"Bringer of heat to its fungal brethren.",
            },
            colorName:"worldObject",
            tags:["structure","natural"]
        },
        structureProperties: {
            amountOfSprites:4,
            stats:[
                new Stat("health",{value:10}),
                new Stat("light",{value:1,max:1}),
                new Stat("integrity",{value:10,max:10}),
                new Stat("sap",{value:3,max:3}),
                new Stat("water",{value:3,max:3}),
                new Stat("cycle",{value:1,max:4}),
                new Stat("cycleSpeed",{value:7,max:10}),
            ],
            interactions:{
                "onSpawn":(e)=>{
                    e.invoker.getStat("cycleSpeed").value += randFloat(3);
                    e.invoker.getStat("health").max = e.invoker.getStat("integrity").value;
                    var x = e.invoker.position.x;
                    var y= e.invoker.position.y;
                    LightHandler.addLight(`#${x},${y}`,new LightPoint(
                        x,y,
                        {
                            strength:1,
                            waver:0.05,
                            faintness:0.2
                        }
                    ));
                },
                "changeStat":(e)=>{
                    e.target.getStat(e.stat).increment(e.amt,true);
                    e.target.getStat("health").max = e.target.getStat("integrity").value;
                },
                "onTick":(tickEvent)=>{
                    if (tickEvent.time % 40 == 0) {
                        var cycle = tickEvent.invoker.getStat("cycle");
                        cycle.cyclicIncrement(1);

                        switch (cycle.value) {
                            case 1:
                                //produce water
                                GameEventHandler.changeStat(tickEvent.invoker,"water",0.2);
                                break;
                            case 2:
                                //consume water, produce sap
                                if (tickEvent.invoker.getStat("water").value > tickEvent.invoker.getStat("water").max / 2 && tickEvent.invoker.getStat("sap").value < tickEvent.invoker.getStat("sap").max) {
                                    GameEventHandler.changeStat(tickEvent.invoker,"water",-0.15);
                                    GameEventHandler.changeStat(tickEvent.invoker,"sap",0.1);
                                }
                                break;
                            case 3:
                                //consume sap, produce satisfaction
                                
                                //update light/heat
                                break;
                        }
                    }
                    // if (tickEvent.invoker.inventory.contains("#fuel")) {
                    //     tickEvent.invoker.tile.changeLightLevel(0.1);
                    // } else {
                    //     tickEvent.invoker.tile.changeLightLevel(-0.1);
                    // }
                }
            }
        }
    },
    // {
    //     cardProperties: {
    //         id:"torchtree", 
    //         lore:{
    //             mainTitle:"Torchtree",
    //             subTitle:"",
    //             description:"Bringer of heat to its floral brethren.",
    //         },
    //         colorName:"worldObject",
    //         tags:["structure","natural"]
    //     },
    //     structureProperties: {
    //         amountOfSprites:1,
    //         stats:[
    //             new Stat("light",{value:1,max:1}),
    //             new Stat("health",{value:20}),
    //             new Stat("integrity",{value:20,max:20}),
    //             new Stat("sap",{value:0,max:10}),
    //             new Stat("water",{value:0,max:10}),
    //             new Stat("cycle",{value:1,max:4}),
    //         ],
    //         interactions:{
    //             "onSpawn":(e)=>{
    //                 e.invoker.getStat("health").max = e.invoker.getStat("integrity").value;
    //                 var x = e.invoker.position.x;
    //                 var y= e.invoker.position.y;
    //                 LightHandler.addLight(`#${x},${y}`,new LightPoint(x,y,{strength:1.5,waver:0.05,faintness:0.3}));
    //             },
    //             "changeStat":(e)=>{
    //                 e.target.getStat(e.stat).increment(e.amt,true);
    //                 e.target.getStat("health").max = e.target.getStat("integrity").value;
    //             },
    //             "onTick":(tickEvent)=>{
    //                 // every two seconds, update cycle
    //                 // add an innate cyclespeed modifier to all cyclic structures, slightly changes how long a cycle takes
    //                 if (tickEvent.time % 40 == 0) {
    //                     var cycle = tickEvent.invoker.getStat("cycle");
    //                     cycle.increment(1,false);
    //                     let newValue = (cycle.value > cycle.max) ? 1 : cycle.value;
    //                     cycle.setValue(newValue);

    //                     switch (cycle.value) {
    //                         case 1:
    //                             //produce water
    //                             GameEventHandler.changeStat(tickEvent.invoker,"water",0.5);
    //                             break;
    //                         case 2:
    //                             //consume water, produce sap
    //                             if (tickEvent.invoker.getStat("water").value > 5) {
    //                                 GameEventHandler.changeStat(tickEvent.invoker,"water",-0.4);
    //                                 GameEventHandler.changeStat(tickEvent.invoker,"sap",0.3);
    //                             }
    //                             break;
    //                         case 3:
    //                             //consume sap, produce satisfaction
                                
    //                             //update light/heat
    //                             break;
    //                     }
    //                 }
    //                 // if (tickEvent.invoker.inventory.contains("#fuel")) {
    //                 //     tickEvent.invoker.tile.changeLightLevel(0.1);
    //                 // } else {
    //                 //     tickEvent.invoker.tile.changeLightLevel(-0.1);
    //                 // }
    //             }
    //         }
    //     }
    // },
    {
        cardProperties: {
            id:"fire",
            lore:{
                mainTitle:"Sapflame",
                subTitle:"",
                description:"Where light is born from destruction.",
            },
            colorName:"worldObject",
            tags:["structure","artificial"]
        },
        structureProperties: {
            stats:[
                new Stat("light",{value:8,max:15}),
                new Stat("heating",{value:5,max:30}),
            ],
            interactions:{
                "onSpawn":(e)=>{
                    var x = e.invoker.position.x;
                    var y= e.invoker.position.y;
                    LightHandler.addLight(`#${x},${y}`,new LightPoint(0,0,{strength:2,waver:0.12,color:new RGBA(255,100,50,0.1)}));
                },
                "onTick":(tickEvent)=>{
                    // if (tickEvent.time % 20 != 0) {
                    //     return;
                    // }
                    tickEvent.invoker.getStat("heating").increment(0.05);
                    // if (tickEvent.invoker.inventory.contains("#fuel")) {
                    //     tickEvent.invoker.tile.changeLightLevel(0.1);
                    // } else {
                    //     tickEvent.invoker.tile.changeLightLevel(-0.1);
                    // }
                }
            },
            amountOfSprites:1
        }
    }
])