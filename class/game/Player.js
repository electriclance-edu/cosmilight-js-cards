class Player {
    constructor() {
        this.hand = new Inventory(4,"PLAYER HAND");
        this.location = new Point(0,0);
        this.bodyParts = {
            "eye":{
                lastState:1000,
                toggle:(state)=>{
                    if (state != this.lastState) {
                        let elem = document.getElementById("bodyPart-eye");
                        elem.classList.remove("state-disabled");
                        elem.classList.remove("state-enabled");
                        elem.classList.add(state ? "state-disabled" : "state-enabled");
                        this.lastState = state;
                    }
                }
            }
        }
        this.movement = {
            paralyzed:false,
            baseSpeed:0.03,
            lastAttackFrame:0,
            dashBonus:0,
            direction:{
                "+y":0,
                "-y":0,
                "-x":0,
                "+x":0
            }
        };
        this.tags = [];
        this.stats = {
            // "health":new Stat("health",{value:30,max:30}),
            // "water":new Stat("water",{value:20,max:20}),
            // "glow":new Stat("glow",{value:10,max:20}),
            "knowledge":new Stat("knowledge",{value:0,max:10}),
            "unlocks":new Stat("unlocks",{value:0,max:26}),
            "interactionDistance":new Stat("interactionDistance",{value:1}),
        };
        /*
        **research**
        part the darkness - decreases darkness color so things are actually visible
        improve voice - filler research x3, can add lore
        */
        this.knowledgeUnlocks = {
            intro:[
                {
                    cards:{
                        hiraku:new Card("research_hiraku"),
                        song1:new Card("research_song1")
                    },
                    lore:{
                        title:"Your song slowly wakes the world.",
                        description:"Select an ability to gain."
                    }
                }
            ],
            random:[
                {
                    cards:[
                        new Card("research_boostDash"),
                        new Card("research_boostWalk"),
                        new Card("research_boostVision"),
                    ],
                    lore:{
                        title:"You gain an unlock.",
                        description:"Select an ability to gain."
                    }
                }
            ]
        }
    }
    getCurrentKnowledgeUnlockInfo() {
        let info = "none";

        this.knowledgeUnlocks.intro.forEach((potentialInfo)=>{            
            //check if empty
            if (Object.values(potentialInfo.cards).length > 0) {
                info = potentialInfo;
            }
        });

        if (info == "none") {
            return this.knowledgeUnlocks.random[0];
        } else {
            return info;
        }
    }
    incrementStat(id,amt) {
        let stat = this.getStat(id);
        stat.increment(amt);
        if (id == "knowledge") {
            if (stat.isMaxed()) {
                this.hand.addCard(new Card("expend_knowledge"));
            }
        }
    }
    addTag(tag) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
        }
    }
    removeTag(tag) {
        if (this.tags.includes(tag)) {
            this.tags.splice(this.tags.indexOf(tag),1);
        }
    }
    hasTag(tag) {
        return this.tags.includes(tag);
    }
    get moving() {
        return Object.values(this.movement.direction).some((elem) => elem);
    }
    get speed() {
        let speed = this.movement.baseSpeed;
        if (this.movement.dashBonus > 0) {
            speed += this.movement.baseSpeed * 3 * (this.movement.dashBonus / 10);
            this.movement.dashBonus -= 0.1;
        }
        // if (GUIHandler.frame - this.movement.lastAttackFrame <= 15) {
        //     speed *= 0.5;
        // }
        
        let directions = Object.values(this.movement.direction).reduce((acc,elem) => { return acc + elem }, 0);
        if (directions == 2) {
            return (speed) / 1.414;
        } else {
            return speed;
        }
    }
    // Checks if player satisfies a specific Requirements object.
    satisfiesRequirements(reqs) {
        var allRequirementsSatisfied = true;
        //reqs is an obj formatted as "class-typeId":amt
        Object.keys(reqs).forEach((key)=>{
            let split = key.split("-");
            let objClass = split[0];
            let typeId = split[1];
            let amt = reqs[key];

            if (objClass == "stat") {
                let stat;
                try {
                    stat = this.getStat(typeId);
                } catch {
                    console.warn(`Player.satisfiesRequirements(): Attempted to check stat of type "${typeId}", however player possesses no such stat.`);
                }
                if (stat) allRequirementsSatisfied = stat.satisfies(amt);
            } else if (objClass == "card") {
                allRequirementsSatisfied = this.hand.countOf(typeId) >= amt;
            } else {
                console.warn(`Player.satisfiesRequirements(): Attempted to check requirement of class "${objClass}", however no such class exists.`);
            }
        })

        return allRequirementsSatisfied;
    }
    consumeRequirements(reqs) {
        //reqs is an obj formatted as "class-typeId":amt
        Object.keys(reqs).forEach((key)=>{
            let split = key.split("-");
            var objClass = split[0];
            var typeId = split[1];
            let amt = reqs[key];

            if (objClass == "stat") {
                let stat;
                try {
                    stat = this.getStat(typeId);
                } catch {
                    console.warn(`Player.consumeRequirements(): Attempted to consume stat of type "${typeId}", however player possesses no such stat.`);
                }
                if (stat) stat.increment(-amt);
            } else if (objClass == "card") {
                this.hand.removeOfId(typeId,amt);
            } else {
                console.warn(`Player.consumeRequirements(): Attempted to consume requirement of class "${objClass}", however no such class exists.`);
            }
        })
    }
    paralyze() {
        this.movement.paralyzed = true;
    }
    unparalyze() {
        this.movement.paralyzed = false;
    }
    getRoundedLocation() {
        return new Point(
            roundCoordinate(this.location.x),
            roundCoordinate(this.location.y)
        );
    }
    distanceTo(point) {
        return dist(point,this.location);
    }
    moveLocation(x,y) {
        this.location = new Point(x,y);
    }
    getStat(id) {
        if (!this.stats.hasOwnProperty(id)) {
            console.warn(`Player.getStat(): Attempted to get stat of type "${id}", however player possesses no such stat.`);
            return null;
        } else {
            return this.stats[id];
        }
    } 
    translate(x,y) {
        if (this.movement.paralyzed) {
            return;
        }

        var newPosition = new Point(
            (parseFloat(Game.player.location.x) + x).toFixed(2), 
            (parseFloat(Game.player.location.y) + y).toFixed(2)
        );
        Game.player.moveLocation(newPosition.x,newPosition.y);
        LightHandler.moveLight("player",newPosition.x,newPosition.y);
        this.bodyParts.eye.toggle(FogHandler.intersects(this.location));
    }
}

/*
HK - fast, quick, snappy movement. no acceleration, just instant moving
Stardew - extremely slow quick movements, snappy, although actions stop the player from moving which gives those actions weight
Factorio - slow, but snappy movements, 
Minecraft - fairly slow, slightly slippery movements? definitely doesnt feel good, although shift is nice
Isaac - fast, slippery movements
Forager - slippery, unsatisfying, slow movement
Mewnbase - takes time to accelerate to full speed, but immediate stop, DISGUSTING WHAT
Hammerwatch - WEIGHTY DELICIOUS. MOVEMENT SATISFYING. snappy but slowdown on actions give them weight and also is just cool for game
*/