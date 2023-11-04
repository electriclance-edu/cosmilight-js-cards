class CardHandler {
    static generateRawCardElement(cardType) {
        let type;
        if (cardType.hasTag("spell")) {
            type = "spell";
        } else if (cardType.hasTag("instrument")) {
            type = "instrument";
        } else if (cardType.hasTag("item")) {
            type = "item";
        } else if (cardType.hasTag("part")) {
            type = "part";
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
            let element = CardHandler.generateRawCardElement(card.type);
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
    static renderCreditsCards() {
        let meCard = new Card("credits_lanceLibatique");
        let me = CardHandler.generateRawCardElement(meCard.type);
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
            new Card("credits_jom"),
            new Card("credits_mariya"),
        ].forEach((card)=>{
            let element = CardHandler.generateRawCardElement(card.type);
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