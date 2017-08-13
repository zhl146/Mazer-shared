const Utils = {
    arrayIsFarEnough: function (array, point, distance) {
        // every only returns true only if every element in the tested array passes the callback function test
        return array.every((pointInArray) => pointInArray.calculateDistance(point) > distance);
    },
    arrayContainsPoint: function (array, pointToCheck) {
        // some returns true as soon as an element in the array passes the callback function test
        return array.some((pointInArray) => pointInArray.matches(pointToCheck));
    },
    removePointInArray: function (array, pointToRemove) {
        // returns a new array with elements that match the callback
        return array.filter((pointInArray) => !pointInArray.matches(pointToRemove));
    },
};

export default Utils;