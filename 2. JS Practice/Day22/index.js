// Median means if the array has odd number of elements in ascending order, than median is the middle element.
// If the array has an even number of element, than th median is the average of the tow middle elements.

const findMedian = (arr) => {
  if (arr.length === 0) return 0;

  arr.sort((a, b) => a - b);

  if (arr.length % 2 !== 0) return arr[Math.floor(arr.length / 2)];

  let middle = (arr.length - 2) / 2;
  let median = (arr[middle] + arr[middle + 1]) / 2;

  return median;
};

console.log(findMedian([5, 3, 9, 1, 7]));
console.log(findMedian([2, 4, 6, 8]));
console.log(findMedian([1, 3, 5, 7, 9, 11]));
