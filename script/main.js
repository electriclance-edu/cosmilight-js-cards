/*--------------
GLOBALS
--------------*/
var magicCircleActivated = false;
var currentRune = 0;
const magicCircle = getElem("magicCircle");
const magicCircleRunes = getElem("magicCircle-runeParent");
var tileWidth = undefined;
var tileHeight = undefined;

/*
--------------
ONLOAD FUNCTIONS
--------------
*/
function onload() {
  setTimeout(() => {initialize()},0);
}
function initialize() {
  DataHandler.loadAllData();
  initializeGame();
  retrieveCSSConstants();
  GUIHandler.initialize();
  LightHandler.initialize();
  FPSHandler.initialize();

  GUIHandler.renderCurrentTileBoard();

  var centralTileInventory = Game.current.getWorld().getCurrentBoard().getTile(0,0).inventory;
  centralTileInventory.addCard(new Card("harvest"));
  centralTileInventory.addCard(new Card("harvest"));
  centralTileInventory.addCard(new Card("release_heat"));
  centralTileInventory.addCard(new Card("release_heat"));
  centralTileInventory.addCard(new Card("release_heat"));
  GUIHandler.renderTile(0,0);
  Game.current.getWorld().openInventory(centralTileInventory);
  Game.current.getPlayer().hand.addCard(new Card("blink"));
  Game.current.getPlayer().hand.addCard(new Card("blink"));
  
  setInterval(() => {
    FPSHandler.updateFrames();
  },16.6);
  setInterval(() => {
    FPSHandler.updateElement();
  },200);
}
function initializeGame() {
  new Game(new World(), new Player());
}
function retrieveCSSConstants() {
  var style = getComputedStyle(document.body);
  tileWidth = parseInt(removePx(style.getPropertyValue('--tile-width'))) + 10;
  tileHeight = parseInt(removePx(style.getPropertyValue('--tile-height'))) + 10;
}
/*
-------------------
EVENT LISTENERS
-------------------
*/
window.addEventListener("resize", (e) => {
  doResize()
});
function doResize() {
  LightHandler.initialize();
}
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('mousedown', (e) => {
  if (e.button == 2) {
    if (e.target.classList.contains("draggable") && e.target.classList.contains("card")) {
      var inventoryId = e.target.getAttribute("data-inventoryId");

      let currentlyOpenedInv = Game.current.getWorld().currentlyOpenedInventory;
      if (currentlyOpenedInv == "none") {
        return;
      }

      let originInventory, targetInventory;
      switch (e.target.parentElement.id) {
        case "playerInventoryCards":
          originInventory = Game.current.getPlayer().hand;
          targetInventory = currentlyOpenedInv;
          break;
        case "externalInventoryCards":
          originInventory = currentlyOpenedInv;
          targetInventory = Game.current.getPlayer().hand;
          break;
      }
      var card = originInventory.getCard(inventoryId);
  
      originInventory.removeCard(inventoryId);
      targetInventory.addCard(card);
    
      let world = Game.current.getWorld();
      let tile = world.getCurrentBoard().getTile(world.currentlyOpenedTileCoords.x,world.currentlyOpenedTileCoords.y);
      if (tile.inventory.hasItems()) {
        GUIHandler.addClassToTileElem(world.currentlyOpenedTileCoords.x,world.currentlyOpenedTileCoords.y,"hasItems");
      } else {
        GUIHandler.removeClassFromTileElem(world.currentlyOpenedTileCoords.x,world.currentlyOpenedTileCoords.y,"hasItems");
      }
    }
    return;
  }
  //if target is an eleemnt of class draggable
  if (e.target.classList.contains("draggable")) {
    onDragStart(e);
    document.addEventListener('mousemove', dragManager, true);
    document.addEventListener('mouseup', dragEnder, true);
  } else if (e.target.classList.contains("tile")) {
    let currentCoords = Game.current.getWorld().currentlyOpenedTileCoords;
    GUIHandler.removeClassFromTileElem(currentCoords.x,currentCoords.y,"selectedTile");

    let coords = mouseToBoardCoordinates(e);
    let tileInventory = Game.current.getWorld().getCurrentBoard().getTile(coords.x,coords.y).inventory;
    Game.current.getWorld().openInventory(tileInventory);
    Game.current.getWorld().currentlyOpenedTileCoords = coords;
    GUIHandler.addClassToTileElem(coords.x,coords.y,"selectedTile");
  }
});
/*
--------------
GENERAL GUI FUNCTIONS
--------------
*/
// Converts a string formatted like an HTML file into an element. Returns only the first element in the string if the string has multiple elements.
function parseHTML(rawHTML) {
  return document.createRange().createContextualFragment(rawHTML).firstElementChild;
}
// Converts a string formatted like an HTML file into an element. Returns the document fragment generated.
function parseHTMLDocumentFragment(rawHTML) {
  return document.createRange().createContextualFragment(rawHTML);
}
function setUniqueState(element, state = "none") {
  var classNames = element.className.split(' ');
  classNames.forEach((name) => {
    if (name.slice(0,5) == "state") {
      element.classList.remove(name);
    }
  });
  element.classList.add(`state-${state}`);
}
/*
--------------
MAGIC CIRCLE FUNCTIONS
--------------
*/
const runeTypes = {
  "KeyW":"W",
  "KeyA":"A",
  "KeyS":"S",
  "KeyD":"D"
}
function generateRuneElem(index, key) {
  //runes have images associataed with them depending on the type, but for now they'll just be p elements.
  rune = elem("div","magicCircle-rune",runeTypes[key]);
  rune.style.setProperty("--index",index);

  return rune;
}
function setRuneState(runeIndex, state = "default") {
  setUniqueState(magicCircleRunes.children[runeIndex],state);
  if (state = "selected") {
    currentRune = runeIndex;
  }
}
function debug_generateMagicCircle() {
  initializeMagicCircle(
    [randElem(["KeyW","KeyA","KeyS","KeyD"]),
    randElem(["KeyW","KeyA","KeyS","KeyD"]),
    randElem(["KeyW","KeyA","KeyS","KeyD"]),
    randElem(["KeyW","KeyA","KeyS","KeyD"]),
    randElem(["KeyW","KeyA","KeyS","KeyD"]),
    randElem(["KeyW","KeyA","KeyS","KeyD"]),
    randElem(["KeyW","KeyA","KeyS","KeyD"])],
    {
      y:"50%",
      x:"50%"
    }
  );
}
function initializeMagicCircle(runes, position) {
  magicCircle.top = position.y;
  magicCircle.left = position.x;
  magicCircle.classList.add("state-initial");
  magicCircle.classList.add("state-vanished");
  magicCircle.classList.remove("state-initial");
  setTimeout(() => {
    magicCircle.classList.remove("state-vanished");
  },100);
  magicCircle.style.setProperty("--fill-level","0%");
  magicCircle.style.setProperty("--total-runes",`${runes.length}`);
  magicCircle.style.setProperty("--runes-completed",`${0}`);

  magicCircleRunes.innerHTML = "";
  runes.forEach((key, index) => {
    runeElem = generateRuneElem(index, key);
    magicCircleRunes.appendChild(runeElem);
  });

  magicCircleActivated = true;
  currentMagicCircle = runes;

  setRuneState(0,"selected");
}
function debug_activateMagicCircle() {
  magicCircle.classList.add("state-initial");
  magicCircle.classList.add("state-vanished");
  magicCircle.classList.remove("state-initial");
  setTimeout(() => {
    magicCircle.classList.remove("state-vanished");
  },100);
}
function shutdownMagicCircle() {
  magicCircleActivated = false;
  magicCircle.classList.add("state-vanished");
}
function magicCircleProcessKey(code) {
  magicCircleActivated = currentRune < magicCircleRunes.children.length;
  if (magicCircleActivated) {
    state = (code == findKeyFromValue(runeTypes,magicCircleRunes.children[currentRune].innerHTML));
    magicCircle.style.setProperty("--runes-completed",`${currentRune + 1}`);
    setRuneState(currentRune, state ? "completed" : "failed");

    if (currentRune < magicCircleRunes.children.length - 1) {
      setRuneState(currentRune + 1, "selected");
    } else {
      shutdownMagicCircle();
    }
  }
}

/*
--------------
DRAG FUNCTIONS
--------------
*/
var dragManager = (e) => {onDragMove(e)};
var dragEnder = (e) => {endDrag(e)};
var dragInvokerElement = undefined;
var dragInvokerCardType = undefined;
var dragGhost = undefined;

function endDrag(e) {
  dragGhost.remove();
  dragGhost = undefined;
  
  document.removeEventListener("mousemove", dragManager, true);
  document.removeEventListener('mouseup', dragEnder, true);

  onDragEnd(e);
}
function onDragStart(e) {
  var coords = mouseToBoardCoordinates(e);
  var elem = e.target;

  document.body.classList.add("dragging");
  
  const cardData = CardType.getById(elem.getAttribute("data-cardTypeId"));
  var ghost = GUIHandler.generateRawCardElement(cardData);
  ghost.classList.add("drag_ghost");
  ghost.classList.add(".state-vanished");
  setTimeout(() => {
    ghost.classList.remove("state-vanished");
  },500);

  dragGhost = ghost;
  dragGhost.style.setProperty("--drag-top", e.clientY + "px"); 
  dragGhost.style.setProperty("--drag-left", e.clientX + "px");

  document.body.appendChild(ghost);

  dragInvokerElement = elem;
  dragInvokerCardType = cardData;
}
function onDragMove(e) {
  dragGhost.style.setProperty("--drag-top", e.clientY + "px"); 
  dragGhost.style.setProperty("--drag-left", e.clientX + "px");
}
function onDragEnd(e) {
  var coords = mouseToBoardCoordinates(e);
  var target = e.target;

  document.body.classList.remove("dragging");

  // If targeting inventory:
  if (target.classList.contains("validInventoryDrop")) {
    var inventoryId = dragInvokerElement.getAttribute("data-inventoryId");
    
    let originInventory;
    switch (dragInvokerElement.parentElement.id) {
      case "playerInventoryCards":
        originInventory = Game.current.getPlayer().hand;
        break;
      case "externalInventoryCards":
        originInventory = Game.current.getWorld().currentlyOpenedInventory;
        break;
    }
    var card = originInventory.getCard(inventoryId);

    let targetInventory;
    if (target.classList.contains("externalInventory")) {
      targetInventory = Game.current.getWorld().currentlyOpenedInventory;
    } else if (target.classList.contains("playerInventory")) {
      targetInventory = Game.current.getPlayer().hand;
    }
    originInventory.removeCard(inventoryId);
    targetInventory.addCard(card);
    
    let world = Game.current.getWorld();
    let tile = world.getCurrentBoard().getTile(world.currentlyOpenedTileCoords.x,world.currentlyOpenedTileCoords.y);
    if (tile.inventory.hasItems()) {
      GUIHandler.addClassToTileElem(world.currentlyOpenedTileCoords.x,world.currentlyOpenedTileCoords.y,"hasItems");
    } else {
      GUIHandler.removeClassFromTileElem(world.currentlyOpenedTileCoords.x,world.currentlyOpenedTileCoords.y,"hasItems");
    }
  }
  // If targeting card:
  // // If targeting tile:
  // var data = Game.current.getWorld().getCurrentBoard().getTile(coords.x,coords.y);
}
function makeDraggable(elem) {
  elem.classList.add("draggable");
}
function mouseToBoardCoordinates(e) {
  var x = e.clientX - window.innerWidth/2;
  var y = e.clientY - window.innerHeight/2;

  x = Math.round(x / tileWidth);
  y = -Math.round(y / tileHeight);

  return {x:x,y:y};
}
/*
--------------
TEXT DISPLAY FUNCTIONS
--------------
*/


/*
--------------
DEBUG FUNCTIONS
--------------
*/
function createDot(x = 100, y = 100,borderColor = "red") {
  var dot = elem("div","debug-dot");
  dot.style.left = x + "px";
  dot.style.top = y + "px";
  dot.style.borderColor = borderColor;
  document.body.appendChild(dot);
}
/*
-----------------
UTILITY FUNCTIONS
-----------------
*/
function removePx(str) {
  return str.substring(0,str.length - 2);
}
function getElem(id) {
  return document.getElementById(id);
}
function glhelm(tag, className = false, innerHTML = false) {
  return elem(tag, className, innerHTML);
}
function elem(tag, className = false, innerHTML = false) {
  var element = document.createElement(tag);
  if (innerHTML != false) {
    element.innerHTML = innerHTML;
  }
  if (className != false) {
    element.className = className;
  }
  return element;
}
function findKeyFromValue(dict,value) {
  var matchingKey = false;

  keys = Object.keys(dict);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    if (dict[key] == value) {
      matchingKey = key;
      break;
    }
  };

  return matchingKey;
}

/*
--------------
LISTENERS
--------------
*/
document.addEventListener('keypress', (e) => {
  var code = e.code;

  if (magicCircleActivated) {
    magicCircleProcessKey(code);
  }
}, false);
function onresize() {
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth;
}