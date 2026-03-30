//* Count Occurrence of Characters.

// Method-1
// const countChar = (str, letter) => {
//   let count = 0;
//   for (let i = 0; i < str.length; i++) {
//     if (str[i].toLowerCase() === letter || str[i].toUpperCase() === letter) {
//       count++;
//     }
//   }

//   return count;
// };

const countChar = (str, letter) => {
  str = str.toLowerCase();
  letter = letter.toLowerCase();

  let totalCount = str.split("").reduce((accum, curElement) => {
    if (curElement === letter) accum++;

    return accum;
  }, 0);

  return totalCount;
};

console.log(countChar("MissIssippi", "I"));
