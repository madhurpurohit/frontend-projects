// const isEmptyObject = (obj) => {
//   for (let key in obj) {
//     if (obj.hasOwnProperty(key)) return `It's not empty.`;
//   }

//   return `It's empty.`;
// };

const isEmptyObject = (obj) => {
  return Object.keys(obj).length ? `It's not empty.` : `It's empty.`;
};

console.log(isEmptyObject({ name: "DevFlux" }));
console.log(isEmptyObject({}));
console.log(isEmptyObject({ keyWithNull: null }));
console.log(isEmptyObject({ keyWithUndefined: undefined }));
