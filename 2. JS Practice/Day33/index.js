// const randomHexColor = () => {
//   let hexValues = "0123456789ABCDEF";

//   let hexColor = "#";

//   for (let i = 0; i < 6; i++) {
//     hexColor += hexValues[Math.floor(Math.random() * hexValues.length)];
//   }

//   return hexColor;
// };

const randomHexColor = () => {
  return `#${Math.random().toString(16).slice(2, 8).padEnd(6, 0)}`;
};

console.log(randomHexColor());
