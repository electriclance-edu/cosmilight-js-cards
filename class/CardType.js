class CardType {
    static cardTypes = {};

    constructor(id, title, subtitle, colorName, type, desc) {
        this.title = title;
        this.subtitle = subtitle;
        this.colorName = colorName;
        this.type = type;
        this.desc = desc;

        CardType.cardTypes[id] = this;
    }

    static getById(id) {
        return CardType.cardTypes[id];
    }
}
/*
##### CARD TYPES:
# Spell
- created from Instruments
# Instrument
- creates Spells, immovable
# Castable
- OnDrop of a compatible Spell card, starts a Runecast
*/
var cardTypes = [
    new CardType(
        "harvest",
        "harvest","resource","harvest","spell",
        "There is no one else to receive these treasures but you."
    ),
    // new CardType(
    //     "id", 
    //     "break","object","fire","spell",
    //     "Remind that which has forgotten what it means to break."
    // ),
    // new CardType(
    //     "id", 
    //     "stoke","ember","fire","spell",
    //     "With enough tenacity the lone ember may find itself lighting the dark beyond the fire."
    // ),
    // new CardType(
    //     "id", 
    //     "blink","existence","light","spell",
    //     "In the absence of the last observer, nothing exists."
    // ),
    new CardType(
        "divine",
        "divine","darkness","light","spell",
        "The eye that discerns all fates cannot see its own."
    ),
    new CardType(
        "tree",
        "tree","","world","castable",
        "One that has watched a thousand eras."
    ),
    new CardType(
        "darkness",
        "darkness","","darkness","darkness",
        ""
    ),
    new CardType(
        "boulder",
        "boulder","","world","castable",
        "Bearing cracks that have seen eons."
    ),
    new CardType(
        "resource",
        "","resource","world","castable",
        "Generic resources."
    ),
    new CardType(
        "amogs",
        "amogs","postor","world","castable",
        "When the crewmates are suspicious, but the chips are delicious."
    ),
    new CardType(
        "bigTree",
        "tree","but big","world","castable",
        "1+1 = 2 but BIG"
    ),
];