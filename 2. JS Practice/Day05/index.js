const sortAscending = (arr) => {
  let sortArr = structuredClone(arr);

  for (let i = 0; i < sortArr.length; i++) {
    for (let j = 0; j < sortArr.length - i - 1; j++) {
      if (sortArr[j] > sortArr[j + 1]) {
        [sortArr[j], sortArr[j + 1]] = [sortArr[j + 1], sortArr[j]];
      }
    }
  }

  return sortArr;
};

// console.log(sortAscending([5, 3, 10, 8]));
console.log(sortAscending([10, 8, 5, 3, 1]));
console.log(typeof sortAscending[2]);
