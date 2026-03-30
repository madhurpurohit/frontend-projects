// const repeatString = (str, iteration) => {
//   if(num===0) return str;

//   let finalStr = "";

//   for (let i = 0; i < iteration; i++) {
//     finalStr += str;
//   }

//   return finalStr;
// };

const repeatString = (str, num) => {
  return num > 0 ? str.repeat(num) : str;
};

console.log(repeatString("abc", 5));
console.log(repeatString("abc", 0));
console.log(repeatString("0", 5));
console.log(repeatString(" ", 5));
