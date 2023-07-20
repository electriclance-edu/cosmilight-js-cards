// Picks the first not undefined amongst all of its arguments. If none, returns undefined.
function selectFirstDefined(...args) {
    for (var i = 0; i < args.length; i++) {
        let arg = args[i];
        if (!!arg) return arg;
    }
    return undefined;
}

// Checks if both objects contain the same keys, and the same values for those keys.
function hasSameKeysAndValues(objA,objB) {
    return Object.keys(objA).every((objAKey) => objA[objAKey] == objB[objAKey]) && Object.keys(objB).every((objBKey) => objB[objBKey] == objA[objAKey]);
}
// Checks if superset contains every element in subset.
function checkIfSuperset(superset,subset) {
    return subset.every((elemInSubset) => superset.includes(elemInSubset));
}
// Uses checkIfSuperset to check if a given object has the right keys. If not, throws an error.
function verifyIfValidKeys(obj, requiredKeys, errorMessage) {
    if (!checkIfSuperset(Object.keys(obj), requiredKeys)) {
        // console.warn(`Given object with keys ${Object.keys(obj)} does not have required keys ${requiredKeys}.`);
        throw `MissingPropertyError: ${errorMessage} (Missing properties: ${findMissingKeys(obj,requiredKeys)})`;
    }
}
// Checks if an object has the given property. If not, throws an error.
function verifyIfHasProperty(obj, reqProperty, errorMessage) {
    if (!obj.hasOwnProperty(reqProperty)) {
        // console.warn(`Given object with keys ${Object.keys(obj)} does not have required keys ${requiredKeys}.`);
        throw `MissingPropertyError: ${errorMessage} (Missing property: ${reqProperty})`
    }
}
// Merges two objects, prioritizing the values of the main object.
function mergeObjects(main,merger) {
    return {...merger, ...main};
}
// Generates a DOM element given certain properties.
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
// Given a point and the center that it is relative to, converts to absolute coordinates
function decentralizePoint(center, point) {
    return new Point(point.x + center.x, point.y + center.y);
} 

// Generates a square, halfside equal to half the length of a side
function generateSquare(center, halfside) {
    return {
        center:center,
        width:halfside*2,
        height:halfside*2,
        topLeft:new Point(center.x - halfside, center.y - halfside),
        bottomRight:new Point(center.x + halfside, center.y + halfside)
    };
}

// Returns an array containing every element of the second array the first array does not.
function filterArrayWith(toFilter, filter) {
    return toFilter.filter((elem) => !filter.includes(elem));
} 
/// Uses filterArrayWith to get all keys that an object is missing from a given set of keys.
function findMissingKeys(obj, requiredKeys) {
    return filterArrayWith(requiredKeys, Object.keys(obj));
}

// Returns true if a randomly generated float from 0-1 is lower than the given.
function chance(maxThreshold) {
    return Math.random() < maxThreshold;
}

// Returns the euclidian distance between two points.
function dist(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x,2) + Math.pow(a.y - b.y,2));
}

function clamp(num,min,max) {
    return Math.max(min, Math.min(num, max));
}
function randInt(max) {
    return Math.floor(Math.random()*(max));
}
function randIntNeg(max) {
    return randInt(max) * randSign();
}
function randFloatNeg(max) {
    return randFloat(max) * randSign();
}
function randSign() {
    return randInt(1) == 1 ? -1 : 1; 
}
function randFloat(max) {
     return Math.random()*max;
}
function randElem(array) {
     return array[randInt(array.length)];
}