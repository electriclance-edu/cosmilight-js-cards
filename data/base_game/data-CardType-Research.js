DataHandler.addObjectToLoad("CardType","baseCosmilight",[
    {
        id:"research_template",
        lore:{
            mainTitle:"",
            subTitle:"",
            description:"",
            technical_description:""
        },
        colorName:"researchGeneral researchStructure researchSpell",
        tags:["research"],
        interactions:{
            "onSelect":(e)=>{
                let cost = e.target.type.other.cost;
                if (Game.player.satisfiesRequirements(cost)) {
                    Game.player.consumeRequirements(cost);
                    GameEventHandler.onSelectionInvocationSuccess(GUIHandler.selectionInvoker);
                } else {
                    GUIHandler.logText("Cost not satisfied!","cursor",1000)
                }
            }
        },
        other:{
            cost:{
                "stat-knowledge":30,
                "card-fiber":10
            },
        }
    },
    {
        id:"research_boostVision",
        lore:{
            superTitle:"Boost",
            mainTitle:"Vision",
            description:"Expose more of the world around you.",
            technical_description:"You can see more of the world around you."
        },
        colorName:"researchGeneral",
        tags:["research"],
        interactions:{
            "onSelect":(e)=>{
                let cost = e.target.type.other.cost;
                if (Game.player.satisfiesRequirements(cost)) {
                    Game.player.consumeRequirements(cost);
                    GUIHandler.toggleDarkOverlay(undefined,false);
                    GUIHandler.CullRevealage.x += 1;
                    GUIHandler.CullRevealage.y += 1;

                    Game.player.getStat("unlocks").increment(1);
                    GameEventHandler.onSelectionInvocationSuccess(GUIHandler.selectionInvoker);
                } else {
                    GUIHandler.logText("Cost not satisfied!","cursor",1000)
                }
            }
        },
        other:{
            cost:{
                "card-lightfruit":3,
            },
        }
    },
    {
        id:"research_boostWalk",
        lore:{
            superTitle:"Boost",
            mainTitle:"Walk",
            description:"Your legs bring you to your goal.",
            technical_description:"You move faster."
        },
        colorName:"researchGeneral",
        tags:["research"],
        interactions:{
            "onSelect":(e)=>{
                let cost = e.target.type.other.cost;
                if (Game.player.satisfiesRequirements(cost)) {
                    Game.player.consumeRequirements(cost);
                    GUIHandler.toggleDarkOverlay(undefined,false);
                    Game.player.movement.speed *= 1.25;
                    
                    Game.player.getStat("unlocks").increment(1);
                    GameEventHandler.onSelectionInvocationSuccess(GUIHandler.selectionInvoker);
                } else {
                    GUIHandler.logText("Cost not satisfied!","cursor",1000)
                }
            }
        },
        other:{
            cost:{
                "card-lightfruit":3,
            },
        }
    },
    {
        id:"research_boostDash",
        lore:{
            superTitle:"Boost",
            mainTitle:"Dash",
            description:"Your dashes bring you closer to your goal.",
            technical_description:"Your dash improves in strength."
        },
        colorName:"researchGeneral",
        tags:["research"],
        interactions:{
            "onSelect":(e)=>{
                let cost = e.target.type.other.cost;
                if (Game.player.satisfiesRequirements(cost)) {
                    Game.player.consumeRequirements(cost);
                    GUIHandler.toggleDarkOverlay(undefined,false);
                    Game.player.movement.dashSpeed *= 1.3;

                    Game.player.getStat("unlocks").increment(1);
                    GameEventHandler.onSelectionInvocationSuccess(GUIHandler.selectionInvoker);
                } else {
                    GUIHandler.logText("Cost not satisfied!","cursor",1000)
                }
            }
        },
        other:{
            cost:{
                "card-lightfruit":3,
            },
        }
    },
    {
        id:"research_song1",
        lore:{
            superTitle:"Strengthen",
            mainTitle:"Song",
            description:"Let your melody expand, and awaken those weaker.",
            technical_description:"You gain a new melody."
        },
        colorName:"researchGeneral",
        tags:["research"],
        interactions:{
            "onSelect":(e)=>{
                let cost = e.target.type.other.cost;
                if (Game.player.satisfiesRequirements(cost)) {
                    Game.player.consumeRequirements(cost);
                    GUIHandler.toggleDarkOverlay(undefined,false);

                    Game.player.hand.addCard(new Card("awakening_melody"));
                    delete Game.player.knowledgeUnlocks.intro[0].cards.song1;
                    GameEventHandler.onSelectionInvocationSuccess(GUIHandler.selectionInvoker);
                } else {
                    GUIHandler.logText("Cost not satisfied!","cursor",1000)
                }
            }
        },
        other:{
            cost:{
                "stat-knowledge":5,
            },
        }
    },
    {
        id:"research_hiraku",
        lore:{
            superTitle:"Reveal",
            mainTitle:"Dark",
            description:"Open wide the gates of this world.",
            technical_description:"Your eyes can now see into the impenetrable darkness."
        },
        colorName:"researchGeneral",
        tags:["research"],
        interactions:{
            "onSelect":(e)=>{
                let cost = e.target.type.other.cost;
                if (Game.player.satisfiesRequirements(cost)) {
                    Game.player.consumeRequirements(cost);
                    GUIHandler.toggleDarkOverlay(undefined,false);
                    LightHandler.dark = new RGBA(15,0,30,0.7);
                    delete Game.player.knowledgeUnlocks.intro[0].cards.hiraku;
                    GameEventHandler.onSelectionInvocationSuccess(GUIHandler.selectionInvoker);
                } else {
                    GUIHandler.logText("Cost not satisfied!","cursor",1000)
                }
            }
        },
        other:{
            cost:{
                "stat-knowledge":5,
            },
        }
    },
    {
        id:"research_reality",
        lore:{
            superTitle:"GAIN",
            mainTitle:"REALITY",
            description:"",
            technical_description:"<span class='input'>Select</span> this to gain the ability to manipulate the world."
        },
        colorName:"research",
        tags:["research"],
        interactions:{
            "onSelect":(e)=>{
                let cost = e.target.type.other.cost;
                if (Game.player.satisfiesRequirements(cost)) {
                    Game.player.consumeRequirements(cost);
                    GUIHandler.toggleDarkOverlay(undefined,false);
                    GUIHandler.logText("")
                    // GameEventHandler.onSelectionInvocationSuccess(GUIHandler.selectionInvoker);
                } else {
                    GUIHandler.logText("Cost not satisfied!","cursor",1000)
                }
            }
        },
        other:{
            cost:{
                "stat-knowledge":5,
            },
        }
    },
    {
        id:"research_theorycrafting",
        lore:{
            mainTitle:"Theory",
            subTitle:"Crafting",
            description:"The bedrock of scientific understanding.",
            technical_description:"Affects the <b>Research Table</b>, increasing the yield and complexity of the research process."
        },
        colorName:"researchStructure",
        tags:["research"],
        interactions:{
            "onSelect":(e)=>{
                let cost = e.target.type.other.cost;
                if (Game.player.satisfiesRequirements(cost)) {
                    Game.player.consumeRequirements(cost);
                    GameEventHandler.onSelectionInvocationSuccess(GUIHandler.selectionInvoker);
                } else {
                    GUIHandler.logText("Cost not satisfied!","cursor",1000)
                }
            }
        },
        other:{
            cost:{
                "stat-knowledge":30,
                "stat-water":10,
                "card-wood":6,
                "card-stone":6
            },
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
        colorName:"researchGeneral",
        tags:["research"],
        interactions:{
            "onSelect":(e)=>{
                let cost = e.target.type.other.cost;
                if (Game.player.satisfiesRequirements(cost)) {
                    Game.player.consumeRequirements(cost);
                    GameEventHandler.onSelectionInvocationSuccess(GUIHandler.selectionInvoker);
                } else {
                    GUIHandler.logText("Cost not satisfied!","cursor",1000)
                }
            }
        },
        other:{
            cost:{
                "stat-knowledge":30,
                "card-fiber":12,
                "card-large_leaf":2
            },
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
        colorName:"researchSpell",
        tags:["research"],
        interactions:{
            "onSelect":(e)=>{
                let cost = e.target.type.other.cost;
                if (Game.player.satisfiesRequirements(cost)) {
                    Game.player.consumeRequirements(cost);
                    GameEventHandler.onSelectionInvocationSuccess(GUIHandler.selectionInvoker);
                } else {
                    GUIHandler.logText("Cost not satisfied!","cursor",1000)
                }
            }
        },
        other:{
            cost:{
                "stat-knowledge":30,
                "stat-glow":30,
                "card-wet_clay":3,
                "card-ceramic":3,
            },
        }
    },
    {
        id:"research_heat",
        lore:{
            mainTitle:"Heat",
            subTitle:"Energy",
            description:"The foundation of the old world.",
            technical_description:"Unlocks the <b>Woodfire</b>. Opens up research into methods for manipulating Heat."
        },
        colorName:"researchStructure",
        tags:["research"],
        interactions:{
            "onSelect":(e)=>{
                let cost = e.target.type.other.cost;
                if (Game.player.satisfiesRequirements(cost)) {
                    Game.player.consumeRequirements(cost);
                    GameEventHandler.onSelectionInvocationSuccess(GUIHandler.selectionInvoker);
                } else {
                    GUIHandler.logText("Cost not satisfied!","cursor",1000)
                }
            }
        },
        other:{
            cost:{
                "stat-knowledge":30,
                "card-torchberry":6
            },
        }
    },
    {
        id:"research_heatdash",
        lore:{
            superTitle:"Heated",
            mainTitle:"Dash",
            description:"A blaze in your step gets you going.",
            technical_description:"Increases the speed boost that dashing gives you."
        },
        colorName:"researchGeneral",
        tags:["research"],
        interactions:{
            "onSelect":(e)=>{
                let cost = e.target.type.other.cost;
                if (Game.player.satisfiesRequirements(cost)) {
                    Game.player.consumeRequirements(cost);
                    GameEventHandler.onSelectionInvocationSuccess(GUIHandler.selectionInvoker);
                } else {
                    GUIHandler.logText("Cost not satisfied!","cursor",1000)
                }
            }
        },
        other:{
            cost:{
                "stat-knowledge":50,
                "stat-heat":10,
                "card-fiber":10
            },
        }
    },
    {
        id:"research_heatspells",
        lore:{
            mainTitle:"Heat",
            subTitle:"Spells",
            description:"The strength of fire is servant to magic.",
            technical_description:"Upgrades the <b>Spell Orb</b> with a heat-absorbing spell. Fire structures now produce Heat spells."
        },
        colorName:"researchSpell",
        tags:["research"],
        interactions:{
            "onSelect":(e)=>{
                let cost = e.target.type.other.cost;
                if (Game.player.satisfiesRequirements(cost)) {
                    Game.player.consumeRequirements(cost);
                    GameEventHandler.onSelectionInvocationSuccess(GUIHandler.selectionInvoker);
                } else {
                    GUIHandler.logText("Cost not satisfied!","cursor",1000)
                }
            }
        },
        other:{
            cost:{
                "stat-knowledge":50,
                "stat-heat":10,
                "stat-glow":30,
            },
        }
    },
])