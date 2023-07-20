DataHandler.addObjectToLoad("StructureType","baseCosmilight",[
    {
        cardProperties: {
            id:"plainsTree",
            lore:{
                mainTitle:"Tree",
                subTitle:"",
                description:"Slowly absorbing, slowly producing.",
            },
            colorName:"worldObject",
            tags:["structure","natural"]
        },
        structureProperties: {
            amountOfSprites:1,
            stats:[
                new Stat("health",{value:20}),
                new Stat("integrity",{value:20,max:20})
            ],
            interactions:{
                "onSpawn":(e)=>{
                    e.invoker.getStat("health").max = e.invoker.getStat("integrity").value;
                },
                "changeStat":(e)=>{
                    gameEvent.target.getStat(gameEvent.stat).increment(gameEvent.amt,true);
                    e.invoker.getStat("health").max = e.invoker.getStat("integrity").value;
                }
            }
        }
    },
    {
        cardProperties: {
            id:"rock",
            lore:{
                mainTitle:"Rock",
                subTitle:"",
                description:"",
            },
            colorName:"worldObject",
            tags:["structure","natural"]
        },
        structureProperties: {
            amountOfSprites:1,
            stats:[
                new Stat("health",{value:50}),
                new Stat("integrity",{value:50,max:50})
            ],
            interactions:{
                "onSpawn":(e)=>{
                    e.invoker.getStat("health").max = e.invoker.getStat("integrity").value;
                },
                "changeStat":(e)=>{
                    gameEvent.target.getStat(gameEvent.stat).increment(gameEvent.amt,true);
                    e.invoker.getStat("health").max = e.invoker.getStat("integrity").value;
                }
            }
        }
    },
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
                new Stat("health",{value:100}),
                new Stat("integrity",{value:100,max:100})
            ],
            interactions:{
                "onSpawn":(e)=>{
                    e.invoker.getStat("health").max = e.invoker.getStat("integrity").value;
                },
                "changeStat":(e)=>{
                    gameEvent.target.getStat(gameEvent.stat).increment(gameEvent.amt,true);
                    e.invoker.getStat("health").max = e.invoker.getStat("integrity").value;
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
            id:"torchtree",
            lore:{
                mainTitle:"Torchtree",
                subTitle:"",
                description:"Bringer of heat to its floral brethren.",
            },
            colorName:"worldObject",
            tags:["structure","natural"]
        },
        structureProperties: {
            amountOfSprites:1,
            stats:[
                new Stat("light",{value:1,max:1}),
                new Stat("health",{value:20}),
                new Stat("integrity",{value:20,max:20})
            ],
            interactions:{
                "onSpawn":(e)=>{
                    e.invoker.getStat("health").max = e.invoker.getStat("integrity").value;
                    var x = e.invoker.position.x;
                    var y= e.invoker.position.y;
                    LightHandler.addLight(`#${x},${y}`,new LightPoint(x,y,{strength:1.5,waver:0.05,faintness:0.3}));
                },
                "changeStat":(e)=>{
                    gameEvent.target.getStat(gameEvent.stat).increment(gameEvent.amt,true);
                    e.invoker.getStat("health").max = e.invoker.getStat("integrity").value;
                }
            }
        }
    },
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
                new Stat("light",{value:8,max:10}),
                new Stat("heating",{value:9,max:10}),
            ],
            interactions:{
                "onSpawn":(e)=>{
                    var x = e.invoker.position.x;
                    var y= e.invoker.position.y;
                    LightHandler.addLight(`#${x},${y}`,new LightPoint(0,0,{strength:2,waver:0.12,color:new RGBA(255,100,50,0.1)}));
                },
                "onTick":(tickEvent)=>{
                    if (!tickEvent.interval(10)) {
                        return;
                    }
                    if (tickEvent.invoker.inventory.contains("#fuel")) {
                        tickEvent.invoker.tile.changeLightLevel(0.1);
                    } else {
                        tickEvent.invoker.tile.changeLightLevel(-0.1);
                    }
                }
            },
            amountOfSprites:1
        }
    }
])