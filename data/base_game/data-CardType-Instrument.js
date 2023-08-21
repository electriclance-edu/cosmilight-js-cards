DataHandler.addObjectToLoad("CardType","baseCosmilight",[
    //Gives the player spell cards.
    {
        id:"starter_instrument",
        lore:{
            superTitle:"Water",
            mainTitle:"Flute",
            description:"It creates a unique, primitive sound.",
            technical_description:"<span class='input'>Click</span> to turn all your spellpapers into spells."
        },
        colorName:"activeItem",
        tags:["instrument"],
        stats:[
            new Stat("cycle",{value:0,max:10}),
            new Stat("upkeep",{value:0.5})
        ],
        interactions:{
            "onClick":(e)=>{
                if (!e.invoker.inventory.title == "PLAYER HAND") {
                    return;
                }
                if (!Game.player.getStat("water").consume(e.invoker.getStat("upkeep").value)) {
                    GUIHandler.logText("Not enough water.","cursor",1000);
                    return;
                }
                // var cycle = e.invoker.getStat("cycle");
                let createdSpells = false;
                Game.player.hand.getCards().forEach((card)=>{
                    if (card.type.hasTag("spellpaper")) {
                        createdSpells = true;
                        card.remove();
                        Game.player.hand.addCard(new Card(randElem(["draw_water","condense_light"])));
                    }
                });
                if (createdSpells) {
                    GUIHandler.logText("Spell manifested.","cursor",1000);
                }

                // cycle.cyclicIncrement(1);
            },
            "onDrop":(e)=>{
                // // if target is researchitem, yield ideas
                // if (e.target.type.hasTag("researchable")) {
                //     console.log("hell yeah!");
                // } else if (e.target.type.hasTag("orb_consumable")) {
                //     e.target.remove();
                //     Game.player.getStat("water").increment(parseFloat(e.invoker.getStat("upkeep").value) * 0.5);
                // }
            },
            // "onTick":(e)=>{
            // }
        }
    },
])