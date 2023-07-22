class GUIHandler {
    static tileElements = {};
    static TileBoard;
    static PlayerHandContainer;
    static GroundInventoryElem;
    
    static initialize() {
        GUIHandler.TileBoard = document.getElementById("TileBoard");
        GUIHandler.PlayerHandContainer = document.getElementById("PlayerHandContainer");
        GUIHandler.ExternalInventoryContainer = document.getElementById("ExternalInventoryContainer");
        GUIHandler.StructureDetailDisplay = document.getElementById("StructureDetailDisplay");
    }
    static renderCurrentTileBoard() {
        // var tileCoordinates = Object.keys(Game.board.tiles);

        // tileCoordinates.forEach((coordinate) => {
        //     var coords = Point.stringToPoint(coordinate);
        //     GUIHandler.renderTile(coords);
        // });
    }
    static logText(string,location = "center",persistence = 15000) {
        var elem = document.createElement("p");

        if (location == "center") {
            let index = 0;
            string.split(" ").forEach((char) => {
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
            elem.innerHTML = string;
            elem.classList.add("log-cursor");
            elem.style = `--log-persistence:${persistence}ms;--x:${mousePosition.x};--y:${mousePosition.y}`;
            document.getElementById("FollowCursorTextDisplay").appendChild(elem);
        }
        
        setTimeout(()=>{
            elem.remove();
        },persistence);
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
                ${tileData.hasStructure() ? `<img class="structureSprite ${randElem(["flipped",""])}" src="resources/img/structure/${tileData.getStructure().typeId}.png" style="--rand-x-offset:${randInt(10)}px; --rand-y-offset:${randInt(10)}px;"/>` : ""}
                <img class="tileSprite ${randElem(["flipped",""])}" style="--rand-x-offset:${randInt(7)}px; --rand-y-offset:${randInt(5)}px; filter:hue-rotate(${randInt(30) - 20}deg) brightness(${randFloat(0.1) + 0.9})" src="resources/img/tiles/${tileData.typeId}/${randInt(tileData.getType().amountOfSprites)}.png"/>
            </div>
        `;

        return parseHTML(tileHTML);
    }
    static clearInventories(container = GUIHandler.ExternalInventoryContainer) {
        container.innerHTML = "";
    }
    static displayInventory(inventory, parent = GUIHandler.ExternalInventoryContainer, vanishable = true) {
        GUIHandler.displayInventories([inventory],parent,vanishable);
    }
    static displayInventories(inventoryArray, parent = GUIHandler.ExternalInventoryContainer, vanishable = true) {
        parent.classList.add("state-hidden");
        setTimeout(()=>{
            inventoryArray.forEach((inventory) => { 
                var possiblePreexistingElement = parent.querySelector(`#${inventory.localId}`);
                if (!!possiblePreexistingElement) {
                    possiblePreexistingElement.remove();
                }
                var elem = GUIHandler.createInventoryElem(inventory,vanishable);
                parent.appendChild(elem);
                inventory.setIsRendered(true);
                // console.log(elem);
                parent.classList.remove("state-hidden");
            });
        },300);
    }
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
        GUIHandler.placeInventoryCardElem(inventory,cardParent);

        return fragment.firstElementChild;
    }
    static displayStructureDetails(structure) {
        var type = structure.type;
        document.getElementById("structureTitle").innerHTML = type.getTitle();
        document.getElementById("structureDescription").innerHTML = type.lore.description;
        
        var statContainer = document.getElementById("structureStatContainer");
        statContainer.setAttribute("data-fillAbsMax",0);
        statContainer.innerHTML = "";

        if (structure.hasStats()) {
            Object.values(structure.stats).forEach((stat) => {
                if (stat.type.style.visibility == "visible") {
                    let elem = GUIHandler.generateStatElem(stat);
                    stat.renderElem = elem;
                    statContainer.appendChild(elem);
                }
            });
        }
    }
    static updateScreenCull(newPosition = Game.player.location) {
        newPosition = newPosition.asInt();
        //get all tiles visible on screen
        var screenWidthInTiles = new Point(
            Math.ceil(window.innerWidth / tileWidth / 2 - 1.5),
            Math.ceil(window.innerHeight / tileHeight / 2 - 0.5)
        );
        // var screenWidthInTiles = new Point(3,3);

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
        var cullCornerA = new Point(cornerA.x - 2,cornerA.y + 2);
        var cullCornerB = new Point(cornerB.x + 2, cornerB.y - 2);
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
    static toggleElemVisibility(elem,state) {
        if (state) {
            elem.classList.remove("state-invisible");
            elem.style.display = "block";
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
        elem.querySelector(".progressBar-text").innerHTML = `${Math.round(value)}/${Math.round(max)}`;
    }
    static generateStatElem(stat) {
        var statContainer = document.getElementById("structureStatContainer");
        if (stat.max > statContainer.getAttribute("data-fillAbsMax")) {
            statContainer.style = `--fill-abs-max:${stat.max}`;
            statContainer.setAttribute("data-fillAbsMax",stat.max);
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
        GUIHandler.placeInventoryCardElem(inventory,cardParent);
    }
    static placeInventoryCardElem(inventory,parent) {
        Object.entries(inventory.cards).forEach(([inventoryId, card]) => {
            var cardElem = GUIHandler.generateRawCardElement(CardType.getById(card.id));
            cardElem.setAttribute("data-inventoryid",inventoryId);
            parent.appendChild(cardElem);
        });
    }
    static moveTileBoard(x,y) {
        GUIHandler.TileBoard.style = `
            --x:${-x * tileWidth};
            --y:${y * tileHeight};
        `;
    }
    static generateRawCardElement(cardType) {
        let type;
        if (cardType.hasTag("spell")) {
            type = "spell";
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
            <div class="card-title-container" id="title-container">
            
            </div>
            <div class="card-img-container" style=${imgCSS}></div>
            </div>
            </div>
        `;
        var fragment = parseHTMLDocumentFragment(cardHTML);
        
        var titleContainer = fragment.querySelector("#title-container");
        titleContainer.appendChild(GUIHandler.generateCardTitleElement(cardType.lore));
        
        fragment.firstElementChild.setAttribute("data-cardTypeId",cardType.id);
        return fragment.firstElementChild;
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
            var char = elem("div","card-title-char headerFont",letter.toUpperCase());
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
}