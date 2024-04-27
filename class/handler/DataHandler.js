class DataHandler { 
    static imperfectLoadMessages = [
        "this aint bussin",
        "you make me sad",
        "cancel this guy #dobetterdev",
        "what a waste of cpu power",
        "did u even debug ur code",
        ":((((((",
        "no cap this code aint workin fr",
        "your mom",
        "your mother worked better in bed than this"
    ]
    static dataLoaded = false;
    static toLoad = {
        CardType:[],
        TileType:[],
        StructureType:[],
        StatType:[],
    }
    // Loader functions, functions from each class that are constructor aliases
    static loaders = {
        CardType:CardType.load,
        StatType:StatType.load,
    }
    static sources = [];
    static isPerfectLoad = true;

    static loadData(className, source, data) {
        console.info(`Loading data of type "${className}" from source "${source}" [DataHandler.loadData()]`)
        if (!DataHandler.sources.includes(source)) {
            DataHandler.sources.push(source);
        }

        data.forEach((rawData) => {
            // console.log("Loading",rawData,`of class ${className}`);
            try {
                DataHandler.loaders[className](rawData);
            } catch (Error) {
                DataHandler.isPerfectLoad = false;
                console.group();
                console.warn(`DataHandler.loadData(): Failed to load data of type "${className}" with data`,rawData);
                console.error(Error);
                console.groupEnd();
            }
        });
    }
    static addObjectToLoad(className, source, data) {
        console.info(`Adding data of type "${className}" from source "${source}" for batch load [DataHandler.addToLoad()]`);
        if (!DataHandler.sources.includes(source)) {
            DataHandler.sources.push(source);
        }
        
        DataHandler.toLoad[className] = DataHandler.toLoad[className].concat(data);
    }
    static loadAllData() {
        // the monstrosity in ${} converts the list of sources into a separated list formatted like "source", "source", etc
        // the regex removes the last , at the end of the string list
        // there is definitely a better way to implement this but it's just a debug comment so, :D
        console.info(`Batch loading all data from source${DataHandler.sources.length > 1 ? "s" : ""}${DataHandler.sources.reduce((acc, val) => {
            return acc + ` "${val}",`;
        },"").replace(/.$/, '')} [DataHandler.loadAllData()]`);

        Object.keys(DataHandler.toLoad).forEach((className) => {
            // console.log("loadAllData(): Beginning to load class", className);
            DataHandler.toLoad[className].forEach((rawData) => {
                // console.log("Loading",rawData,`of class ${className}`);
                try {
                    DataHandler.loaders[className](rawData);
                } catch (Error) {
                    DataHandler.isPerfectLoad = false;
                    console.group();
                    console.warn(`DataHandler.loadAllData(): Failed to load data of type "${className}" with data`,rawData);
                    console.error(Error);
                    console.groupEnd();
                }
            });
        });

        if (DataHandler.isPerfectLoad) {
            console.info("Perfect load! [DataHandler.loadAllData()]");
        } else {
            var stupidDebug = randElem(DataHandler.imperfectLoadMessages);
            console.warn(`DataHandler.loadAllData(): Imperfect load, see console for details... ${stupidDebug}...`);
        }
    }
}

/*
var cardTypes = [
    new CardType(),
    new CardType(),
    new CardType(),
    // new CardType({
    //     id:"stoke",
    //     lore:{
    //         mainTitle:"stoke",
    //         subTitle:"ember",
    //         description:"With enough tenacity a lone ember may find itself lighting the dark beyond its fire.",
    //     },
    //     colorName:"fire",
    //     tags:["spell"],
    //     attributes:{
            
    //     },
    // }),
    // new CardType({
    //     id:"",
    //     lore:{
    //         mainTitle:"",
    //         subTitle:"",
    //         description:"",
    //     },
    //     colorName:"",
    //     tags:["spell",""],
    //     attributes:{
            
    //     },
    // }),
    // new CardType({
    //     id:"",
    //     lore:{
    //         mainTitle:"",
    //         subTitle:"",
    //         description:"",
    //     },
    //     colorName:"",
    //     tags:["spell",""],
    //     attributes:{
            
    //     },
    // }),
    // new CardType({
    //     id:"thread",
    //     lore:{
    //         mainTitle:"Thread",
    //         subTitle:"",
    //         description:"The fiber that composes all living beings.",
    //     },
    //     colorName:"",
    //     tags:["spell"],
    //     attributes:{
            
    //     },
    // }),
    // new CardType({
    //     id:"seed",
    //     lore:{
    //         mainTitle:"Seed",
    //         subTitle:"",
    //         description:"Where life once grew anew.",
    //     },
    //     colorName:"",
    //     tags:["resource"],
    //     attributes:{
            
    //     },
    // }),
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
    // new CardType(
    //     "divine",
    //     "divine","darkness","light","spell",
    //     "The eye that discerns all fates cannot see its own."
    // ),
    // new CardType(
    //     "tree",
    //     "tree","","world","castable",
    //     "One that has watched a thousand eras."
    // ),
    // new CardType(
    //     "darkness",
    //     "darkness","","darkness","darkness",
    //     ""
    // ),
    // new CardType(
    //     "boulder",
    //     "boulder","","world","castable",
    //     "Bearing cracks that have seen eons."
    // ),
    // new CardType(
    //     "resource",
    //     "","resource","world","castable",
    //     "Generic resources."
    // ),
];
*/