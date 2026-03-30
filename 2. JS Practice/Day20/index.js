// const reverseString = (str) => {
//   let newStr = "";

//   for (let i = str.length - 1; i >= 0; i--) {
//     newStr += str[i];
//   }

//   return newStr;
// };

const reverseString = (str) => {
  return str.split("").reverse().join("");
};

console.log(reverseString("hello"));
console.log(reverseString("DevFLux"));
