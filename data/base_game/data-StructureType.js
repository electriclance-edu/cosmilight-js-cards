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
                new Stat("integrity",{value:20})
            ]
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
            amountOfSprites:1
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
            amountOfSprites:1
        }
    },
    {
        cardProperties: {
            id:"fire",
            lore:{
                mainTitle:"Sapflame",
                subTitle:"",
                description:"Where light is born from plant.",
            },
            colorName:"worldObject",
            tags:["structure","artificial"],
        },
        structureProperties: {
            interactions:{
                "onTick":(tickEvent)=>{
                    if (!tickEvent.interval(10)) {
                        return;
                    }
                    if (tickEvent.self.inventory.contains("#fuel")) {
                        tickEvent.self.tile.changeLightLevel(0.1);
                    } else {
                        tickEvent.self.tile.changeLightLevel(-0.1);
                    }
                }
            },
            amountOfSprites:1
        }
    }
])