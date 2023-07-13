DataHandler.addObjectToLoad("StructureType","baseCosmilight",[
    {
        cardProperties: {
            id:"plainsTree",
            lore:{
                mainTitle:"Tree",
                subTitle:"",
                description:"",
            },
            colorName:"worldObject",
            tags:["structure","natural"],
            interactions:[]
        },
        structureProperties: {
            interactionsWhilePlaced:[
                new Interaction({
                    triggers:[
                        new Trigger("perInterval",{ticks:20})
                    ],
                    conditions:[],
                    consequences:[
                        new Consequence("changeHealth",{amt:1}),
                    ],
                    target:"self"
                }),
            ],
            amountOfSprites:1
        }
    },
    {
        cardProperties: {
            id:"fire",
            lore:{
                mainTitle:"Flame",
                subTitle:"",
                description:"Where light is born.",
            },
            colorName:"worldObject",
            tags:["structure","artificial"],
            interactions:[]
        },
        structureProperties: {
            interactionsWhilePlaced:[
                new Interaction({
                    triggers:[
                        new Trigger("perInterval",{ticks:10})
                    ],
                    conditions:[
                        new Condition(
                            "inventoryContains",
                            {
                                rank:"accessible",
                                selectors:["#fuel"]
                            }
                        ),
                        new Condition("lightLevel",{below:3})
                    ],
                    consequences:[
                        new Consequence("changeLightLevel",{amt:0.1}),
                    ],
                    target:"self"
                }),
                new Interaction({
                    triggers:[
                        new Trigger("perInterval",{ticks:10})
                    ],
                    conditions:[
                        new Condition(
                            "inventoryContains",
                            {
                                rank:"accessible",
                                selectors:["#fuel"]
                            },
                            false
                        ),
                        new Condition("lightLevel",{above:0})
                    ],
                    consequences:[
                        new Consequence("changeLightLevel",{amt:-0.1}),
                    ]
                }),
            ],
            amountOfSprites:1
        }
    }
])