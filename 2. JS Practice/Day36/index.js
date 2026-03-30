const obj = {
  name: "Madhur Purohit",
  age: 24,
  country: "India",
};

let objToArr = Object.entries(obj);
console.log(objToArr);
console.log(objToArr.flat());

// Method-1
let arrToObj = {};
for (let value of objToArr) {
  arrToObj[value[0]] = value[1];
}

console.log(arrToObj);

//* Method-2
let newObj = Object.fromEntries(objToArr);
console.log(newObj);
