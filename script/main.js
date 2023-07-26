/*--------------
GLOBALS
--------------*/
var magicCircleActivated = false;
var currentRune = 0;
const magicCircle = getElem("magicCircle");
const magicCircleRunes = getElem("magicCircle-runeParent");
var tileWidth = undefined;
var tileHeight = undefined;
var defaultPersistence = undefined;
var mousePosition = new Point(0,0);
var disableContextMenu = false;
var keyShiftPressed = false;
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
  new Game();
  retrieveCSSConstants();
  GUIHandler.initialize();
  LightHandler.initialize();
  FPSHandler.initialize();

  GUIHandler.renderCurrentTileBoard();

  var centralTileInventory = Game.board.getTile(new Point(0,0)).inventory;
  centralTileInventory.addCard(new Card("harvest"));
  centralTileInventory.addCard(new Card("harvest"));
  centralTileInventory.addCard(new Card("release_heat"));
  centralTileInventory.addCard(new Card("release_heat"));
  centralTileInventory.addCard(new Card("release_heat"));
  GUIHandler.renderTile(new Point(0,0));
  // Game.world.openInventory(centralTileInventory);
  GUIHandler.displayInventory(Game.player.hand,GUIHandler.PlayerHandContainer,false);
  Game.player.hand.addCard(new Card("sap"));
  Game.player.hand.addCard(new Card("old_spellbook"));
  
  setInterval(() => {
    FPSHandler.updateFrames();
  },16.6);
  setInterval(() => {
    FPSHandler.updateElement();
  },1000);
  setInterval(() => {
    let mov = Game.player.movement;
    var x = Game.player.movement.direction["+x"]*Game.player.speed - Game.player.movement.direction["-x"]*Game.player.speed;
    var y = Game.player.movement.direction["+y"]*Game.player.speed - Game.player.movement.direction["-y"]*Game.player.speed;
    Game.player.translate(x,y);

    if (mov.excessSpeed > 0) {
      mov.excessSpeed -= 0.04;
    }
  },50);

  GUIHandler.updateScreenCull();
  GUIHandler.logText(randElem([
    "The ground crunches below your feet.",
    "A cold breeze blows past.",
    "The howling of silence echoes.",
    "The dim starlight is all that lets you see beyond.",
    "An ancient world awaits.",
    "The darkness threatens to encroach.",
  ]))
  // GUIHandler.logText("Feel the ground here.");
  // setTimeout(()=>{GUIHandler.logText("It is hard. Cold. Ancient.")},3000);
  // setTimeout(()=>{GUIHandler.logText("The warmth of your hand is the first heat it has touched in eons.")},7000);
  // setTimeout(()=>{GUIHandler.logText("But with time... perhaps this whole world will feel the resplendence of heat once again.")},12000);
  // setTimeout(()=>{GUIHandler.logText("That is, if you play your cards right.")},18000);
}
function retrieveCSSConstants() {
  var style = getComputedStyle(document.body);
  tileWidth = parseInt(removePx(style.getPropertyValue('--tile-width')));
  tileHeight = parseInt(removePx(style.getPropertyValue('--tile-height')));
  defaultPersistence = removePx(style.getPropertyValue('--log-persistence'));
}
function toggleStructureDetailDisplay(visible = false,structure) {
  if (visible) {
    GUIHandler.displayStructureDetails(structure);
    GUIHandler.StructureDetailDisplay.classList.remove("state-vanished");
  } else {    
    GUIHandler.StructureDetailDisplay.classList.add("state-vanished");
    Array.from(document.getElementById("structureStatContainer").children).forEach((child)=>setTimeout(()=>{child.remove()},300));
}
}
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
DRAG FUNCTIONS
--------------
*/
var dragManager = (e) => {onDragMove(e)};
var dragEnder = (e) => {endDrag(e)};
var dragInvokerElement = undefined;
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
}
function onDragMove(e) {
  dragGhost.style.setProperty("--drag-top", e.clientY + "px"); 
  dragGhost.style.setProperty("--drag-left", e.clientX + "px");
}
function onDragEnd(e) {
  var coords = mouseToBoardCoordinates(e);
  var target = e.target;

  document.body.classList.remove("dragging");

  if (target.classList.contains("inventory-bg")) {
    // If targeting inventory:
    dropIntoInventory(target.parentElement);
  } else if (target.classList.contains("tile")) {
    // If targeting tile:
    var data = Game.board.getTile(coords);
    console.log("targeting tile with data",data);
  } else if (target.classList.contains("card")) {
    if (target.isSameNode(dragInvokerElement)) {
      return;
    }
    var originInventory = getInventory(dragInvokerElement.parentNode.getAttribute("data-inventoryType"));
    var targetInventory = getInventory(target.parentElement.getAttribute("data-inventoryType"));
    var invoker = originInventory.getCard(dragInvokerElement.getAttribute("data-inventoryId"));
    var target = targetInventory.getCard(target.getAttribute("data-inventoryId"));
    GameEventHandler.onDrop(invoker,target);
    // If targeting card:
    //determine the inventory the card originates from
    //get the card info given the inventory id
    //Interaction.triggerAll(interactions, "onDrop-actor");
    //Interaction.triggerAll(interactions, "onDrop-target");
  }
}
function getInventory(id) {
  if (id == "TILE") {
    return Game.currentTile.inventory;
  } else if (id == "PLAYERHAND") {
    return Game.player.hand;
  } else if (id == "INSTRUCTURE") {
    return Game.currentTile.structure.inventory;
  }
}
function dropIntoInventory(target) {
  var inventoryId = dragInvokerElement.getAttribute("data-inventoryId");
    
  var originInventory = getInventory(dragInvokerElement.parentNode.getAttribute("data-inventoryType"));
  var targetInventory = getInventory(target.querySelector(".inventory").getAttribute("data-inventoryType"));
  var card = originInventory.getCard(inventoryId);

  if (target.classList.contains("externalInventory")) {
    if (target.classList.contains("playerInventory")) {
      GUIHandler.logText(`You take the ${card.type.hasTag("spell") ? "spell" : "item"}.`,"cursor",1000);
    } else {
      GUIHandler.logText(`You drop the ${card.type.hasTag("spell") ? "spell" : "item"} ${targetInventory.title == "THE GROUND" ? "onto" : "into"} ${targetInventory.title.toLowerCase()}.`,"cursor",1000);
    }
  }
  originInventory.transferCard(inventoryId,targetInventory);
  
  let tile = Game.currentTile;
  if (tile.inventory.hasItems()) {
    GUIHandler.addClassToTileElem(Game.world.currentlyOpenedTileCoords,"hasItems");
  } else {
    GUIHandler.removeClassFromTileElem(Game.world.currentlyOpenedTileCoords,"hasItems");
  }
}
function makeDraggable(elem) {
  elem.classList.add("draggable");
}
function boardToMouseCoordinates(x,y) {
  var converted = new Point(x,y);
  Point.translate(converted,Game.player.location);
  converted.x = Math.round(x * tileWidth + window.innerWidth/2);
  converted.y = Math.round(-(y * tileHeight) + window.innerHeight/2);
  return converted;
}
function mouseToBoardCoordinates(e) {
  var x = e.clientX - window.innerWidth/2;
  var y = e.clientY - window.innerHeight/2;

  x = Math.round(x / tileWidth);
  y = -Math.round(y / tileHeight);

  return decentralizePoint(Game.player.getRoundedLocation(),new Point(x,y));
}
function openTile(coords) {
  let tile = Game.board.getTile(coords);

  toggleStructureDetailDisplay(false);
  if (tile.hasStructure()) {
    setTimeout(()=>{
      toggleStructureDetailDisplay(true,tile.getStructure());
    },300);
  }

  GUIHandler.displayInventories([tile.inventory]);

  if (!!Game.currentTileCoords) {
    if (Point.areEqual(coords,Game.currentTileCoords)) {
      return;
    }
    if (Game.currentTileCoords != "none") {
      GUIHandler.removeClassFromTileElem(Game.currentTileCoords,"selectedTile");
    }
  }
  Game.world.currentlyOpenedTileCoords = coords;
  GUIHandler.addClassToTileElem(coords,"selectedTile");
}
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
  GUIHandler.updateScreenCull;
}
document.addEventListener('keyup', (e)=>{
  var key = e.code;

  if (key == "ShiftLeft") {
    keyShiftPressed = false;
  }

  if (key == "ArrowLeft" || key == "KeyA") {
    e.preventDefault();
    Game.player.movement.direction["-x"] = 0;
  } 
  if (key == "ArrowUp" || key == "KeyW") {
    e.preventDefault();
    Game.player.movement.direction["+y"] = 0;
  } 
  if (key == "ArrowRight" || key == "KeyD") {
    e.preventDefault();
    Game.player.movement.direction["+x"] = 0;
  } 
  if (key == "ArrowDown" || key == "KeyS") {
    e.preventDefault();
    Game.player.movement.direction["-y"] = 0;
  }
});
document.addEventListener('keydown', function(e) {
  if (e.repeat) {
    return;
  }
  var key = e.code;

  if (key == "ShiftLeft") {
    keyShiftPressed = true;
    if (Game.player.moving) {
      Game.player.dash();
    }
  }

  if (key == "Space") {
    console.log(Game.player.location,Game.player.getRoundedLocation());
    openTile(Game.player.getRoundedLocation());
  }
  if (key == "ArrowLeft" || key == "KeyA") {
    e.preventDefault();
    Game.player.movement.direction["-x"] = 1;
  } 
  if (key == "ArrowUp" || key == "KeyW") {
    e.preventDefault();
    Game.player.movement.direction["+y"] = 1;
  } 
  if (key == "ArrowRight" || key == "KeyD") {
    e.preventDefault();
    Game.player.movement.direction["+x"] = 1;
  } 
  if (key == "ArrowDown" || key == "KeyS") {
    e.preventDefault();
    Game.player.movement.direction["-y"] = 1;
  }
});
window.addEventListener("resize", (e) => {
  doResize();
});
function doResize() {
  LightHandler.initialize();
}
document.addEventListener('mousemove', (e) => {
  mousePosition = new Point(e.clientX,e.clientY);
});
document.addEventListener('contextmenu', event => {if (disableContextMenu) event.preventDefault()});
document.addEventListener('mousedown', (e) => {
  if (keyShiftPressed) {
    if (e.target.classList.contains("draggable") && e.target.classList.contains("card")) {
      var inventoryId = e.target.getAttribute("data-inventoryId");
      
      let currentlyOpenedInv = getInventory("TILE");
      if (!currentlyOpenedInv) {
        return;
      } else if (!currentlyOpenedInv.isRendered) {
        return;
      }

      let verb;
      let originInventory, targetInventory;
      var inventoryType = e.target.parentElement.getAttribute("data-inventoryType");
      if (inventoryType == "PLAYERHAND") {
        verb = "place";
        originInventory = getInventory("PLAYERHAND");
        targetInventory = getInventory("TILE");
      } else {
        verb = "take";
        originInventory = getInventory(inventoryType);
        targetInventory = getInventory("PLAYERHAND");
      }

      var card = originInventory.transferCard(inventoryId,targetInventory);
      GUIHandler.logText(`You quickly ${verb} the ${originInventory.amountOfCards() == 0 ? "last " : ""}${card.type.hasTag("spell") ? "spell" : "item"}.`,"cursor",1000);
    
      let tile = Game.currentTile;
      if (tile.inventory.hasItems()) {
        GUIHandler.addClassToTileElem(Game.currentTileCoords,"hasItems");
      } else {
        GUIHandler.removeClassFromTileElem(Game.currentTileCoords,"hasItems");
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
    let coords = mouseToBoardCoordinates(e);
    if (Game.player.distanceTo(coords) > 0.5 + Game.player.getStat("interactionDistance").value) {
      GUIHandler.logText("Too far!","cursor",1000);
      return;
    }

    openTile(coords);
  }
});