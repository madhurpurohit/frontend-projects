// const startsWith = (mainString, subString) => {
//   return mainString.toLowerCase().indexOf(subString.toLowerCase()) === 0
//     ? true
//     : false;
// };

const startsWith = (str, substr) => {
  //   return str.toLowerCase().startsWith(substr.toLowerCase());
  return str.slice(0, substr.length).toLowerCase() === substr.toLowerCase();
};

console.log(startsWith("Hello world", "hello"));
console.log(startsWith("Hello world", "World"));
