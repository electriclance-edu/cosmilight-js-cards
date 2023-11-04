/*--------------
GLOBALS
--------------*/
var tileWidth = undefined;
var tileHeight = undefined;
var visionRadius = undefined;
var defaultPersistence = undefined;
var mousePosition = new Point(0,0);
var graphicsLayerLoc; // Stores the center of the Eye body part's display element.
var mouseAngle; // Stores the current angle of the mouse relative to the center of the Eye body part.
var disableContextMenu = true;
var keyShiftPressed = false;
const graphicsDisplaySize = window.innerHeight;
/*
--------------
ONLOAD FUNCTIONS
--------------
*/
function onload() {
  setTimeout(() => {initialize()},0);
}
function onresize() {
  retrieveCSSConstants();
  GUIHandler.initialize();
  LightHandler.initialize();
  FogHandler.initialize();

  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth;
  GUIHandler.updateScreenCull;
}
function initialize() {
  DataHandler.loadAllData();
  new Game();
  retrieveCSSConstants();

  setTimeout(()=>{
    const boundingBox = document.getElementById("GraphicsLayer").getBoundingClientRect();
    graphicsLayerLoc = new Point((boundingBox.left + boundingBox.right) / 2, (boundingBox.top + boundingBox.bottom) / 2);
  },16);

  GUIHandler.initialize();
  LightHandler.initialize();
  FogHandler.initialize();

  GUIHandler.renderCredits();
  GUIHandler.renderCurrentTileBoard();
  GUIHandler.updateScreenCull();

  // toggleScreen("Start");
  toggleScreen("Game");
  startGame();

  document.getElementById("debug-BodyPart-SpellQueue").appendChild(GUIHandler.generateRawCardElement(new Card("condense_light").type));
  document.getElementById("debug-BodyPart-SpellQueue").appendChild(GUIHandler.generateRawCardElement(new Card("torchberry").type));
  document.getElementById("debug-BodyPart-SpellQueue").appendChild(GUIHandler.generateRawCardElement(new Card("research_heat").type));
  document.getElementById("BodyPart-Heart-card").appendChild(GUIHandler.generateRawCardElement(new Card("heart").type));

  // GUIHandler.displayInventory(Game.player.hand,GUIHandler.PlayerHandContainer,false);
  // Game.player.hand.addCard(new Card("condense_light"));
  // Game.player.hand.addCard(new Card("debug_map"));
  // setInterval(() => {
  //   FPSHandler.updateFrames();
  // },16.6);
  // setInterval(() => {
  //   FPSHandler.updateElement();
  // },1000);

  // GUIHandler.logText("Feel the ground here.");
  // setTimeout(()=>{GUIHandler.logText("It is hard. Cold. Ancient.")},3000);
  // setTimeout(()=>{GUIHandler.logText("The warmth of your hand is the first heat it has touched in eons.")},7000);
  // setTimeout(()=>{GUIHandler.logText("But with time... perhaps this whole world will feel the resplendence of heat once again.")},12000);
  // setTimeout(()=>{GUIHandler.logText("That is, if you play your cards right.")},18000);
}
function startGame() {
  document.getElementById("Screen-Start").remove();
  document.getElementById("Screen-Credits").remove();
  setTimeout(()=>{
    // GUIHandler.logText(randElem([
    //   "The ground crunches below your feet.",
    //   "A cold breeze blows past.",
    //   "The howling of silence echoes.",
    //   "The dim starlight is all that lets you see beyond.",
    //   "An ancient world awaits.",
    //   "The darkness threatens to encroach.",
    //   "Your toes curl in quaking anticipation.",
    // ]),undefined,7500);
    // GUIHandler.logText("You see nothing. You can do nothing but sing your melody.");
  },1500);
}
function getUnit(str) {
  return str.substring(str.length - 2,str.length);
}
function removeLastTwoChar(str) {
  return str.substring(0,str.length - 2);
}
function retrieveCSSConstants() {
  var style = getComputedStyle(document.body);
  defaultPersistence = removeLastTwoChar(style.getPropertyValue('--log-persistence'));
  
  if (getUnit(style.getPropertyValue('--tile-width')) == "px") {
    tileWidth = parseInt(removeLastTwoChar(style.getPropertyValue('--tile-width')));
  } else {
    tileWidth = window.innerWidth * (parseFloat(removeLastTwoChar(style.getPropertyValue('--tile-width'))) / 100);
  }
  
  if (getUnit(style.getPropertyValue('--tile-height')) == "px") {
    tileHeight = parseInt(removeLastTwoChar(style.getPropertyValue('--tile-height')));
  } else {
    tileHeight = window.innerWidth * (parseFloat(removeLastTwoChar(style.getPropertyValue('--tile-height'))) / 100);
  }

  visionRadius = parseInt(style.getPropertyValue('--visionRadius'));
}
function debug_setColor() {
  document.getElementById("TileBoard").style.setProperty('--x',`1000`);
}
function updateCSSTileDimensions() {
  // tileWidth = width;
  // tileHeight = height;
  document.querySelector(':root').style.setProperty('--tile-width', `${tileWidth}px`);
  document.querySelector(':root').style.setProperty('--tile-height', `${tileHeight}px`);
}
function debug_continuousTileShift(deltaWidth,deltaHeight,time = 1000,steps = 20) {
  // For every (time/step)ms, shift the dimension by 1/stepth towards the desired value
  let stepIndex = 0;
  let shiftInterval = setInterval(()=>{
    if (stepIndex < steps) {
      tileWidth += deltaWidth / 20;
      tileHeight += deltaHeight / 20;
      updateCSSTileDimensions();
      stepIndex++;
    } else {
      clearInterval(shiftInterval);
    }
  },time / steps);
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
function toggleScreen(id) {
  Array.from(document.getElementById("ScreenContainer").children).forEach((child)=>{
    if (child.id == "Screen-" + id) {
      child.classList.remove("hidden");
    } else {
      child.classList.add("hidden");
    }
  });
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
  
  const cardData = CardType.getById(elem.getAttribute("data-typeId"));
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
    // Invoker: card
    // Target : tile
    var originInventory = getInventory(dragInvokerElement.parentNode.getAttribute("data-inventoryType"));
    var invoker = originInventory.getCard(dragInvokerElement.getAttribute("data-inventoryId"));
    var tile = Game.board.getTile(coords);
    GameEventHandler.onDrop(invoker,tile);
  } else if (target.classList.contains("card")) {
    // If targeting card:
    
    var originInventory = getInventory(dragInvokerElement.parentNode.getAttribute("data-inventoryType"));
    var invoker = originInventory.getCard(dragInvokerElement.getAttribute("data-inventoryId"));

    if (target.isSameNode(dragInvokerElement)) {
      GameEventHandler.onClick(invoker);
      return;
    }
    // Invoker: card
    // Target : card
    var targetInventory = getInventory(target.parentElement.getAttribute("data-inventoryType"));
    var target = targetInventory.getCard(target.getAttribute("data-inventoryId"));
    GameEventHandler.onDrop(invoker,target);
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
function createDot(x = 100, y = 100,borderColor = "red",tempo = false) {
  var dot = elem("div","debug-dot");
  dot.style.left = x + "px";
  dot.style.top = y + "px";
  dot.style.borderColor = borderColor;
  if (tempo) {
    setTimeout(()=>{dot.remove()},tempo);
  }
  document.body.appendChild(dot);
}
/*
-----------------
UTILITY FUNCTIONS
-----------------
*/
function getElem(id) {
  return document.getElementById(id);
}

/*
--------------
LISTENERS
--------------
*/
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
    Game.player.movement.dashBonus = 10;
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
  FogHandler.initialize();
}
document.addEventListener('mousemove', (e) => {
  mousePosition = new Point(e.clientX,e.clientY);
  // Perform BodyPart-Hand stuff
  let cursor = new Point(e.clientX,e.clientY);
  mouseAngle = angleBetween(cursor,graphicsLayerLoc);

  // document.getElementById("PersistentCursorTextDisplay").style = `--x:${e.clientX};--y:${e.clientY};`
});
document.addEventListener('contextmenu', event => {if (disableContextMenu && !keyShiftPressed) event.preventDefault()});
document.addEventListener('mousedown', (e) => {
  let cursor = new Point(e.clientX,e.clientY);

  if (e.target.id == "bodyPart-eye") {
    if (e.button == 2) {
      FogHandler.clearRay(mouseAngle);
    } else if (e.button == 1) {
      if (!keyShiftPressed) {
        FogHandler.clearExplosion();
      } else {
        FogHandler.clearFocusedExplosion(mouseAngle);
      }
    } else {
      FogHandler.clearCone(mouseAngle);
    }
  }

  if (e.target.classList.contains("undraggable")) {
    return;
  }
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
  }
});