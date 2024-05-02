/*--------------
GLOBALS
--------------*/
var tileWidth = undefined;
var tileHeight = undefined;
var visionRadius = undefined;
var defaultPersistence = undefined;
var mousePosition = new Point(0,0);
var ScreenCenter = new Point(0,0);
var moveScreenCenterFrom = null;
var unmovedScreenCenter = new Point(0,0);
var disableContextMenu = true;
var keyShiftPressed = false;
var graphicsDisplaySize;
/*
--------------
ONLOAD FUNCTIONS
--------------
*/
function onload() {
  setTimeout(() => {
    initialize();
    PhysicsBodyHandler.addManyBodies();
  },0);
}
function globalInitialize() {
  GUIHandler.initialize();
  PhysicsBodyHandler.initialize();
  LightHandler.initialize();
  EffectHandler.initialize();
}
function onresize() {
  retrieveCSSConstants();
  globalInitialize();

  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth;
}
function initialize() {
  DataHandler.loadAllData();
  new Game().start();
  ScreenCenter = new Point(window.innerWidth/2,window.innerHeight/2);
  retrieveCSSConstants();

  setTimeout(()=>{
  
    document.addEventListener('mousemove', (e) => {
      PhysicsBodyHandler.onmousemove();
      // Update mousePosition
      // MousePosition encodes the cursor's position on the gameboard.
      // This may differ from the cursor's actual position on the screen (when the screen isnt of a 16:9 aspect ratio), so it has to be corrected.
      let contentPosition = document.getElementById("Content").getBoundingClientRect();
      if (document.body.clientWidth / document.body.clientHeight < 16.0/9.0) mousePosition = new Point(e.clientX,e.clientY - contentPosition.top); // When there is excess vertical space, translate clientY by that excess space
      else mousePosition = new Point(e.clientX - contentPosition.left,e.clientY); // When there is excess horizontal space, translate clientX by that excess space

      if (e.buttons % 2 == 0 && e.buttons != 0) {
        ScreenCenter.x = unmovedScreenCenter.x - (moveScreenCenterFrom.x - mousePosition.x);
        ScreenCenter.y = unmovedScreenCenter.y - (moveScreenCenterFrom.y - mousePosition.y);
      };
    });
  },16);

  globalInitialize();
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
document.addEventListener('wheel',(e)=>{
  let delta = e.deltaY < 0 ? -1 : 1;
  
  PhysicsBodyHandler.setZoom(delta);
});
document.addEventListener('keydown', function(e) {
  if (e.repeat) {
    return;
  }
  var key = e.code;

  PhysicsBodyHandler.onPhysicsKeyHover(key);

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
  ScreenCenter = new Point(window.innerWidth/2,window.innerHeight/2);
}
document.addEventListener('contextmenu', event => {if (disableContextMenu && !keyShiftPressed) event.preventDefault()});
document.addEventListener('mouseup',(e)=>{
  mouseState = "none";
  PhysicsBodyHandler.onmouseup();
})
document.addEventListener('mousedown', (e) => {
  mouseState = ["left","middle","right"][e.button];

  PhysicsBodyHandler.onmousedown(e.button);

  if (e.buttons % 2 == 0 && e.buttons != 0) {
    moveScreenCenterFrom = mousePosition;
    unmovedScreenCenter = ScreenCenter.copy();
  } else {
    moveScreenCenterFrom = null;
  }

  if (e.target.id == "EyeTab") {
    if (e.button == 2) {
      FogHandler.clearRay(mouseAngle);
    } else if (e.button == 1) {
      if (!keyShiftPressed) {
        FogHandler.clearExplosion();
      } else {
        FogHandler.clearFocusedExplosion(mouseAngle);
      }
    } else {
      if (keyShiftPressed) {
        FogHandler.clearFocusedExplosion(mouseAngle);
      } else {
        FogHandler.clearCone(mouseAngle);
      }
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