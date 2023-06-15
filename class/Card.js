class Card {
    constructor(type, elem) {
        this.type = type;
        this.elem = elem;
    }
    setElem(elem) {
        this.elem = elem;
    }
    hasElem() {
        return !(this.elem == undefined);
    }
}