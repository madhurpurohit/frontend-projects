//* Method-1
// const generateBarChart = (arr) => {
//   for (let i = 0; i < arr.length; i++) {
//     let str = `${i + 1}: `;
//     for (let j = 0; j < arr[i]; j++) {
//       str += "*";
//     }
//     console.log(str);
//   }
// };

//* Method-2
// const generateBarChart = (arr) => {
//   let newArr = arr.map((curElem, index) => {
//     let star = "";
//     let number = 0;

//     while (number < curElem) {
//       star += "*";
//       number++;
//     }

//     return `${index + 1}: ${star}`;
//   });
//   return newArr.join("\n");
// };

//* Method-3
const generateBarChart = (arr) => {
  return arr
    .map((curElem, index) => {
      return `${index + 1}: ${"*".repeat(curElem)}`;
    })
    .join("\n");
};

console.log(generateBarChart([5, 3, 9, 2]));
// Output:-
// 1: *****
// 2: ***
// 3: *********
// 4: **
