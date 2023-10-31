DataHandler.addObjectToLoad("CardType","baseCosmilight",[
    {
        id:"spellpaper",
        lore:{
            superTitle:"Spell",
            mainTitle:"Paper",
            description:"Absorbs magic into itself for the creation of spells.",
            technical_description:"Can be turned into spells by Instruments.",
        },
        colorName:"item",
        tags:["item","spellpaper"]
    },
    {
        id:"lightfruit",
        lore:{
            superTitle:"Light",
            mainTitle:"Fruit",
            description:"Remnants of the blessing of light itself.",
            technical_description:"",
        },
        colorName:"item",
        tags:["item","spellpaper"]
    },
    {
        id:"debug_map",
        lore:{
            superTitle:"Debug",
            mainTitle:"Map",
            description:"",
            technical_description:"<span class='input'>Click</span> to open a default Plains area expedition.",
        },
        colorName:"item",
        tags:["item","spellpaper"],
        interactions:{
            "onClick":(e)=>{
                var area;
                GUIHandler.displayArea(area);
            }
        }
    },
    {
        id:"expend_knowledge",
        lore:{
            superTitle:"Unlock",
            mainTitle:"Ability",
            description:"The experience you have gathered guides you forward.",
            technical_description:"<span class='input'>Drag and drop</span> anywhere to consume your experience and unlock something new.",
        },
        colorName:"item",
        tags:["item","spellpaper"],
        interactions:{
            "onClick":(e)=>{
                let info = Game.player.getCurrentKnowledgeUnlockInfo();
                GUIHandler.displaySelection(info.cards,info.lore,undefined,true);
            }
        }
    },
])