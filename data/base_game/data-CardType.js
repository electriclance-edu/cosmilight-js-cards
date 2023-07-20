DataHandler.addObjectToLoad("CardType","baseCosmilight",[
    // {
    //     id:"template",
    //     lore:{
    //         mainTitle:"",
    //         subTitle:"",
    //         description:"",
    //     },
    //     colorName:"",
    //     tags:[],
    //     interactions:[
    //         new Interaction({
    //             triggers:["onCast"],
    //             consequences:[new Consequence()]
    //         }),
    //     ]
    // },
    
    // Increases the player's liquidStorage stat by 10.
    {
        id:"flask",
        lore:{
            superTitle:"liquid",
            mainTitle:"flask",
            description:"A water-tight container for anything that flows.",
        },
        colorName:"storage",
        tags:["storage"],
        stats:[
            new Stat("liquidStorage",{value:10})
        ]
    },
    //Dummy
    {
        id:"blink",
        lore:{
            mainTitle:"blink",
            subTitle:"fire",
            description:"its so joever.",
        },
        colorName:"light",
        tags:["spell"]
    },
    //Harvests from a restricted inventory tier 1 (eg. the twigs, sap of a tree)
    {
        id:"harvest",
        lore:{
            mainTitle:"harvest",
            subTitle:"resource",
            description:"There is no one else to receive these treasures but you.",
        },
        colorName:"harvest",
        tags:["spell"],
        interactions:{
            "onDrop":(e)=>{
                e.target.harvest({rank:1});
            }
        }
    },
    //Damages and releases some material from a restricted inventory tier 2 (what composes the structure)
    {
        id:"release_heat",
        lore:{
            superTitle:"dormant",
            mainTitle:"heat",
            description:"Release the heat gathered within your body.",
        },
        colorName:"fire",
        tags:["spell","harvester","damager"],
        interactions:{
            "onDrop":(dropEvent)=>{
                if (!Tile.isTile(dropEvent.target)) return;

                dropEvent.target.tile.incrementStat("heat",player.takeStat("heat"));
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
    //milo everyday
    {
        id:"hearthberry",
        lore:{
            mainTitle:"hearth",
            subTitle:"berry",
            description:"warm and delicious.",
        },
        colorName:"item",
        tags:["item"]
    },
    //milo everyday
    {
        id:"sap",
        lore:{
            superTitle:"sticky",
            mainTitle:"sap",
            description:"sticky!",
        },
        colorName:"item",
        tags:["item"]
    },
    //milo everyday
    {
        id:"wood",
        lore:{
            mainTitle:"wood",
            subTitle:"stick",
            description:"stick!",
        },
        colorName:"item",
        tags:["item"]
    },
    //milo everyday
    {
        id:"pebble",
        lore:{
            mainTitle:"pebble",
            description:"pebble!",
        },
        colorName:"item",
        tags:["item"],
        interactions:{
            "onDrop":(dropEvent)=>{
                if (!Card.isCard(dropEvent.target)) return;

                if (dropEvent.target.type.id == "pebble" && dropEvent.invoker.type.id == "pebble") {
                    dropEvent.target.inventory.addCard(new Card("breakfast"));
                    dropEvent.target.remove();
                    dropEvent.invoker.remove();
                }
            }
        }
    },
])