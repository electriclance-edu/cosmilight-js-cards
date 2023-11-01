DataHandler.addObjectToLoad("CardType","baseCosmilight",[
    {
        id:"sing_melody",
        lore:{
            superTitle:"sing",
            mainTitle:"melody",
            description:"Let your voice echo, and perhaps the world will listen to your plea.",
            technical_description:"<span class='input'>Drag and drop</span> to the center of your screen to sing out into the darkness."
        },
        colorName:"spell-gather",
        tags:["spell","spell_primary","unconsumable"],
        interactions:{
            "onDrop":(e)=>{
                if (Game.player.getStat("knowledge").value == 10) {
                    GUIHandler.logText("You must expend your experience first to continue singing.","cursor",3000);
                    return;
                } else if (Game.player.getStat("unlocks") >= Game.player.knowledgeUnlocks.intro.length) {
                    GUIHandler.logText("The darkness will not listen to your simple song anymore. You learn nothing.","cursor",1000);
                    return;
                }

                Game.player.incrementStat("knowledge",1);
                
                let monarchLight = LightHandler.getLight("#0,0");
                if (monarchLight.faintness < 0.002) {
                    if (monarchLight.faintness == 0.0001) {
                        monarchLight.slumber = 0;
                    }
                    if (monarchLight.faintness < 0.001) {
                        GUIHandler.logText([
                            "Your song disappears into the darkness.",
                            "A lightless void of nothing, devouring even your voice.",
                            "What is this song of yours without a listener?",
                            "Perhaps you must sing louder.",
                            "And let your voice wake even those in this dark, ancient slumber."
                        ][monarchLight.slumber],"cursor",5000);
                        monarchLight.faintness += 0.001 / 5;
                        monarchLight.slumber++;
                    } else {
                        GUIHandler.logText("You hear the rustling of leaves accompany your song.","cursor",3000);
                        monarchLight.faintness = 0.3;
                    }
                } else if (monarchLight.faintness == 0.3) {
                    GUIHandler.logText("You hear the faint howl of a breeze join your melody.","cursor",3000);
                    monarchLight.faintness = 0.6;
                    monarchLight.waver = 0.35;
                } else if (monarchLight.faintness == 0.6) {
                    GUIHandler.logText("The warmth of the tree beside you unites with you in song.","cursor",3000);
                    monarchLight.faintness = 0.9;
                    monarchLight.waver = 0.05;
                } else {
                    GUIHandler.logText(randElem([
                        "You sing into the world.",
                        "The stars twinkle as you sing.",
                        "A carefree tune echoes into the darkness.",
                        "A melody escapes your lips.",
                    ]),"cursor",2000);
                }
            },
        }
    },
    {
        id:"awakening_melody",
        lore:{
            superTitle:"Awakening",
            mainTitle:"Melody",
            description:"Beckon the slumbering world to awaken.",
            technical_description:"<span class='input'>Drop</span> onto a Hearthtree to reduce its Slumber."
        },
        colorName:"spell-gather",
        tags:["spell","spellpaper","spell_gather","spell_primary","unconsumable"],
        interactions:{
            "onDrop":(e)=>{
                if (e.target.typeId == "hearthtree") { 
                    GUIHandler.logText("Your voice beckons the tree to awaken.","cursor",2000);
                    e.target.getStat("slumber").increment(-1);
                } else {
                    GUIHandler.logText("Your melody is not heard.","cursor",2000);
                }
            },
        }
    },
    {
        id:"condense_light",
        lore:{
            superTitle:"condense",
            mainTitle:"light",
            description:"A piece of the eminent moon's command.",
            technical_description:"<span class='input'>Drop</span> onto a light source to absorb Glow."
        },
        colorName:"spell-gather",
        tags:["spell","spellpaper","spell_gather","spell_primary","starCard"],
        interactions:{
            "onDrop":(e)=>{
                if (e.target.type.id == "condense_light" || e.target.type.id == "draw_water") { 
                    e.target.inventory.addCard(new Card("waterburst"));
                    e.invoker.inventory.addCard(new Card("spellpaper"));
                    e.target.remove();
                    e.invoker.remove();
                } 
                if (!(e.target instanceof Card)){
                    GUIHandler.logText("Light absorbed.","cursor",1000);
                    Game.player.getStat("glow").increment(1);
                    e.invoker.inventory.addCard(new Card("spellpaper"));
                    e.invoker.remove();
                }
            },
        }
    },
    {
        id:"draw_water",
        lore:{
            mainTitle:"draw",
            subTitle:"water",
            description:"Water beckons at your command.",
            technical_description:"<span class='input'>Drop</span> onto a water source to replenish Water."
        },
        colorName:"spell-gather",
        tags:["spell","spellpaper","spell_gather","spell_primary"],
        interactions:{
            "onDrop":(e)=>{
                if (e.target instanceof Tile) {
                    console.log("yeah");
                    if (e.target.structure) {
                        console.log("structure!");
                        if (e.target.structure.getStat("water").value > 0) {
                            var amt = e.target.structure.getStat("water").consume(3);
                            GUIHandler.logText(`${amt} water gathered.`,"cursor",1000);
                            Game.player.getStat("water").increment(amt);
                            e.invoker.inventory.addCard(new Card("spellpaper"));
                            e.invoker.remove();
                        }
                    }

                } else if (e.target.type.id == "condense_light" || e.target.type.id == "draw_water") { 
                    e.target.inventory.addCard(new Card("waterburst"));
                    e.invoker.inventory.addCard(new Card("spellpaper"));
                    e.target.remove();
                    e.invoker.remove();
                } 
            },
        }
    },
    {
        id:"waterburst",
        lore:{
            superTitle:"water",
            mainTitle:"burst",
            description:"Water holds energy dangerous and powerful.",
            technical_description:"<span class='input'>Drop</span> onto a structure to releases a damaging blast of water."
        },
        colorName:"spell-damaging",
        tags:["spell","spellpaper","spell_damaging","spell_crafted"],
        interactions:{
            "onDrop":(e)=>{
                GUIHandler.logText("biden BLAST","cursor",1000);
                e.invoker.inventory.addCard(new Card("spellpaper"));
                e.invoker.remove();
            },
        }
    },
    {
        id:"blaze_orb",
        lore:{
            mainTitle:"blaze",
            subTitle:"orb",
            description:"A piece of the radiant sun descends.",
            technical_description:"Releases the energy stored within you to create a damaging, firey orb."
        },
        colorName:"spell-damaging",
        tags:["spell","orb_consumable"]
    },
])