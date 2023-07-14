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
  // Game.current.getWorld().openInventory(centralTileInventory);
  Game.current.getPlayer().hand.addCard(new Card("blink"));
  Game.current.getPlayer().hand.addCard(new Card("blink"));
  
  setInterval(() => {
    FPSHandler.updateFrames();
  },16.6);
  setInterval(() => {
    FPSHandler.updateElement();
  },200);

  GUIHandler.logText("Feel the ground here.");
  setTimeout(()=>{GUIHandler.logText("It is hard. Cold. Ancient.")},3000);
  setTimeout(()=>{GUIHandler.logText("The warmth of your hand is the first heat it has touched in eons.")},7000);
  setTimeout(()=>{GUIHandler.logText("But with time... perhaps this whole world will feel the resplendence of heat once again.")},12000);
  setTimeout(()=>{GUIHandler.logText("That is, if you play your cards right.")},18000);
  
  document.addEventListener('keyup', (e)=>{
    var key = e.code;

    if (key == "ShiftLeft") {
      keyShiftPressed = false;
    }
  });
  document.addEventListener('keydown', function(e) {
    if (e.repeat) {
      return;
    }
    var key = e.code;

    if (key == "ShiftLeft") {
      keyShiftPressed = true;
    }

    var movement = {
      "+y":0,
      "-y":0,
      "-x":0,
      "+x":0
    }

    let attemptMovement = false;
    if (key == "ArrowLeft" || key == "KeyA") {
      attemptMovement = true;
      movement["-x"] = 1;
    } else if (key == "ArrowUp" || key == "KeyW") {
      attemptMovement = true;
      movement["+y"] = 1;
    } else if (key == "ArrowRight" || key == "KeyD") {
      attemptMovement = true;
      movement["+x"] = 1;
    } else if (key == "ArrowDown" || key == "KeyS") {
      attemptMovement = true;
      movement["-y"] = 1;
    }

    if (attemptMovement) {
      e.preventDefault();
      let player = Game.current.getPlayer();
      var x = movement["+x"] - movement["-x"];
      var y = movement["+y"] - movement["-y"];
      player.translate(x,y);
    }
  });
}
//   var movement = {
//     "+y":false,
//     "-y":false,
//     "-x":false,
//     "+x":false
//   }
//   var movementInterval = "none";
//   function startMovement() {
//     movementInterval = setInterval(()=>{
//       let player = Game.current.getPlayer();
//       var x = player.location.x + movement["+x"]*player.movementVelocity - movement["-x"]*player.movementVelocity;
//       var y = player.location.y + movement["+y"]*player.movementVelocity - movement["-y"]*player.movementVelocity;
//       player.move(x,y);
//     },50);
//   }
//   document.addEventListener('keyup', function(e) {
//     var key = e.code;
//     if (key == "ArrowLeft" || key == "KeyA") {
//       e.preventDefault();
//       movement["-x"] = false;
//     } else if (key == "ArrowUp" || key == "KeyW") {
//       e.preventDefault();
//       movement["+y"] = false;
//     } else if (key == "ArrowRight" || key == "KeyD") {
//       e.preventDefault();
//       movement["+x"] = false;
//     } else if (key == "ArrowDown" || key == "KeyS") {
//       e.preventDefault();
//       movement["-y"] = false;
//     }

//     if (Object.values(movement).every((val) => !val)) {
//       clearInterval(movementInterval);
//       movementInterval = "none";
//     }
//   });
//   document.addEventListener('keydown', function(e) {
//     var key = e.code;
//     if (key == "ArrowLeft" || key == "KeyA") {
//       e.preventDefault();
//       movement["-x"] = true;
//     } else if (key == "ArrowUp" || key == "KeyW") {
//       e.preventDefault();
//       movement["+y"] = true;
//     } else if (key == "ArrowRight" || key == "KeyD") {
//       e.preventDefault();
//       movement["+x"] = true;
//     } else if (key == "ArrowDown" || key == "KeyS") {
//       e.preventDefault();
//       movement["-y"] = true;
//     }

//     if (Object.values(movement).some((val) => val) && movementInterval == "none") {
//       startMovement();
//     }
//   });
// }
function initializeGame() {
  new Game(new World(), new Player());
}
function retrieveCSSConstants() {
  var style = getComputedStyle(document.body);
  tileWidth = parseInt(removePx(style.getPropertyValue('--tile-width')));
  tileHeight = parseInt(removePx(style.getPropertyValue('--tile-height')));
  defaultPersistence = removePx(style.getPropertyValue('--log-persistence'));
}
/*
-------------------
EVENT LISTENERS
-------------------
*/
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

      let currentlyOpenedInv = Game.current.getWorld().currentlyOpenedInventory;
      if (currentlyOpenedInv == "none") {
        return;
      }

      let verb;
      let originInventory, targetInventory;
      switch (e.target.parentElement.id) {
        case "playerInventoryCards":
          verb = "place";
          originInventory = Game.current.getPlayer().hand;
          targetInventory = currentlyOpenedInv;
          break;
        case "externalInventoryCards":
          verb = "take";
          originInventory = currentlyOpenedInv;
          targetInventory = Game.current.getPlayer().hand;
          break;
      }
      var card = originInventory.getCard(inventoryId);
      GUIHandler.logText(`You quickly ${verb} the ${originInventory.amountOfCards() == 1 ? "last " : ""}${card.type.hasTag("spell") ? "spell" : "item"}.`,"cursor",1000);
  
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
    let coords = mouseToBoardCoordinates(e);
    if (Game.current.getPlayer().distanceTo(coords) > 1.5) {
      GUIHandler.logText("Too far!","cursor",1000);
      return;
    }
    if (Point.areEqual(coords,Game.current.getWorld().currentlyOpenedTileCoords)) {
      return;
    }

    let currentCoords = Game.current.getWorld().currentlyOpenedTileCoords;
    if (currentCoords != "none") {
      GUIHandler.removeClassFromTileElem(currentCoords.x,currentCoords.y,"selectedTile");
    }

    let tile = Game.current.getWorld().getCurrentBoard().getTile(coords.x,coords.y);
    Game.current.getWorld().openInventory(tile.inventory);
    Game.current.getWorld().currentlyOpenedTileCoords = coords;
    GUIHandler.addClassToTileElem(coords.x,coords.y,"selectedTile");
    
    GUIHandler.StructureDetailDisplay.classList.add("state-vanished");
    if (tile.hasStructure()) {
      coords = boardToMouseCoordinates(coords.x,coords.y);
      setTimeout(()=>{
        GUIHandler.StructureDetailDisplay.classList.remove("state-vanished");
        GUIHandler.StructureDetailDisplay.style = `
          --x:${coords.x};
          --y:${coords.y};
        `;
      },300);
    }
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

    let verb = "move";
    let targetInventory;
    if (target.classList.contains("externalInventory")) {
      targetInventory = Game.current.getWorld().currentlyOpenedInventory;
      GUIHandler.logText(`You drop the ${card.type.hasTag("spell") ? "spell" : "item"} ${targetInventory.title == "THE GROUND" ? "onto" : "into"} ${targetInventory.title.toLowerCase()}.`,"cursor",1000);
    } else if (target.classList.contains("playerInventory")) {
      GUIHandler.logText(`You take the ${card.type.hasTag("spell") ? "spell" : "item"}.`,"cursor",1000);
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
  } else if (target.classList.contains("tile")) {
    // If targeting tile:
    var data = Game.current.getWorld().getCurrentBoard().getTile(coords.x,coords.y);
    console.log("targeting tile with data",data);
  }
  // If targeting card:
}
function makeDraggable(elem) {
  elem.classList.add("draggable");
}
function boardToMouseCoordinates(x,y) {
  var converted = new Point(x,y);
  Point.translate(converted,Game.current.getPlayer().location);
  converted.x = Math.round(x * tileWidth + window.innerWidth/2);
  converted.y = Math.round(-(y * tileHeight) + window.innerHeight/2);
  return converted;
}
function mouseToBoardCoordinates(e) {
  var x = e.clientX - window.innerWidth/2;
  var y = e.clientY - window.innerHeight/2;

  x = Math.round(x / tileWidth);
  y = -Math.round(y / tileHeight);

  return decentralizePoint(Game.current.getPlayer().getRoundedLocation(),new Point(x,y));
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