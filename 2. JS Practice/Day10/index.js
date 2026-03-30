// const arraysAreEqual = (arr1, arr2) => {
//   if (arr1.length != arr2.length) return false;

//   for (let i = 0; i < arr1.length; i++) {
//     if (arr1[i] != arr2[i]) return false;
//   }

//   return true;
// };

const arraysAreEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;

  return arr1.every((value, index) => value === arr2[index]); // Agar isme ek single element bhi same nahi nikalta to ye false return kar dega, otherwise true return karega.
};

console.log(arraysAreEqual([1, 2, 3], [1, 2, 3]));
console.log(arraysAreEqual([1, 2, 3], [1, 2, 4]));
console.log(arraysAreEqual([], []));
