class GUIHandler {
    static frame = 0;
    
    static initialize() {
        GUIHandler.DarkOverlay = document.getElementById("DarkOverlay");
        GUIHandler.DarkOverlayBg = document.getElementById("darkOverlay-bg");
        GUIHandler.SelectionCardContainer = document.getElementById("cardSelection-cardContainer");
        GUIHandler.SelectionDesc = document.getElementById("cardSelection-desc");
        GUIHandler.SelectionTitle = document.getElementById("cardSelection-title");
    }
    static renderFrame() {
        requestAnimationFrame(GUIHandler.renderFrame);
        
        GUIHandler.frame++;

        let mov = Game.player.movement;
        var x = Game.player.movement.direction["+x"]*Game.player.speed - Game.player.movement.direction["-x"]*Game.player.speed;
        var y = Game.player.movement.direction["+y"]*Game.player.speed - Game.player.movement.direction["-y"]*Game.player.speed;
        if (x != Game.player.location.x || y != Game.player.location.y) {
            Game.player.translate(x,y);
        }
        
        EffectHandler.render();
        PhysicsBodyHandler.physicsTimestep();
        PhysicsBodyHandler.renderAllBodies();
        LightHandler.renderAllLight();
    }
    static displayStats(stats,container) {
        Object.values(stats).forEach((stat) => {
            if (stat.type.style.visibility == "visible") {
                let elem = GUIHandler.generateStatElem(stat,container);
                stat.renderElem = elem;
                container.appendChild(elem);
            }
        });
    }
    static toggleElemVisibility(elem,state,display = "block") {
        if (state) {
            elem.classList.remove("state-invisible");
            elem.style.display = display;
            elem.classList.add("state-visible");
        } else {
            elem.classList.remove("state-visible");
            elem.classList.add("state-invisible");
            setTimeout(()=>{
                elem.style.display = "none";
            },300);
        }
        // elem.style.visibility = state ? "visible" : "hidden";
    }
    static updateStatElem(value,max,elem) {
        var parentStyle = elem.style;
        parentStyle.setProperty("--fill",value);
        parentStyle.setProperty("--fill-max",max);
    
        let txt = elem.querySelector(".progressBar-text");
        if (txt) {
            txt.innerHTML = `${Math.round(value)}/${Math.round(max)}`;
        }
    }
    static generateStatElem(stat,container) {
        if (stat.max > container.getAttribute("data-fillAbsMax")) {
            container.style = `--fill-abs-max:${stat.max}`;
            container.setAttribute("data-fillAbsMax",stat.max);
        }
        var type = stat.type;
        var statStyle = `
            --fill:${stat.value};
            --fill-max:${stat.max};
            --fill-color:${type.style.fillColor};
            --fill-color-complement:${type.style.fillColorComplement};
            --fill-color-accent:${type.style.fillColorAccent};
        `;
        var statHTML = `
            <div class="progressBarParent" style="${statStyle}">
                <div class="progressBar">
                    <div class="progressBar-icon"></div>
                    <p class="progressBar-title headerFont">${type.name.toUpperCase()}</p>
                    <div class="progressBar-fill"></div>
                </div>
                <p class="progressBar-text">${Math.round(stat.value)}/${Math.round(stat.max)}</p>
            </div>
        `
        var elem = parseHTML(statHTML);
        return elem;
    }
    // Opens the DarkOverlay's AreaFragmentDisplay
    static displayArea(area) {
        GUIHandler.toggleDarkOverlay("AreaFragmentDisplay",true,true);
    }
    static generateCardTitleElement(lore) {
        var cardTitle = elem("div");
        cardTitle.classList.add("card-title");
        
        if (Object.keys(lore).includes("superTitle")) {
            //split supertitle
            lore.superTitle.split("").forEach(letter => {
                var char = elem("div","card-supertitle-char headerFont-thin",letter.toUpperCase());
                cardTitle.append(char);
            });
            //linebreak
            cardTitle.append(elem("div","flex-break"));
        }

        //split title into characters
        lore.mainTitle.split("").forEach(letter => {
            if (letter != " ") {
                var char = elem("div","card-title-char headerFont",letter.toUpperCase());
            } else {
                var char = elem("div","flex-break card-title-char headerFont",letter.toUpperCase());
            }
            cardTitle.append(char);
        });

        if (Object.keys(lore).includes("subTitle")) {
            //linebreak
            cardTitle.append(elem("div","flex-break"));
            //split subtitle
            lore.subTitle.split("").forEach(letter => {
                var char = elem("div","card-subtitle-char headerFont-thin",letter.toUpperCase());
                cardTitle.append(char);
            });
        }
        
        return cardTitle;
    }
    static toggleDarkOverlay(screen, state, closeable = false) {
        var screens = [
            "CardSelection",
            "AreaFragmentDisplay"
        ]
        
        screens.forEach((screenId)=> {
            document.getElementById(screenId).style.display = "none";
        })
        document.getElementById(screen).style.display = "block";
        
        if (state) {
            Game.player.paralyze();
            GUIHandler.toggleElemVisibility(GUIHandler.DarkOverlay,true,"flex");
        } else {
            Game.player.unparalyze();
            GUIHandler.toggleElemVisibility(GUIHandler.DarkOverlay,false);
        }
        if (closeable) {
            GUIHandler.DarkOverlayBg.onclick = () => {
                Game.player.unparalyze();
                GUIHandler.toggleElemVisibility(GUIHandler.DarkOverlay,false);
                if (GUIHandler.selectionInvoker) {
                    GameEventHandler.onSelectionInvocationFailure(GUIHandler.selectionInvoker);
                }
            };
            GUIHandler.DarkOverlayCloseListener = document.addEventListener("keydown",(e) => {
                if (e.code == "Escape") {
                    Game.player.unparalyze();
                    GUIHandler.toggleElemVisibility(GUIHandler.DarkOverlay,false);
                    if (GUIHandler.selectionInvoker) {
                        GameEventHandler.onSelectionInvocationFailure(GUIHandler.selectionInvoker);
                    }
                    removeEventListener("keydown",GUIHandler.DarkOverlayCloseListener,true);
                }
            });
            GUIHandler.DarkOverlay.classList.add("state-onclickVanishable");
        } else {
            GUIHandler.DarkOverlayBg.onclick = null;
            removeEventListener("keydown",GUIHandler.DarkOverlayCloseListener,true);
            GUIHandler.DarkOverlay.classList.remove("state-onclickVanishable");
        }
    }
    static minimizeDOM() {
        document.getElementById("Screen-Start").remove();
    }
    static closeTitleTab() {
        // let header = document.getElementById("TitleTab-Header");
        // header.innerHTML = "";
        // let ldesc = document.getElementById("TitleTab-LDescription");
        // ldesc.innerHTML = "";
        GUIHandler.toggleTab("TitleTab",new Point(0,0),false);
        GUIHandler.currentlyOpenedTitleObjectId = "";
    }
    static toggleTab(id,loc = new Point(window.offsetWidth/2,window.offsetHeight/2),setState) {
        let tab = document.getElementById(id);
        
        // set state
        let state;
        if (setState) { // setState overrides the toggle.
            state = setState
        } else {
            // If it contains the class "state-opened", then that tab is currently opened. If not, then closed. Set it to the opposite of that.
            state = !tab.classList.contains("state-opened");
        } 
        tab.classList.remove("state-closed"); // Reset class
        tab.classList.remove("state-opened"); // Reset class
        tab.classList.add(["state-closed","state-opened"][state ? 1 : 0]); // If state is 0, add state-closed. If 1, add state-opened.

        if (state) {
            // set location
            tab.style.setProperty("--x",loc.x);
            tab.style.setProperty("--y",loc.y);
        }
    }
    static openTitleTab(card) {
        // RENDER INFO ELEMENTS BASED ON DATA GIVEN
        // render title
        let header = document.getElementById("TitleTab-Header");
        header.innerHTML = "";
        let ctype = card.type;
        if (ctype.lore.superTitle) {
            let superTitle = document.createElement("p");
            superTitle.classList.add("txt-size-small");
            superTitle.classList.add("headerFont");
            superTitle.classList.add("superTitle");
            superTitle.innerHTML = ctype.lore.superTitle;
            header.appendChild(superTitle);
        }
        let title = document.createElement("p");
        title.classList.add("txt-size-header");
        title.classList.add("headerFont");
        title.classList.add("title");
        title.innerHTML = ctype.lore.mainTitle;
        header.appendChild(title);
        if (ctype.lore.subTitle) {
            let subTitle = document.createElement("p");
            subTitle.classList.add("txt-size-small");
            subTitle.classList.add("headerFont-thin");
            subTitle.classList.add("subTitle");
            subTitle.innerHTML = ctype.lore.subtitle;
            header.appendChild(subTitle);
        }

        // render description
        let ldesc = document.getElementById("TitleTab-LDescription");
        if (ctype.lore.description) {
            ldesc.innerHTML = ctype.lore.description;
        } else {
            ldesc.innerHTML = "";
        }
        let tdesc = document.getElementById("TitleTab-TDescription");
        if (ctype.lore.technical_description) {
            tdesc.innerHTML = ctype.lore.technical_description;
        } else {
            tdesc.innerHTML = "";
        }

        GUIHandler.toggleTab("TitleTab",new Point(0,0),true);
    }
    static updatePlayerStatElement(id) {
        let elem = document.getElementById(`${id}StatElement`);
        let stat = Game.player.getStat(id);
        let amt = stat.value;
        let max = stat.max;

        if (!elem) {
            elem = document.createElement("div");
            elem.id = `${id}StatElement`;
            elem.className = "stat";
            let statType = StatType.getById(id);
            elem.style.setProperty("--color-main",statType.style.fillColor);
            elem.style.setProperty("--color-comp",statType.style.fillColorComplement);
            elem.style.setProperty("--max",max);

            // let name = document.createElement("p");
            // name.className = "statName headerFont";
            // name.innerHTML = statType.name.toUpperCase();
            let amt = document.createElement("p");
            amt.className = "statAmt";
            
            // elem.appendChild(name);
            elem.appendChild(amt);

            document.getElementById("Stats").appendChild(elem);
        }
        elem.style.setProperty("--amt",amt);
        elem.querySelector(".statAmt").innerHTML = `${amt}/${max}`;
    }
}