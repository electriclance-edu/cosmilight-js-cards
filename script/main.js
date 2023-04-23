/*--------------
GLOBALS
--------------*/
var magicCircleActivated = false;
var currentRune = 0;
const magicCircle = getElem("magicCircle");
const magicCircleRunes = getElem("magicCircle-runeParent");

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
/*
--------------
ONLOAD FUNCTIONS
--------------
*/



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
function makeDraggable(elem) {
  elem.addEventListener("mousedown", function(e) {setDrag(elem, true, e)});
  document.addEventListener("mouseup", function(e) {setDrag(elem, false, e)});
}
const movementManager = function(e) {manageDrag(e)};
function setDrag(elem, state, event) {
  if (state) {  
      manageDrag(event);
      elem.classList.add("draggable");
      document.addEventListener("mousemove", manageDrag, true);
      document.body.appendChild(elem);
  } else {
      elem.classList.remove("draggable");
      document.removeEventListener("mousemove", manageDrag, true);
      getElem(elem.getAttribute("data-row")).appendChild(elem);
  }
}
function manageDrag(e) {
  elem = e.target;
  elem.style.setProperty("--drag-top", e.clientY + "px"); 
  elem.style.setProperty("--drag-left", e.clientX + "px");

  windowSection = window.innerHeight / 3;
  if (e.clientY < windowSection) {
    elem.setAttribute("data-row","cardRow,-1");
  } else if (e.clientY < windowSection * 2) {
    elem.setAttribute("data-row","cardRow,0");
  } else {
    elem.setAttribute("data-row","cardRow,1");
  }
}
/*
--------------
CARD FUNCTIONS
--------------
*/
cards.forEach((card) => {
  if (card.type == "spell") {
    getElem("cardRow,0").appendChild(generateCardElement(card));
  } else {
    getElem("cardRow,-1").appendChild(generateCardElement(card));
    getElem("cardRow,1").appendChild(generateCardElement(card));
  }
}); 
function generateCardElement(cardData) {  
  var card = elem("div","card");
  card.style = `--bg:var(--color-${cardData.colorName})`;

  makeDraggable(card);
  
  var cardDesc = elem("div","card-desc");
  cardDesc.innerHTML = cardData.desc;
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
  var cardTitle = generateCardTitleElement(cardData.title, cardData.subtitle);
  cardTitleContainer.appendChild(cardTitle);

  
  if (cardData.type == "spell") {
    cardImgContainer.style = `--image:url('../resources/img/cards/${cardData.type}/${cardData.title}.png')`;
  } else if (cardData.type == "structure") {
    cardImgContainer.style = `--image:url('../resources/img/cards/${cardData.type}/${cardData.colorName}/${cardData.title}.png')`;
    card.classList.add("structure");
  } else if (cardData.type == "darkness") {
    card.classList.add("darkness");
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
-----------------
UTILITY FUNCTIONS
-----------------
*/
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