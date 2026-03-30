const sumOfSquares = (arr) => {
  return arr.reduce((accum, curElem) => (accum += curElem * curElem), 0);
};

console.log(sumOfSquares([1, 2, 3]));
console.log(sumOfSquares([10, 20, 30]));
