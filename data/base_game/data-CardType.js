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
    // Consumes mana to damage a target.
    {
        id:"condense_light",
        lore:{
            superTitle:"condense",
            mainTitle:"light",
            description:"A piece of the eminent moon's command.",
            technical_description:"Consumes some light to create mana."
        },
        colorName:"harvest",
        tags:["spell","orb_consumable"],
        interactions:{
            "onDrop":(e)=>{
                GUIHandler.logText("Light condensed into mana.","cursor",1000);
                Game.player.getStat("mana").increment(5);
                e.invoker.remove();
            },
        }
    },
    // Consumes mana to damage a target with fire   .
    {
        id:"blaze_orb",
        lore:{
            mainTitle:"blaze",
            subTitle:"orb",
            description:"A piece of the radiant sun descends.",
            technical_description:"Releases the energy stored within you to create a damaging, firey orb."
        },
        colorName:"harvest",
        tags:["spell","orb_consumable"]
    },
    // Consumes mana to damage a target with fire   .
    {
        id:"waterburst",
        lore:{
            superTitle:"water",
            mainTitle:"burst",
            description:"Water holds energy dangerous and powerful.",
            technical_description:"Releases the energy stored within water to create a strong blast."
        },
        colorName:"harvest",
        tags:["spell","orb_consumable"]
    },
    // Basic Research
    {
        id:"research_theorycrafting",
        lore:{
            mainTitle:"Theory",
            subTitle:"Crafting",
            description:"The bedrock of scientific understanding.",
            technical_description:"Affects the <b>Research Table</b>, increasing the yield and complexity of the research process."
        },
        cost:{
            "stat-water":10,
            "card-fiber":10
        },
        colorName:"researchStructure",
        tags:["research"],
        interactions:{
            "onSelect":(e)=>{
                console.log("Theorycrafting!",e.target);
            }
        }
    },
    {
        id:"research_threadmaking",
        lore:{
            mainTitle:"Thread",
            subTitle:"Making",
            description:"A versatile, tough material.",
            technical_description:"Unlocks <b>Thread</b>, used for crafting items that increase stat maximums."
        },
        cost:{
            "stat-water":10,
            "card-fiber":10
        },
        colorName:"researchGeneral",
        tags:["research"],
        interactions:{
            "onSelect":(e)=>{
                console.log("Threadmaking!",e.target)
            }
        }
    },
    {
        id:"research_carvedspells",
        lore:{
            mainTitle:"Carved",
            subTitle:"Spells",
            description:"Robust spells etched into ceramic.",
            technical_description:"Unlocks <b>Carved Spells</b>, stronger spells created at a Carving Station."
        },
        cost:{
            "stat-water":10,
            "card-fiber":10
        },
        colorName:"researchSpell",
        tags:["research"],
        interactions:{
            "onSelect":(e)=>{
                console.log("Carved spells!",e.target)
            }
        }
    },
    {
        id:"research_ignition",
        lore:{
            mainTitle:"Ignition",
            description:"The foundation of the old world.",
            technical_description:"Unlocks the <b>Woodfire</b>. Opens up research into methods for manipulating Heat."
        },
        cost:{
            "stat-water":10,
            "card-fiber":10
        },
        colorName:"researchStructure",
        tags:["research"],
        interactions:{
            "onSelect":(e)=>{
                console.log("Ignition!",e.target)
            }
        }
    },
    // Basic Research Item
    {
        id:"trinket_1",
        lore:{
            superTitle:"Strange",
            mainTitle:"Trinket",
            description:"Who knows how long this has been gathering dust.",
        },
        colorName:"researchItem",
        tags:["item","researchable"],
        stats:[
            new Stat("lore",{value:30})
        ],
        interactions:{}
    },
    //Gives the player spell cards.
    {
        id:"old_orb",
        lore:{
            superTitle:"Old",
            mainTitle:"Orb",
            description:"It glitters like a star fallen from the heavens.",
            technical_description:"When touched (<span class='input'>clicked</span>), produces a basic spell."
        },
        colorName:"activeItem",
        tags:["instrument"],
        stats:[
            new Stat("cycle",{value:0,max:10}),
            new Stat("upkeep",{value:1})
        ],
        interactions:{
            "onClick":(e)=>{
                if (!Game.player.getStat("water").consume(e.invoker.getStat("upkeep").value)) {
                    GUIHandler.logText("Not enough water.","cursor",1000);
                    return;
                }
                var cycle = e.invoker.getStat("cycle");

                if (cycle.value == 10) {
                    Game.player.hand.addCard(new Card("blaze_orb"));
                } else {
                    if (chance(0.5)) {
                        Game.player.hand.addCard(new Card("waterburst"));
                    } else {
                        Game.player.hand.addCard(new Card("condense_light"));
                    }
                }
                GUIHandler.logText("Spell manifested.","cursor",1000);

                cycle.cyclicIncrement(1);
            },
            "onDrop":(e)=>{
                // if target is researchitem, yield ideas
                if (e.target.type.hasTag("researchable")) {
                    console.log("hell yeah!");
                } else if (e.target.type.hasTag("orb_consumable")) {
                    e.target.remove();
                    Game.player.getStat("water").increment(parseFloat(e.invoker.getStat("upkeep").value) * 0.5);
                }
            },
            // "onTick":(e)=>{
            // }
        }
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
            },
            "onTick":(e)=>{
                if (e.time % 40 == 0) {
                    // e.invoker.inventory.addCard(new Card("breakfast"));
                }
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