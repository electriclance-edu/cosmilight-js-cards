/*
STATS THAT COULD EXIST
Consumption - for biological things?
*/
DataHandler.loadData("StatType","baseCosmilight",[
    {
        id:"blood",
        properties:{
            style:{
                fillColor:"var(--color-health)",
                fillColorComplement:"var(--color-health-complement)"
            },
            lore:{
                name:"Blood",
                description:"Thick. Warm. The fuel of all lifeforms.",
                technical_description:"Produced by Hearts. Typically used by body parts."
            }
        }
    },
    {
        id:"interactionDistance",
        properties:{
            style:{
                fillColor:"white",
                fillColorComplement:"white",
                visibility:"hidden"
            },
            lore:{
                name:"Interaction Distance",
                desc:"How far you can reach."
            }
        }
    },
    {
        id:"cycleSpeed",
        properties:{
            style:{
                fillColor:"var(--color-cycle-cycle-complement)",
                fillColorComplement:"var(--color-cycle)",
                visibility:"hidden"
            },
            lore:{
                name:"Cycle Speed",
                desc:"Attunement to one's time."
            }
        }
    },
    {
        id:"upkeep",
        properties:{
            style:{
                fillColor:"white",
                fillColorComplement:"white",
                // visibility:"hidden"
            },
            lore:{
                name:"Upkeep",
                desc:"Liam is so upkeep"
            }
        }
    },
    {
        id:"lore",
        properties:{
            style:{
                fillColor:"white",
                fillColorComplement:"white",
                // visibility:"hidden"
            },
            lore:{
                name:"Lore",
                desc:"Innate knowledge stored within."
            }
        }
    },
    {
        id:"cycle",
        properties:{
            style:{
                fillColor:"var(--color-cycle)",
                fillColorComplement:"var(--color-cycle-complement)",
                visibility:"hidden"
            },
            lore:{
                name:"Cycle",
                desc:"One of the few remaining blessings of the custodian of time."
            }
        }
    },
    {
        id:"sap",
        properties:{
            style:{
                fillColor:"var(--color-nature)",
                fillColorComplement:"var(--color-nature)",
                visibility:"hidden"
            },
            lore:{
                name:"Sap",
                desc:"The blood of plants."
            }
        }
    },
    {
        id:"liquidStorage",
        properties:{
            style:{
                fillColor:"white",
                fillColorComplement:"white",
                visibility:"hidden"
            },
            lore:{
                name:"Liquid Storage",
                desc:"The amount of liquid one can store."
            }
        }
    },
    {
        id:"knowledge",
        properties:{
            style:{
                fillColor:"var(--color-knowledge)",
                fillColorComplement:"var(--color-knowledge-complement)",
                fillColorAccent:"var(--bg-main)"
            },
            lore:{
                name:"Experience",
                desc:"Familiarity with aspects of the universe."
            },
            strictLimits:{
                min:0
            }
        }
    },
    {
        id:"health",
        properties:{
            style:{
                fillColor:"var(--color-health)",
                fillColorComplement:"var(--color-health-complement)",
                fillColorAccent:"var(--bg-main)"
            },
            lore:{
                name:"health",
                desc:"One's distance from death."
            },
            strictLimits:{
                min:0
            }
        }
    },
    {
        id:"integrity",
        properties:{
            style:{
                fillColor:"white",
                fillColorComplement:"white",
                fillColorAccent:"var(--bg-accent)",
                visibility:"hidden",
            },
            lore:{
                name:"integrity",
                desc:"The strength of one's body."
            },
            strictLimits:{
                min:0
            }
        }
    },
    {
        id:"water",
        properties:{
            style:{
                fillColor:"var(--color-water)",
                fillColorComplement:"var(--color-water-complement)",
                fillColorAccent:"var(--bg-main)"
            },
            lore:{
                name:"water",
                desc:"The lifeblood of magic, the carrier of life."
            }
        }
    },
    {
        id:"slumber",
        properties:{
            style:{
                fillColor:"var(--color-energy)",
                fillColorComplement:"var(--color-energy-complement)",
            },
            lore:{
                name:"Slumber",
                desc:"."
            }
        }
    },
    {
        id:"fuel",
        properties:{
            style:{
                fillColor:"var(--color-energy)",
                fillColorComplement:"var(--color-energy-complement)",
            },
            lore:{
                name:"fuel",
                desc:"Energy in bound, physical form."
            }
        }
    },
    {
        id:"heating",
        properties:{
            style:{
                fillColor:"var(--color-fire-complement)",
                fillColorComplement:"var(--color-fire)",
                fillColorAccent:"var(--bg-main)",
            },
            lore:{
                name:"heating",
                desc:"The amount of heat produced."
            }
        }
    },
    {
        id:"heat",
        properties:{
            style:{
                fillColor:"var(--color-fire)",
                fillColorComplement:"var(--color-fire-complement)",
            },
            lore:{
                name:"heat",
                desc:"Motion, condensed."
            }
        }
    },
    {
        id:"fruitsGiven",
        properties:{
            style:{
                fillColor:"var(--color-fire)",
                fillColorComplement:"var(--color-fire-complement)",
                visibility:"hidden",
            },
            lore:{
                name:"fruits given",
                desc:"Light fruits given."
            }
        }
    },
    {
        id:"glow",
        properties:{
            style:{
                fillColor:"var(--color-light)",
                fillColorComplement:"var(--color-light-complement)",
                fillColorAccent:"var(--bg-main)"
            },
            lore:{
                name:"Glow",
                desc:"The protective energy of the old world."
            }
        }
    },
    {
        id:"unlocks",
        properties:{
            style:{
                fillColor:"var(--color-light)",
                fillColorComplement:"var(--color-light-complement)",
                fillColorAccent:"var(--bg-main)"
            },
            lore:{
                name:"Unlocks",
                desc:"Scoring for ALAB 2023 Computron Fundraising Booth."
            }
        }
    },
    {
        id:"mana",
        properties:{
            style:{
                fillColor:"var(--color-energy)",
                fillColorComplement:"var(--color-energy-complement)",
                fillColorAccent:"var(--bg-main)"
            },
            lore:{
                name:"Mana",
                desc:"The energy that pervades this new world."
            }
        }
    },
    {
        id:"light",
        properties:{
            style:{
                fillColor:"var(--color-light)",
                fillColorComplement:"var(--color-light-complement)",
                fillColorAccent:"var(--bg-main)"
            },
            lore:{
                name:"light",
                desc:"That which pierces the darkness."
            }
        }
    },
    {
        id:"hairLuxuriousness",
        properties:{
            style:{
                fillColor:"var(--color-water)",
                fillColorComplement:"var(--color-harvest)",
                fillColorAccent:"var(--bg-main)"
            },
            lore:{
                name:"hair luxury",
                desc:"Strength that befits a god."
            }
        }
    },
    {
        id:"rat",
        properties:{
            style:{
                fillColor:"var(--color-fire)",
                fillColorComplement:"var(--color-health)",
                fillColorAccent:"var(--bg-main)"
            },
            lore:{
                name:"rat",
                desc:"rat."
            }
        }
    },
])