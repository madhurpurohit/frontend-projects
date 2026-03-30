// const findMin = (arr) => {
//   arr.sort((a, b) => a - b);

//   return arr[0];
// };

const findMin = (arr) => {
  if (arr.length == 0) return "No number is present in your array";
  return Math.min(...arr);
};

console.log(findMin([5, 10, 2, 8]));
console.log(findMin([5, -3, 0, 12, -7]));
console.log(findMin([]));
