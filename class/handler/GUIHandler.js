class GUIHandler {
    static frame = 0;
    
    static initialize() {

    }
    static renderFrame() {
        requestAnimationFrame(GUIHandler.renderFrame);
        
        GUIHandler.frame++;
        
        EffectHandler.render();
        PhysicsBodyHandler.physicsTimestep();
        PhysicsBodyHandler.renderAllBodies();
        LightHandler.renderAllLight();
    }
    static closeTitleTab() {
        // let header = document.getElementById("TitleTab-Header");
        // header.innerHTML = "";
        // let ldesc = document.getElementById("TitleTab-LDescription");
        // ldesc.innerHTML = "";
        GUIHandler.toggleTab("TitleTab",new Point(0,0),false);
        GUIHandler.currentlyOpenedTitleObjectId = "";
    }
    static toggleTab(id,loc = new Point(window.offsetWidth/2,window.offsetHeight/2),setState) {
        let tab = document.getElementById(id);
        
        // set state
        let state;
        if (setState) { // setState overrides the toggle.
            state = setState
        } else {
            // If it contains the class "state-opened", then that tab is currently opened. If not, then closed. Set it to the opposite of that.
            state = !tab.classList.contains("state-opened");
        } 
        tab.classList.remove("state-closed"); // Reset class
        tab.classList.remove("state-opened"); // Reset class
        tab.classList.add(["state-closed","state-opened"][state ? 1 : 0]); // If state is 0, add state-closed. If 1, add state-opened.

        if (state) {
            // set location
            tab.style.setProperty("--x",loc.x);
            tab.style.setProperty("--y",loc.y);
        }
    }
    static openTitleTab(card) {
        // RENDER INFO ELEMENTS BASED ON DATA GIVEN
        // render title
        let header = document.getElementById("TitleTab-Header");
        header.innerHTML = "";
        let ctype = card.type;
        if (ctype.lore.superTitle) {
            let superTitle = document.createElement("p");
            superTitle.classList.add("txt-size-small");
            superTitle.classList.add("headerFont");
            superTitle.classList.add("superTitle");
            superTitle.innerHTML = ctype.lore.superTitle;
            header.appendChild(superTitle);
        }
        let title = document.createElement("p");
        title.classList.add("txt-size-header");
        title.classList.add("headerFont");
        title.classList.add("title");
        title.innerHTML = ctype.lore.mainTitle;
        header.appendChild(title);
        if (ctype.lore.subTitle) {
            let subTitle = document.createElement("p");
            subTitle.classList.add("txt-size-small");
            subTitle.classList.add("headerFont-thin");
            subTitle.classList.add("subTitle");
            subTitle.innerHTML = ctype.lore.subtitle;
            header.appendChild(subTitle);
        }

        // render description
        let ldesc = document.getElementById("TitleTab-LDescription");
        if (ctype.lore.description) {
            ldesc.innerHTML = ctype.lore.description;
        } else {
            ldesc.innerHTML = "";
        }
        let tdesc = document.getElementById("TitleTab-TDescription");
        if (ctype.lore.technical_description) {
            tdesc.innerHTML = ctype.lore.technical_description;
        } else {
            tdesc.innerHTML = "";
        }

        GUIHandler.toggleTab("TitleTab",new Point(0,0),true);
    }
}