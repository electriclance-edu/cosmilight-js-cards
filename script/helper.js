//Returns an array of all coordinates that are of a given distance or less from a given point.
function discIntCoords(center,radius) {
    var points = [];
    for (var x = center.x - Math.floor(radius); x < center.x + radius; x++) {
        for (var y = center.y - Math.floor(radius); y < center.y + radius; y++) {
            if (dist(new Point(x, y), center) < radius) {
                points.push(new Point(x,y));
            }
        }
    }
    return points;
}
function angleBetween(target,origin) {
    let vector = new Point(target.x - origin.x, -(target.y - origin.y));
    let angle = Math.atan2(vector.y,vector.x) * (180 / Math.PI);
    if (angle < 0) return 360 + angle;
    return angle;
}
//Performs a function over all integer coordinates that intersect with a line.
function integerRaytrace(endA,endB) {
    // The other end point of the line.
    // let endB = Point.angleTranslate(endA,angle,length);

    // The change between the x,y values of endA and endB, encoded in a 2d vector.
    let delta = new Point(
        Math.abs(endB.x - endA.x),
        Math.abs(endB.y - endA.y)
    );
    // The current integer coordinates the algorithm is currently on.
    let currentCoords = new Point(
        Math.floor(endA.x),
        Math.floor(endA.y)
    );

    // The amount of squares that the given line will intersect.
    let amtOfSquares = 1; // Will always at least be 1, the starting square.
    // inc.x and inc.y determine the direction in which the ray is incrementing along the x or y axes.
    // They will be +1,+1 when in the first quadrant.
    let inc = new Point();
    // Encodes the difference of the change between x and y as the algorithm traverses down the line.
    let error;

    // ----------------------
    // Calculating the amt of squares, inc, and error based on the positions of the endpoints relative to each other.

    // ---- Calculate for x
    // If there is no change in x, the line is vertical.
    if (delta.x == 0) {
        inc.x = 0;
        error = Infinity; // The line will always move vertically.
    } 
    // If the second endpoint is further right than the first endpoint.
    else if (endB.x > endA.x) {
        inc.x = 1; 
        amtOfSquares += Math.floor(endB.x) - currentCoords.x; // The width of the line x-wise.
        error = (Math.floor(endA.x) + 1 - endA.x) * delta.y; // Obtain the fractional portion of endA.x. Multiplied by the change in y, that encodes the length of the line required to reach a horizontal endpoint.
    }
    // If the second endpoint is further left, ie. moving backwards 
    else {
        inc.x = -1;
        amtOfSquares += currentCoords.x - Math.floor(endB.x); // The width of the line x-wise.
        error = (endA.x - Math.floor(endA.x)) * delta.y;
    }

    // ---- Repeat the same, but for y.
    if (delta.y == 0) {
        inc.y = 0;
        error -= Infinity;
    } else if (endB.y > endA.y) {
        inc.y = 1; 
        amtOfSquares += Math.floor(endB.y) - currentCoords.y;
        error -= (Math.floor(endA.y) + 1 - endA.y) * delta.x;
    } else {
        inc.y = -1;
        amtOfSquares += currentCoords.y - Math.floor(endB.y);
        error -= (endA.y - Math.floor(endA.y)) * delta.x;
    }

    // Perform the raytrace. Store every coordinate in an array.
    let coordinates = []; 
    for (; amtOfSquares > 0; --amtOfSquares) {
        coordinates.push(new Point(currentCoords.x,currentCoords.y));

        if (error > 0) {
            currentCoords.y += inc.y;
            error -= delta.x;
        } else {
            currentCoords.x += inc.x;
            error += delta.y;
        }
    }

    return coordinates;
}
// Given an array TODO of coordinates, returns a set including all the neighbors of those coordinates. Includes diagonals.
function inflateCoordinateArray(coords) {
    let inflated = new Set();

    coords.forEach((point)=>{
        inflated.add(point.str);
        inflated.add(Point.translate(point,new Point(-1,-1)).str);
        inflated.add(Point.translate(point,new Point(1,1)).str);
        inflated.add(Point.translate(point,new Point(-1,1)).str);
        inflated.add(Point.translate(point,new Point(1,-1)).str);
        inflated.add(Point.translate(point,new Point(-1,0)).str);
        inflated.add(Point.translate(point,new Point(1,0)).str);
        inflated.add(Point.translate(point,new Point(0,-1)).str);
        inflated.add(Point.translate(point,new Point(0,1)).str);
    });

    return Array.from(inflated).map((str)=>Point.stringToPoint(str));
}
function degToRad(deg) {
  return deg * (Math.PI/180);
}
function radToDeg(rad) {
    return rad * 180 / 3.1415;
}
//Returns an array of all integer coordinates that intersect with a given square.
function squareIntersectingIntCoords(center,radius) {
    var square = generateSquare(center,radius);
    // console.log(FogHandler.canvasCenter);
    let debugtime = 1000;
    // createDot(
    //     (square.cornerA.x - Game.player.location.x) * tileWidth + FogHandler.canvasCenter.x,
    //     (square.cornerA.y - Game.player.location.y) * tileHeight + FogHandler.canvasCenter.y,
    //     null,
    //     debugtime
    // );
    // createDot(
    //     (square.cornerB.x - Game.player.location.x) * tileWidth + FogHandler.canvasCenter.x,
    //     (square.cornerB.y - Game.player.location.y) * tileHeight + FogHandler.canvasCenter.y,
    //     null,
    //     debugtime
    // );
    square.cornerA.x = roundAway(square.cornerA.x,square.center.x);
    square.cornerA.y = roundAway(square.cornerA.y,square.center.y);
    square.cornerB.x = roundAway(square.cornerB.x,square.center.x);
    square.cornerB.y = roundAway(square.cornerB.y,square.center.y);
    // createDot(
    //     (square.cornerA.x - Game.player.location.x) * tileWidth + FogHandler.canvasCenter.x,
    //     (square.cornerA.y - Game.player.location.y) * tileHeight + FogHandler.canvasCenter.y,
    //     "blue",
    //     debugtime
    // );
    // createDot(
    //     (square.cornerB.x - Game.player.location.x) * tileWidth + FogHandler.canvasCenter.x,
    //     (square.cornerB.y - Game.player.location.y) * tileHeight + FogHandler.canvasCenter.y,
    //     "blue",
    //     debugtime
    // );

    var points = [];
    // CornerB is the +x+y corner. CornerA is the -x-y corner.
    for (var x = square.cornerA.x; x <= square.cornerB.x; x++) {
        for (var y = square.cornerB.y; y >= square.cornerA.y; y--) {
            points.push(new Point(x,y));
        }
    }
    return points;
}

//Converts a decimal coordinate into a solid tile coordinate.
function roundCoordinate(num) {
    let val = parseFloat(num) + 0.499;
    return Math.floor(val);
}
//Clamps the given value between a minimum and maximum value.
function clamp(value,min,max) {
    return Math.min(Math.max(value, min), max);
}
// Picks the first not undefined amongst all of its arguments. If none, returns undefined.
function selectFirstDefined(...args) {
    for (var i = 0; i < args.length; i++) {
        let arg = args[i];
        if (arg === 0) return arg;
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
// Alias of elem
function aliasElem(tag, className, innerHTML) {
    return elem(tag,className,innerHTML);
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
        cornerA:new Point(center.x - halfside, center.y - halfside),
        cornerB:new Point(center.x + halfside, center.y + halfside)
    };
}

// Converts a string formatted like an HTML file into an element. Returns only the first element in the string if the string has multiple elements.
function parseHTML(rawHTML) {
    return document.createRange().createContextualFragment(rawHTML).firstElementChild;
}
// Converts a string formatted like an HTML file into an element. Returns the document fragment generated.
function parseHTMLDocumentFragment(rawHTML) {
    return document.createRange().createContextualFragment(rawHTML);
}

// Returns an array containing every element of the second array the first array does not.
function filterArrayWith(toFilter, filter) {
    return toFilter.filter((elem) => !filter.includes(elem));
} 
/// Uses filterArrayWith to get all keys that an object is missing from a given set of keys.
function findMissingKeys(obj, requiredKeys) {
    return filterArrayWith(requiredKeys, Object.keys(obj));
}
// Retursn 
// Returns true if a randomly generated float from 0-1 is lower than the given.
function chance(maxThreshold) {
    return Math.random() < maxThreshold;
}

// Returns the euclidian distance between two points.
function dist(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x,2) + Math.pow(a.y - b.y,2));
}
function roundTowards(num, center = 0) {
    return num > center ? Math.floor(num) : Math.ceil(num);
}
function roundAway(num,center = 0) {
    return num < center ? Math.floor(num) : Math.ceil(num);
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
    return randInt(2) ? -1 : 1; 
}
function randFloat(max) {
     return Math.random()*max;
}
function randElem(array) {
     return array[randInt(array.length)];
}