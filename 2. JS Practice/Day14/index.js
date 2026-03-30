// const isPowerOfTwo = (num) => {
//   if (num <= 1) return false;
//   if (num === 2) return true;

//   let two = 2;
//   for (let i = 0; i < num; i++) {
//     two *= 2;
//     if (two === num) return true;
//   }

//   return false;
// };

//* We know that we have a feature in new ECMAScript that is 2**i it means 2's power of i. For example 2**3=8, 2**10=1024
const isPowerOfTwo = (num) => {
  if (num <= 1) return false;
  let opposite = false;
  for (let i = 1; i < num; i++) {
    if (2 ** i == num) opposite = true;
  }

  return opposite;
};

console.log(isPowerOfTwo(8));
console.log(isPowerOfTwo(7));
console.log(isPowerOfTwo(0));
console.log(isPowerOfTwo(1024));
