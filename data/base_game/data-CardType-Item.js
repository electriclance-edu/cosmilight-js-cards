DataHandler.addObjectToLoad("CardType","baseCosmilight",[
    // Increases the player's liquidStorage stat by 10.
    {
        id:"liquid_ampoule",
        lore:{
            superTitle:"liquid",
            mainTitle:"ampoule",
            description:"A water-tight container for anything that flows.",
        },
        colorName:"storage",
        tags:["storage"],
        stats:[
            new Stat("liquidStorage",{value:10})
        ]
    },
    // Stores 6 items.
    {
        id:"basic_bag",
        lore:{
            superTitle:"Basic",
            mainTitle:"Bag",
            description:"",
            technical_description:"<span class='input'>Click</span> to open this bag.",
        },
        colorName:"storage",
        tags:["storage"],
        stats:[
            new Stat("cardStorageCapacity",{value:10})
        ],
        other:{
            inventory:new Inventory()
        },
        interactions:{
            "onClick":(e)=>{
                GUIHandler.displayBag(this.other.inventory);
            }
        }
    },
    //milo everyday
    {
        id:"breakfast",
        lore:{
            mainTitle:"break",
            subTitle:"fast",
            description:"every day.",
        },
        colorName:"item",
        tags:["item"]
    },
    {
        id:"sap",
        lore:{
            superTitle:"sticky",
            mainTitle:"sap",
            description:"Plant blood, so to speak.",
        },
        colorName:"item",
        tags:["item"]
    },
    {
        id:"fiber",
        lore:{
            mainTitle:"fiber",
            description:"Plant material, useful for crafting.",
        },
        colorName:"item",
        tags:["item"]
    },
    {
        id:"wood",
        lore:{
            mainTitle:"wood",
            description:"Tough plant material, useful for building.",
        },
        colorName:"item",
        tags:["item"]
    },
    {
        id:"wet_clay",
        lore:{
            superTitle:"Wet",
            mainTitle:"Clay",
            description:"Soft, moldable material for ceramic.",
        },
        colorName:"item",
        tags:["item"]
    },
    {
        id:"ceramic",
        lore:{
            mainTitle:"Ceramic",
            description:"Tough material for making pottery.",
        },
        colorName:"item",
        tags:["item"]
    },
    {
        id:"stone",
        lore:{
            mainTitle:"Stone",
            description:"Perhaps the start of a mountain.",
        },
        colorName:"item",
        tags:["item"]
    },
    {
        id:"metal",
        lore:{
            mainTitle:"Metal",
            subTitle:"Nuggets",
            description:"Small globs of metal for little creations.",
        },
        colorName:"item",
        tags:["item"]
    },
    {
        id:"memoryblume",
        lore:{
            mainTitle:"Memory",
            subTitle:"Blume",
            description:"Flowers that glow with a faint, ghostly green.",
            technical_description:"Can be broken down into knowledge.",
        },
        colorName:"item",
        tags:["item"]
    },
    {
        id:"large_leaf",
        lore:{
            superTitle:"Large",
            mainTitle:"Leaf",
            technical_description:"Can be broken down into fiber.",
        },
        colorName:"item",
        tags:["item"]
    },
    {
        id:"waterfruit",
        lore:{
            superTitle:"Moist",
            mainTitle:"Fruit",
            technical_description:"Can be broken down into water.",
        },
        colorName:"item",
        tags:["item"]
    },
    {
        id:"torchberry",
        lore:{
            superTitle:"Torch",
            mainTitle:"Berries",
            technical_description:"Can be broken down into a small amount of glow.",
        },
        colorName:"item",
        tags:["item"]
    },
    {
        id:"pebble",
        lore:{
            mainTitle:"pebble",
            description:"pebble!",
        },
        colorName:"item",
        tags:["item"],
        interactions:{
            // "onClick":(e)=>{
            //     let inv = e.invoker.inventory;
            //     if (inv.countOf(e.invoker.type.id) >= 2) {
            //         inv.addCard(new Card("breakfast"));
            //         inv.removeOfId(e.invoker.type.id,2);
            //     }
            // }
        }
    },
])