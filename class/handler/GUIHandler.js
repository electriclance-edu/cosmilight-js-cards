class GUIHandler {
    static tileElements = {};
    static TileBoard;
    static CullPersistence = new Point(0,0);
    static CullRevealage = new Point(3,3);
    static frame = 0;
    // static CullPersistence = new Point(2,2);
    // static CullRevealage = new Point(2,2);
    
    static initialize() {
        GUIHandler.TileBoard = document.getElementById("TileBoard");
        GUIHandler.PlayerHandContainer = document.getElementById("PlayerHandContainer");
        GUIHandler.PlayerStatContainer = document.getElementById("PlayerStatContainer");
        GUIHandler.StructureDetailDisplay = document.getElementById("StructureDetailDisplay");
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
        
        FogHandler.renderAllFog();
        LightHandler.renderAllLight();
    }
    static renderCurrentTileBoard() {
        // var tileCoordinates = Object.keys(Game.board.tiles);

        // tileCoordinates.forEach((coordinate) => {
        //     var coords = Point.stringToPoint(coordinate);
        //     GUIHandler.renderTile(coords);
        // });
    }
    static logText(content,location = "center",persistence = 15000,title) {
        if (location == "center") {
            var elem = document.createElement("p");
            let index = 0;
            content.split(" ").forEach((char) => {
              let charElement = document.createElement("span");
              charElement.innerHTML = char + " ";
              charElement.style = `
                --index:${index};
                --mod-index:${index++ % 5};
              `;
              index += char.length + (char.includes(".") || char.includes(",") ? 10 : 0);
              elem.appendChild(charElement);
            });
            elem.style = `--log-persistence:${persistence}ms;`;
            document.getElementById("PlayerTextDisplay").appendChild(elem);
        } else if (location == "cursor") {
            var elem = document.createElement("p");
            elem.innerHTML = content;
            elem.classList.add("log-cursor");
            elem.style = `--log-persistence:${persistence}ms;--x:${mousePosition.x};--y:${mousePosition.y}`;
            document.getElementById("FollowCursorTextDisplay").appendChild(elem);
        } else if (location == "player") {
            var elem = document.createElement("p");
            elem.innerHTML = content;
            elem.classList.add("log-cursor");
            elem.style = `--log-persistence:${persistence}ms;--x:${window.innerWidth / 2};--y:${window.innerHeight / 2}`;
            document.getElementById("FollowCursorTextDisplay").appendChild(elem);
        } else if (location == "persistent-cursor") {
            document.getElementById("PersistentCursorTextDisplay").innerHTML = "";
            let title = aliasElem("p","headerFont txt-size-header");
            if (content instanceof HTMLElement) {
                document.getElementById("PersistentCursorTextDisplay").appendChild(content);
                content.appendChild(title);
                document.getElementById("PersistentCursorTextDisplay").classList.add(mousePosition.y > window.innerHeight - 500 ? "state-up" : "state-down");
            } else {
                document.getElementById("PersistentCursorTextDisplay").innerHTML = content;
                document.getElementById("PersistentCursorTextDisplay").appendChild(title);
            }
            if (content == "") {
                document.getElementById("PersistentCursorTextDisplay").classList.remove("state-down");
                document.getElementById("PersistentCursorTextDisplay").classList.remove("state-up");
            }
        }

        if (location != "persistent-cursor") {
            setTimeout(()=>{
                elem.remove();
            },persistence);
        }
    }
    static removeClassFromTileElem(point,className) {
        var tileId = `${point.x},${point.y}`;
        var elem = document.getElementById(tileId);
        elem.classList.remove(className);
    }
    static addClassToTileElem(point,className) {
        var tileId = `${point.x},${point.y}`;
        var elem = document.getElementById(tileId);
        elem.classList.add(className);
    }
    static unrenderTile(point) {
        document.getElementById(`${point.x},${point.y}`).classList.add("state-invisible");
        Game.board.setIsRendered(point,false);
        setTimeout(()=>{
            try {
                if (!Game.board.getTile(point).isRendered) {
                    document.getElementById(`${point.x},${point.y}`).remove();
                    GUIHandler.tileElements[point.str] = false;
                }
            } catch (Error) {
                //if tile doesnt exist, do nothing
            }
        },300);
    }
    static renderTile(point) {
        var tileId = point.str;

        //if the tile is already rendered, aint do nothin
        if (GUIHandler.tileElements[tileId]) {
            return;
        }

        if (Game.board.isRendered(point)) {
            return;
        }

        //create the tile
        Game.board.setIsRendered(point,true);
        var tileData = Game.board.getTile(point);
        var elem = this.generateTileElem(tileData);
        elem.id = tileId;
        elem.draggable = false;
        elem.style = `--x:${point.x};--y:${point.y};`;
        this.toggleElemVisibility(elem,true);

        if (tileData.inventory.hasItems()) {
            elem.classList.add("hasItems")
        }

        GUIHandler.tileElements[tileId] = true;
        GUIHandler.TileBoard.appendChild(elem);
    }
    static generateTileElem(tileData) {
        var tileHTML = `
            <div class="tile ${tileData.typeId}">
                <img class="tileSprite ${randElem(["flipped",""])}" style="--rand-x-offset:${randInt(7)}px; --rand-y-offset:${randInt(5)}px; filter:hue-rotate(${randInt(30) - 20}deg) brightness(${randFloat(0.1) + 0.9})" src="resources/img/tiles/${tileData.typeId}/${randInt(tileData.getType().amountOfSprites)}.png"/>
            </div>
        `;

        return parseHTML(tileHTML);
    }
    // static clearInventories(container = GUIHandler.ExternalInventoryContainer) {
    //     container.innerHTML = "";
    // }
    // static displayInventory(inventory, parent = GUIHandler.ExternalInventoryContainer, vanishable = true) {
    //     GUIHandler.displayInventories([inventory],parent,vanishable);
    // }
    // static displayInventories(inventoryArray, parent = GUIHandler.ExternalInventoryContainer, vanishable = true) {
    //     parent.classList.add("state-hidden");
    //     setTimeout(()=>{
    //         inventoryArray.forEach((inventory) => { 
    //             var possiblePreexistingElement = parent.querySelector(`#${inventory.localId}`);
    //             if (!!possiblePreexistingElement) {
    //                 possiblePreexistingElement.remove();
    //             }
    //             var elem = GUIHandler.createInventoryElem(inventory,vanishable);
    //             parent.appendChild(elem);
    //             inventory.setIsRendered(true);
    //             // console.log(elem);
    //             parent.classList.remove("state-hidden");
    //         });
    //     },300);
    // }
    // static closeAllInventories() {
    //     Array.from(GUIHandler.ExternalInventoryContainer.children).forEach((child)=>{
    //         GUIHandler.closeInventory(child);
    //     });
    // }
    static closeInventory(elem) {
        elem.classList.add("state-vanished");
        setTimeout(()=>{
            getInventory(elem.querySelector(".inventory").getAttribute("data-inventoryType")).setIsRendered(false);
            elem.remove();
        },300);
    }
    static createInventoryElem(inventory,vanishable) {
        var inventoryHTML = `
            <div class="inventoryParent" id="${inventory.localId}">
                <div class="inventory-bg validInventoryDrop externalInventory" ${vanishable ? 'onclick="GUIHandler.closeInventory(this.parentNode)' : ''}"></div>
                <p class="inventoryTitle txt-size-header headerFont txt-lined">${inventory.title}</p>
                <div class="inventory" data-inventoryType="${inventory.localId}" id="inventoryCards"></div>
            </div>
        `;
        var fragment = parseHTMLDocumentFragment(inventoryHTML);
        var cardParent = fragment.querySelector("#inventoryCards");
        cardParent.id = "";
        GUIHandler.placeInventoryCardElements(inventory,cardParent);

        return fragment.firstElementChild;
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
    static updateScreenCull() {
        var newPosition = Game.player.location;
        newPosition = newPosition.asInt();
        //get all tiles visible on screen
        // var screenWidthInTiles = new Point(
        //     Math.ceil(window.innerWidth / tileWidth / 2 - 1.5),
        //     Math.ceil(window.innerHeight / tileHeight / 2 - 0.5)
        // );
        var screenWidthInTiles = GUIHandler.CullRevealage;

        this.cullTileRectangle(
            new Point(
                parseInt(newPosition.x - screenWidthInTiles.x),
                parseInt(newPosition.y + screenWidthInTiles.y) 
            ),
            new Point(
                parseInt(newPosition.x + screenWidthInTiles.x),
                parseInt(newPosition.y - screenWidthInTiles.y)
            )
        )
    }
    static cullTileRectangle(cornerA,cornerB) {
        var cullCornerA = new Point(cornerA.x - GUIHandler.CullPersistence.x,cornerA.y + y);
        var cullCornerB = new Point(cornerB.x + GUIHandler.CullPersistence.x, cornerB.y - GUIHandler.CullPersistence.y);
        //hide all displayed tiles
        Array.from(document.getElementById("TileBoard").children).forEach((elem)=>{
            let x = elem.style.getPropertyValue("--x");
            let y = elem.style.getPropertyValue("--y");
            if ((x < cullCornerA.x || x > cullCornerB.x) || (y > cullCornerA.y || y < cullCornerB.y)) {
                this.toggleTileVisibility(new Point(x,y),false);
            }
        });
        //cull border of rectangle
        // for (var x = cullCornerA.x; x <= cullCornerB.x; x++) {
        //     [cullCornerA.y,cullCornerB.y].forEach((y)=>{
        //         this.toggleTileVisibility(new Point(x,y),false);
        //     });
        // }
        // for (var y = cullCornerA.y - 1; y >= cullCornerB.y + 1; y--) {
        //     [cullCornerA.x,cullCornerB.x].forEach((x)=>{
        //         this.toggleTileVisibility(new Point(x,y),false);
        //     });
        // }
        //display inside of rectangle
        for (var x = cornerA.x; x <= cornerB.x; x++) {
            for (var y = cornerA.y; y >= cornerB.y; y--) {
                this.toggleTileVisibility(new Point(x,y),true);
            }
        }
    }
    static toggleTileVisibility(point,state = false) {
        try {
            if (state) {
                GUIHandler.renderTile(point);
            } else {
                GUIHandler.unrenderTile(point);
            }
        } catch (Error) {
            // do nothing, most likely error occurs when tile doesnt exist or isnt rendered 
        }
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
    static updateInventory(inventory) {
        if (!inventory.isRendered) {
            return;
        }
        var cardParent = document.getElementById(inventory.localId).querySelector(".inventory");
        cardParent.innerHTML = "";
        GUIHandler.placeInventoryCardElements(inventory,cardParent);
    }
    // static renderLoreObject(lore) {
    //     var loreElem = elem("div");
    //     loreElem.classList.add("log-persistent-cursor");
    //     loreElem.classList.add("log-persistent-cursor-lore");

    //     ["description","technical_description"].forEach((key)=>{
    //         if (!lore.hasOwnProperty(key)) {
    //             return;
    //         }
    //         let textElem;
    //         if (key == "description") {
    //             textElem = elem("div","filter-aberration",lore[key]);
    //         } else if (key == "technical_description") {
    //             textElem = elem("div","",lore[key]);
    //         }
    //         loreElem.appendChild(textElem);
    //     });

    //     return loreElem;
    // }
    static placeInventoryCardElements(inventory,parent) {
        Object.entries(inventory.cards).forEach(([inventoryId, card]) => {
            //check if card hasnt already been displayed
            let hasBeenDisplayed = false;
            Array.from(parent.children).forEach((child) => {
                if (child.getAttribute("data-typeId") == card.type.id) {
                    hasBeenDisplayed = true;
                    child.querySelector(".card-count").innerHTML = inventory.countOf(card.type.id);
                    return;
                }
            });
            if (hasBeenDisplayed) return;
            
            var cardElem = GUIHandler.generateRawCardElement(CardType.getById(card.id));

            cardElem.addEventListener("mouseenter",(e)=>{
                // var elem = GUIHandler.renderLoreObject(card.type.lore);
                // GUIHandler.logText(elem,"persistent-cursor",null,card.type.title);
            });
            // cardElem.addEventListener("mouseleave",(e)=>{
            //     GUIHandler.logText("","persistent-cursor");
            // });

            if (inventory.isNew(card)) {
                cardElem.classList.add("state-new");
            }
            cardElem.setAttribute("data-inventoryid",inventoryId);
            parent.appendChild(cardElem);
        });
    }
    static moveTileBoard() {
        let position = Game.player.location;
        GUIHandler.TileBoard.style = `
            --x:${-position.x * tileWidth};
            --y:${position.y * tileHeight};
        `;
    }
    static generateRawCardElement(cardType) {
        let type;
        if (cardType.hasTag("spell")) {
            type = "spell";
        } else if (cardType.hasTag("instrument")) {
            type = "instrument";
        } else if (cardType.hasTag("item")) {
            type = "item";
        }
        var imgCSS = `--image:url('../resources/img/cards/${type}/${cardType.id}.png')`;

        var taglist = cardType.tags.reduce((accumulator, current) => {return accumulator + current + " "},"");
        
        // Part of cardHTML, removed for optimization purposes.
        // <div class="card-desc">
        //     ${cardType.lore.description}
        // </div>

        var cardHTML = `
            <div class="card draggable ${taglist}" style="--bg:var(--color-${cardType.colorName})">
                <div class="card-bg">
                    <div class="card-bg-circle" style="--index:0"></div>
                    <div class="card-bg-circle" style="--index:1"></div>
                    <div class="card-bg-circle" style="--index:2"></div>
                </div>
                <div class="card-content">
                    <div class="card-title-container" id="title-container"></div>
                    <div class="card-img-container" style=${imgCSS}></div>
                </div>
                <p class="txt-size-header headerFont card-count"></p>
            </div>
        `;
        var fragment = parseHTMLDocumentFragment(cardHTML);
        
        var titleContainer = fragment.querySelector("#title-container");
        titleContainer.appendChild(GUIHandler.generateCardTitleElement(cardType.lore));
        
        fragment.firstElementChild.setAttribute("data-typeId",cardType.id);
        return fragment.firstElementChild;
    }
    static displayBag(bag) {
        GUIHandler.toggleDarkOverlay("BagDisplay",true,true);
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
    static renderRequirementsObject(reqs,pretext = "Requires:") {
        var reqsElem = elem("div");
        reqsElem.classList.add("log-persistent-cursor");
        reqsElem.classList.add("log-persistent-cursor-reqs");
        pretext = elem("p","log-pretext",pretext);
        reqsElem.appendChild(pretext);

        Object.keys(reqs).forEach((key)=>{
            let split = key.split("-");
            let objClass = split[0];
            let typeId = split[1];
            let amt = reqs[key];

            if (objClass == "stat") {
                let stat = StatType.getById(typeId);
                let statElem = document.createElement("elem");
                statElem.classList.add("log-statText");
                statElem.classList.add("headerFont");
                statElem.style = `--fillColor:${stat.style.fillColor};--txtColor:${stat.style.fillColorAccent};`;
                statElem.innerHTML = `${amt} ${stat.name}`;
                reqsElem.appendChild(statElem);
            } else if (objClass == "card") {
                let card = CardType.getById(typeId);
                let cardElem = document.createElement("elem");
                cardElem.classList.add("log-cardText");
                cardElem.classList.add("headerFont");
                cardElem.style = `--color:var(--color-${card.colorName})`;
                cardElem.innerHTML = `${amt} ${card.name}`;
                reqsElem.appendChild(cardElem);
            } else {
                console.warn(`GUIHandler.renderRequirementsObject(): Attempted to render requirement of class "${objClass}", however no such class exists.`);
            }
        })

        return reqsElem;
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
        document.getElementById("Screen-Credits").remove();
    }
    static displaySelection(cards,lore,invoker,closeable = true) {
        if (cards instanceof Object) {
            console.log("bad code here");
            cards = Object.values(cards);
        }

        GUIHandler.selectionInvoker = invoker;
        GUIHandler.SelectionCardContainer.innerHTML = "";
        GUIHandler.toggleDarkOverlay("CardSelection",true,closeable);

        GUIHandler.SelectionTitle.innerHTML = lore.title;
        GUIHandler.SelectionDesc.innerHTML = lore.description;

        let index = 0;
        cards.forEach((card)=>{
            //initialize card element
            let element = GUIHandler.generateRawCardElement(card.type);
            element.classList.add("undraggable");
            element.classList.add("starCard");
            element.querySelector(".card-bg").style.backgroundPosition = `${randInt(100)}% ${randInt(100)}%`;
            element.setAttribute("data-index",index++);
            //add extra flavor text and technical description below card
            let desc = elem("div","card-desc");
            let flavor = elem("div","card-desc-flavor filter-aberration",card.type.lore.description);
            let technical = elem("div","card-desc-technical",card.type.lore.technical_description);
            desc.appendChild(flavor);
            desc.appendChild(technical);
            element.appendChild(desc);
            //add onSelect event once clicked
            element.addEventListener("click",(e)=>{
                GameEventHandler.onSelect(cards[e.target.getAttribute('data-index')]);
            });
            if (card.type.hasOtherProperty("cost")) {
                element.addEventListener("mouseenter",(e)=>{
                    var elem = GUIHandler.renderRequirementsObject(card.type.other.cost,"Costs:");
                    GUIHandler.logText(elem,"persistent-cursor");
                });
                element.addEventListener("mouseleave",(e)=>{
                    GUIHandler.logText("","persistent-cursor");
                });
            }

            GUIHandler.SelectionCardContainer.appendChild(element);
            //add the diamond spacer after the card if they're not the last one
            if (index < cards.length) {
                let spacer = elem("div","spacer");
                GUIHandler.SelectionCardContainer.appendChild(spacer);
            }
        });
    }
    static renderCredits() {
        let meCard = new Card("credits_lanceLibatique");
        let me = GUIHandler.generateRawCardElement(meCard.type);
        me.classList.add("undraggable");
        me.classList.add("starCard");
        me.querySelector(".card-bg").style.backgroundPosition = `${randInt(100)}% ${randInt(100)}%`;
        me.appendChild(elem("div","card-desc",meCard.type.lore.description));
        document.getElementById("credits-me").appendChild(me);
        [
            new Card("credits_migs"),
            new Card("credits_paolo"),
            new Card("credits_bea"),
            new Card("credits_lanceChiu"),
            new Card("credits_leandro"),
        ].forEach((card)=>{
            let element = GUIHandler.generateRawCardElement(card.type);
            element.classList.add("undraggable");
            element.classList.add("starCard");
            element.querySelector(".card-bg").style.backgroundPosition = `${randInt(100)}% ${randInt(100)}%`;
            element.appendChild(elem("div","card-desc",card.type.lore.description));
            document.getElementById("credits-friends").appendChild(element);
        });
    }
    static giveHoverDescription(elem,desc) {
        console.log("TODO: make me");
    }
}