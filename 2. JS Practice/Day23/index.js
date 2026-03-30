// const findOccurrence = (arr) => {
//   return arr.reduce((accum, curElem) => {
//     if (accum.hasOwnProperty(curElem)) {
//       accum[curElem]++;
//     } else {
//       accum[curElem] = 1;
//     }

//     return accum;
//   }, {});
// };

const findOccurrence = (arr) => {
  let count = {};

  for (let element of arr) {
    count[element] = (count[element] || 0) + 1;
  }

  return count;
};

console.log(findOccurrence([1, 2, 2, 3, 1, 4, 2]));
