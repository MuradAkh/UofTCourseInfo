function upToDate(str) {
    let curr = new Date().getFullYear();
    let prev = curr - 1;
    let next = curr + 1;
    return (str.includes(curr) || str.includes(prev)|| str.includes(next))

}


//taken from: https://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
function cleanArray(actual) {
    let newArray = [];
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}

Array.prototype.unique = function () {
    let a = [];
    for (let i = 0; i < this.length; i++) {
        let current = this[i];
        if (a.indexOf(current) < 0) a.push(current);
    }
    return a;
};