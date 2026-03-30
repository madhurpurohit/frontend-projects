// const isPalindrome = (str) => {
//   str = str.replaceAll(",", "");
//   str = str.replaceAll(" ", "");
//   str = str.toLowerCase();

//   const str1 = structuredClone(str);

//   let first = str[0];
//   let last = str[str.length - 1];

//   while (first < last) {
//     if (first == last) {
//       first++;
//       last--;
//     } else return false;
//   }

//   return true;
// };

const isPalindrome = (str) => {
  str = str.toLowerCase().replace(/\W/g, ""); // Here g means global & W means non-character means excluding a-z, A-z & 0-9.
  let r_str = str.split("").reverse().join("");

  //   return str === r_str ? true : false;
  return str === r_str;
};

console.log(isPalindrome("A man, a plan, a canal, Panama"));
console.log(isPalindrome("racecar"));
console.log(isPalindrome("hello"));
