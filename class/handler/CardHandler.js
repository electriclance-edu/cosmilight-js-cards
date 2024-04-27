// CURRENTLY UNUSED/UNIMPORTED

class CardHandler {
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