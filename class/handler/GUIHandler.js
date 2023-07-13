class GUIHandler {
    static tileElements = {};
    static TileBoard;
    static PlayerInventoryElem;
    static ExternalInventoryElem;
    
    static initialize() {
        GUIHandler.TileBoard = document.getElementById("TileBoard");
        GUIHandler.PlayerInventoryElem = document.getElementById("playerInventoryCards");
        Game.current.getPlayer().hand.renderElement = GUIHandler.PlayerInventoryElem;
        GUIHandler.ExternalInventoryElem = document.getElementById("externalInventoryCards");
    }
    static renderCurrentTileBoard() {
        // console.log("Trying to render current board...")

        var currentBoard = Game.current.getWorld().getCurrentBoard();
        var tileCoordinates = Object.keys(currentBoard.tiles);

        tileCoordinates.forEach((coordinate) => {
            var coords = Point.stringToPoint(coordinate);
            GUIHandler.renderTile(coords.x,coords.y);
        });
    }
    static removeClassFromTileElem(x,y,className) {
        var tileId = `${x},${y}`;
        var elem = document.getElementById(tileId);
        elem.classList.remove(className);
    }
    static addClassToTileElem(x,y,className) {
        var tileId = `${x},${y}`;
        var elem = document.getElementById(tileId);
        elem.classList.add(className);
    }
    static renderTile(x,y) {
        var tileId = `${x},${y}`;

        //if the tile is already rendered, delete it first before rendering it
        if (Object.keys(GUIHandler.tileElements).includes(tileId)) {
            GUIHandler.tileElements[tileId].remove();
        }

        //create the tile
        var tileData = Game.current.getWorld().getCurrentBoard().getTile(x,y);
        var elem = this.generateTileElem(tileData);
        elem.id = tileId;
        elem.draggable = false;
        elem.style = `--x:${x};--y:${y};`;

        if (tileData.inventory.hasItems()) {
            elem.classList.add("hasItems")
        }

        GUIHandler.tileElements[tileId] = elem;
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
    static displayInventory(inventory) {
        document.getElementById("InventoryDisplay").classList.add("state-hidden");
        setTimeout(()=>{
            document.getElementById("InventoryDisplay").classList.remove("state-hidden");
            document.getElementById("inventoryTitle").innerHTML = inventory.title;
            this.renderInventoryIn(GUIHandler.ExternalInventoryElem,inventory); 
        },300);
    }
    static closeInventory() {
        document.getElementById("InventoryDisplay").classList.add("state-hidden");
    }
    static renderInventoryIn(elem, inventory) {
        elem.innerHTML = "";
        Object.entries(inventory.cards).forEach(([inventoryId, card]) => {
            var cardElem = GUIHandler.generateRawCardElement(CardType.getById(card.id));
            cardElem.setAttribute("data-inventoryid",inventoryId);
            elem.appendChild(cardElem);
        });
    }
    static generateRawCardElement(cardType) {
        var imgCSS;
        if (cardType.hasTag("spell")) {
            imgCSS = `--image:url('../resources/img/cards/spell/${cardType.id}.png')`;
        } else {
            imgCSS = `--image:url('../resources/img/cards/${cardType.type}/${cardType.colorName}/${cardType.id}.png')`;
        }
        
        var taglist = cardType.tags.reduce((accumulator, current) => {return accumulator + current + " "},"");
        
        var cardHTML = `
            <div class="card draggable ${taglist}" style="--bg:var(--color-${cardType.colorName})">
            <div class="card-desc">
                ${cardType.lore.description}
            </div>
            <div class="card-bg">
                <div class="card-bg-circle" style="--index:0"></div>
                <div class="card-bg-circle" style="--index:1"></div>
                <div class="card-bg-circle" style="--index:2"></div>
            </div>
            <div class="card-content">
                <div class="card-img-container" style=${imgCSS}></div>
                <div class="card-title-container" id="title-container">
                
                </div>
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