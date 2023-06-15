/*--------------
GLOBALS
--------------*/
var magicCircleActivated = false;
var currentRune = 0;
const magicCircle = getElem("magicCircle");
const magicCircleRunes = getElem("magicCircle-runeParent");
var cardWidth = undefined;
var cardHeight = undefined;
var windowHeight = undefined;
var windowWidth = undefined;
/*
--------------
GLOBALS (GAME WORLD)
--------------
*/
var gameBoard = {};
var player = new Player();
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
/*
--------------
ONLOAD FUNCTIONS
--------------
*/
function onload() {
  getCardProperties();
  debug_generateCardscape();
  renderBoard();
}
function getCardProperties() {
  var style = getComputedStyle(document.body);
  cardWidth = parseInt(removePx(style.getPropertyValue('--card-width'))) + 10;
  cardHeight = parseInt(removePx(style.getPropertyValue('--card-height'))) + 10;

  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth;
}
/*
--------------
GENERAL GUI FUNCTIONS
--------------
*/
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
var dragStartingCoords = {x:undefined,y:undefined};
var dragGhost = undefined;

document.addEventListener('mousedown', (e) => {
  //if target is an eleemnt of class draggable
  if (e.target.classList.contains("draggable")) {
    onDragStart(e);
    document.addEventListener('mousemove', dragManager, true);
    document.addEventListener('mouseup', dragEnder, true);
  }
});
function endDrag(e) {
  dragGhost.remove();
  dragGhost = undefined;
  
  document.removeEventListener("mousemove", dragManager, true);
  document.removeEventListener('mouseup', dragEnder, true);

  onDragEnd(e);
}
function onDragStart(e) {
  var coords = mouseToWorldCoordinates(e);

  dragStartingCoords = coords;

  const cardData = retrieveCardDataAt(coords.x,coords.y).type;
  var ghost = generateRawCardElement(cardData);
  ghost.classList.add("drag_ghost");
  ghost.classList.add(".state-vanished");
  setTimeout(() => {
    ghost.classList.remove("state-vanished");
  },500);

  dragGhost = ghost;
  dragGhost.style.setProperty("--drag-top", e.clientY + "px"); 
  dragGhost.style.setProperty("--drag-left", e.clientX + "px");

  document.body.appendChild(ghost);
}
function onDragMove(e) {
  dragGhost.style.setProperty("--drag-top", e.clientY + "px"); 
  dragGhost.style.setProperty("--drag-left", e.clientX + "px");
}
function onDragEnd(e) {
  var coords = mouseToWorldCoordinates(e);
  //target and actor
  var data = retrieveCardDataAt(coords.x,coords.y);
  var draggerData = retrieveCardDataAt(dragStartingCoords.x,dragStartingCoords.y);

  if (coords.x == dragStartingCoords.x && coords.y == dragStartingCoords.y) {
    //do nothing because this is the same coordinate
  } else if (data.type == undefined) {
    //basic movement function --- 
    // temporary, because different cards have different reactions depending on what they are
    // it may be better to just have a stored "expectedDragResolution" variable or smth 
    // that stores what to do in this part of hte function, but for now, hardcoded its movement
    updateCardDataAt(coords.x,coords.y,draggerData);
    updateCardDataAt(dragStartingCoords.x,dragStartingCoords.y,undefined);
    renderCard(coords.x,coords.y);
  } else if (data.type != undefined) {
    console.log(data.type.type);
    if (draggerData.type.title == "harvest" && data.type.type == "castable") {
      updateCardTypeAt(coords.x,coords.y,CardType.getById("resource"));
      updateCardTypeAt(dragStartingCoords.x,dragStartingCoords.y,undefined);
      renderCard(coords.x,coords.y);
      renderCard(dragStartingCoords.x,dragStartingCoords.y);
    } else if (draggerData.type.type == "spell" && data.type.type == "castable") {
      updateCardTypeAt(coords.x,coords.y,CardType.getById("amogs"));
      updateCardTypeAt(dragStartingCoords.x,dragStartingCoords.y,undefined);
      renderCard(coords.x,coords.y);
      renderCard(dragStartingCoords.x,dragStartingCoords.y);
    } else if (draggerData.type.title == "tree" && data.type.title == "tree") {
      updateCardTypeAt(coords.x,coords.y,CardType.getById("bigTree"));
      updateCardTypeAt(dragStartingCoords.x,dragStartingCoords.y,undefined);
      renderCard(coords.x,coords.y);
      renderCard(dragStartingCoords.x,dragStartingCoords.y);
    }
  }
  
}
function makeDraggable(elem) {
  elem.classList.add("draggable");
}
function mouseToWorldCoordinates(e) {
  var x = e.clientX - windowWidth/2;
  var y = e.clientY - windowHeight/2;

  x = Math.round(x / cardWidth);
  y = Math.round(y / cardHeight);

  return {x:x,y:y};
}
/*
--------------
CARD FUNCTIONS
--------------
*/
function retrieveCardDataAt(x,y) {
  if (!gameBoard.hasOwnProperty(y)) {
    return new Card();
  }
  if (gameBoard[y][x] == undefined) {
    return new Card();
  }
  return gameBoard[y][x];
}
function updateCardTypeAt(x,y,newType) {
  if (!gameBoard.hasOwnProperty(y)) {
    gameBoard[y] = {};
  }
  gameBoard[y][x].type = newType;
}
function updateCardDataAt(x,y,newData) {
  if (!gameBoard.hasOwnProperty(y)) {
    gameBoard[y] = {};
  }
  gameBoard[y][x] = newData;
}
function renderBoard() { 
  for (var y of Object.keys(gameBoard)) {
    for (var x of Object.keys(gameBoard[y])) {
      renderCard(x,y);
    }
  }
}
function renderCard(x,y) {
  var cardDataToUpdate = retrieveCardDataAt(x,y);
  try {
    cardDataToUpdate.elem.remove();
    cardDataToUpdate.elem = undefined;
  } catch (Exception) {}
  
  try {
    var elem = generateGridCardElement(x,y);
    cardDataToUpdate.setElem(elem);
    updateCardDataAt(x,y,cardDataToUpdate);
    getElem("CardGrid").appendChild(elem);
  } catch (Exception) {}
}
function debug_generateCardscape() {
  var boardHeight = 2;
  var boardWidth = 2;
  // var boardHeight = Math.floor(windowHeight / cardHeight) - 2;
  // var boardWidth = Math.floor(windowWidth / cardWidth) - 2;

  for (var y = Math.floor(boardHeight / 2) - boardHeight; y < Math.floor(boardHeight / 2) + 1; y++) {
    for (var x = Math.floor(boardWidth / 2) - boardWidth; x < Math.floor(boardWidth / 2) + 2; x++) {
      updateCardDataAt(x,y,new Card(randElem(cardTypes)));
    }
  }
}
function generateGridCardElement(x,y) {
  try {
    var cardType = retrieveCardDataAt(x,y).type;
  } catch (TypeError) {
    console.error(`generateGridCardElement(${x},${y}): Attempted to generate a card element from undefined.`);
    throw TypeError;
  }

  if (cardType == undefined) {
    console.error(`generateGridCardElement(${x},${y}): Attempted to generate a card element from undefined.`);
    throw TypeError;
  }

  var card = generateRawCardElement(cardType);
  card.style.setProperty("--x",x);
  card.style.setProperty("--y",y);

  return card;
} 
function generateRawCardElement(cardType) {  
  var card = elem("div","card");
  card.style = `--bg:var(--color-${cardType.colorName})`;

  makeDraggable(card);
  
  var cardDesc = elem("div","card-desc");
  cardDesc.innerHTML = cardType.desc;
  card.appendChild(cardDesc);
  
  var cardBg = elem("div","card-bg");
  card.appendChild(cardBg);
  var cardBgCircle1 = elem("div","card-bg-circle");
  cardBgCircle1.style = "--index:0";
  cardBg.appendChild(cardBgCircle1)
  var cardBgCircle2 = elem("div","card-bg-circle");
  cardBgCircle2.style = "--index:1";
  cardBg.appendChild(cardBgCircle2)
  var cardBgCircle3 = elem("div","card-bg-circle");
  cardBgCircle3.style = "--index:2";
  cardBg.appendChild(cardBgCircle3)

  var cardContent = elem("div","card-content");
  card.appendChild(cardContent);
  var cardImgContainer = elem("div","card-img-container");
  cardContent.appendChild(cardImgContainer);
  var cardTitleContainer = elem("div","card-title-container");
  cardContent.appendChild(cardTitleContainer);
  var cardTitle = generateCardTitleElement(cardType.title, cardType.subtitle);
  cardTitleContainer.appendChild(cardTitle);

  card.classList.add(cardType.type);
  if (cardType.type == "spell") {
    cardImgContainer.style = `--image:url('../resources/img/cards/${cardType.type}/${cardType.title}.png')`;
  } else if (cardType.type == "castable") {
    cardImgContainer.style = `--image:url('../resources/img/cards/${cardType.type}/${cardType.colorName}/${cardType.title}.png')`;
  } else if (cardType.type == "darkness") {
    //none
  }

  return card;
}
function generateCardTitleElement(title,subtitle) {
  var cardTitle = elem("div");
  cardTitle.classList.add("card-title");
  
  //split title into characters
  title.split("").forEach(letter => {
    var char = elem("div","card-title-char headerFont",letter.toUpperCase());
    cardTitle.append(char);
  });
  //linebreak
  cardTitle.append(elem("div","flex-break"));
  //split subtitle
  subtitle.split("").forEach(letter => {
    var char = elem("div","card-subtitle-char headerFont-thin",letter.toUpperCase());
    cardTitle.append(char);
  });

  return cardTitle;
}
function selectCard() {

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
function createDot(x = windowWidth/2, y=windowHeight/2,borderColor = "red") {
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
function randInt(max) {
  return Math.floor(Math.random()*(max));
}
function randFloat(max) {
  return Math.random()*max;
}
function randElem(array) {
  return array[randInt(array.length)];
}
function clamp(num,min,max) {
  //https://stackoverflow.com/questions/5842747/how-can-i-use-javascript-to-limit-a-number-between-a-min-max-value
   return Math.max(min, Math.min(num, max));
}
function getElem(id) {
  return document.getElementById(id);
}
function glhelm (tag, className = false, innerHTML = false) {
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