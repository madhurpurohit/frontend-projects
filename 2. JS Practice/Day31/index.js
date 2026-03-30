// const simplePasswordValidator = (password) => {
//   if (password.length < 8) return false;

//   let validate = false;

//   for (let value of password) {
//     if (value >= "A" && value <= "Z") {
//       validate = true;
//       break;
//     }
//   }

//   if (validate) {
//     for (let value of password) {
//       if (value >= "a" && value <= "z") {
//         validate = true;
//         break;
//       }
//       validate = false;
//     }

//     if (validate) {
//       for (let value of password) {
//         if (value >= 0 && value <= 9) {
//           validate = true;
//           return true;
//         }
//       }
//     }
//   }

//   return false;
// };

const simplePasswordValidator = (password) => {
  if (password.length < 8) return false;

  let hasUpperCase = false;
  let hasLowerCase = false;
  let hasDigit = false;

  for (let char of password) {
    if (char.charCodeAt(0) >= 65 && char.charCodeAt(0) <= 90) {
      hasUpperCase = true;
    } else if (char.charCodeAt(0) >= 97 && char.charCodeAt(0) <= 122) {
      hasLowerCase = true;
    } else if (!isNaN(Number(char))) {
      hasDigit = true;
    }
  }

  if (!hasUpperCase || !hasLowerCase || !hasDigit) {
    return false;
  }

  return true;
};

console.log(simplePasswordValidator("DevFlux@3"));
console.log(simplePasswordValidator("madhur12345"));
console.log(simplePasswordValidator("PurohitDev"));
console.log(simplePasswordValidator("123456789#$"));
