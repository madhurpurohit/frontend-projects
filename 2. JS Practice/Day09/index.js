const calculateAverage = (arr) => {
  let sum = arr.reduce((accum, curElem) => (accum += curElem), 0);

  return sum / arr.length;
};

console.log(calculateAverage([5, 10, 2, 8]));
