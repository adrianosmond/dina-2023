const fs = require('fs');

const makeCombinations = (
  allCombinations,
  target,
  numElements,
  current = [],
  currentSum = 0,
  start = 0,
) => {
  for (let x = start + 1; x <= 9; x += 1) {
    if (currentSum + x > target) return;
    const arr = [...current, x];
    if (arr.length === numElements && currentSum + x === target) {
      allCombinations.push(arr);
    } else if (arr.length < numElements) {
      makeCombinations(
        allCombinations,
        target,
        numElements,
        arr,
        currentSum + x,
        x,
      );
    }
  }
};

const targets = {};
for (let i = 1; i <= 45; i += 1) {
  targets[i] = {};
  for (let x = 1; x <= 9; x += 1) {
    targets[i][x] = [];
    makeCombinations(targets[i][x], i, x);
    // if (targets[i][x].length === 0) delete targets[i][x];
  }
}

fs.writeFileSync('data.json', JSON.stringify(targets, null, 2));
