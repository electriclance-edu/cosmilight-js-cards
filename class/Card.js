class Card {
    constructor(title, subtitle, colorName, type, desc) {
        this.title = title;
        this.subtitle = subtitle;
        this.colorName = colorName;
        this.type = type;
        this.desc = desc;
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
var cards = [
    new Card(
        "harvest","resource","harvest","spell",
        "There is no one else to receive these treasures but you."
    ),
    new Card(
        "break","object","fire","spell",
        "Remind that which has forgotten what it means to break."
    ),
    new Card(
        "stoke","ember","fire","spell",
        "With enough tenacity the lone ember may find itself lighting the dark beyond the fire."
    ),
    new Card(
        "blink","existence","light","spell",
        "In the absence of the last observer, nothing exists."
    ),
    new Card(
        "divine","darkness","light","spell",
        "The eye that discerns all fates cannot see its own."
    ),
    new Card(
        "tree","","world","castable",
        "One that has watched a thousand eras."
    ),
    new Card(
        "darkness","","darkness","darkness",
        ""
    ),
    new Card(
        "darkness","","darkness","darkness",
        ""
    ),
    new Card(
        "darkness","","darkness","darkness",
        ""
    ),
    new Card(
        "darkness","","darkness","darkness",
        ""
    ),
    new Card(
        "boulder","","world","castable",
        "Bearing cracks that have seen eons."
    ),
    new Card(
        "tree","","world","castable",
        "One that has watched a thousand eras."
    ),
    new Card(
        "darkness","","darkness","darkness",
        ""
    ),
    new Card(
        "boulder","","world","castable",
        "Bearing cracks that have seen eons."
    ),
];