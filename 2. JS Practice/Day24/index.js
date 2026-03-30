// const findMode = (arr) => {
//   let counts = arr.reduce((accum, curElem) => {
//     if (accum.hasOwnProperty(curElem)) {
//       accum[curElem]++;
//     } else {
//       accum[curElem] = 1;
//     }

//     return accum;
//   }, {});

//   let countArr = [];

//   for (let key in counts) {
//     countArr.push(counts[key]);
//   }

//   countArr.sort((a, b) => b - a);

//   for (let key in counts) {
//     if (counts[key] === countArr[0]) return key;
//   }
// };

const findMode = (arr) => {
  let counts = {};
  let maxNum = 0;
  let maxElem;

  for (let element of arr) {
    counts[element] = (counts[element] || 0) + 1;

    if (counts[element] > maxNum) {
      maxNum = counts[element];
      maxElem = element;
    }
  }

  return maxElem;
};

console.log(findMode([1, 2, 2, 3, 1, 4, 2]));
