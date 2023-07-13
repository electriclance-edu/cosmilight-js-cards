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
    //Stores liquids.
    {
        id:"flask",
        lore:{
            superTitle:"liquid",
            mainTitle:"flask",
            description:"A water-tight container for anything that flows.",
        },
        colorName:"storage",
        tags:["storage"],
        interactions:[
            new Interaction({
                triggers:["droppedInto"],
                consequences:[
                    new Consequence("addItem",{item:"#droppedItem"})
                ],
                target:"self"
            }),
            new Interaction({
                triggers:["droppedInto"],
                consequences:[
                    new Consequence("itemRemove")
                ],
                target:"droppedItem"
            })
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
        tags:["spell"],
        interactions:[]
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
        interactions:[
            new Interaction({
                triggers:["onDrop"],
                consequences:[new Consequence("harvest",{rank:1,target:"target"})]
            }),
        ]
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
        interactions:[
            new Interaction({
                triggers:["onDrop"],
                consequences:[
                    new Consequence("harvest",{rank:2}),
                    new Consequence("changeHealth",{amt:-20})
                ],
                target:"drop"
            }),
        ]
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
        tags:["spell","harvester","damager"],
        interactions:[
            new Interaction({
                triggers:["onDrop"],
                consequences:[
                    new Consequence("harvest",{rank:2}),
                    new Consequence("changeHealth",{amt:-20})
                ],
                target:"drop"
            }),
        ]
    },
    //Damages and releases some material from a restricted inventory tier 2 (what composes the structure)
    {
        id:"stone",
        lore:{
            mainTitle:"stone",
            description:"Remind that which has forgotten what it means to break.",
        },
        colorName:"fire",
        tags:["spell","harvester","damager"],
        interactions:[
            new Interaction({
                triggers:["onDrop"],
                consequences:[
                    new Consequence("harvest",{rank:2}),
                    new Consequence("changeHealth",{amt:-20})
                ],
                target:"drop"
            }),
        ]
    }
])