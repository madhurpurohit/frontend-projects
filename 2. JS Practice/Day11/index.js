// const sumOfDigits = (num) => {
//   num = String(num);

//   let sum = 0;

//   for (let i = 0; i < num.length; i++) {
//     sum += Number(num[i]);
//   }

//   return sum;
// };

const sumOfDigits = (num) => {
  let arr = Array.from(String(num), Number);

  return arr.reduce((accum, curElem) => (accum += curElem), 0);
};

console.log(sumOfDigits(1234));
console.log(sumOfDigits(4321));
console.log(sumOfDigits(123456));
