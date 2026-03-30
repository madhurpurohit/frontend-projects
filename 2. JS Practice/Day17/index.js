const toCamelCase = (str) => {
  let arr = str.trim().split(" ");

  let newArr = arr
    .map((value, index) => {
      if (index === 0) {
        return value;
      }

      value = value.toLowerCase();
      value = value.replace(value[0], value[0].toUpperCase());
      return value;
    })
    .join("");

  return newArr;
};

const toSnakeCase = (str) => {
  return str
    .trim()
    .split(" ")
    .map((value, index) => {
      if (index == 0) return value;

      return value.toLowerCase().replace(value[0], value[0].toUpperCase());
    })
    .join("_");
};

console.log(toCamelCase("hello world devFlux"));
console.log(toSnakeCase("hello world devFlux"));
