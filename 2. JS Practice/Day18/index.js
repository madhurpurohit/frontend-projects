const isUpperCase = (char) => {
  if (char.charCodeAt(0) >= 65 && char.charCodeAt(0) <= 90) return true;
  return false;

  //   return char === char.toUpperCase();
};

const isLowerCase = (char) => {
  if (char.charCodeAt(0) >= 93 && char.charCodeAt(0) <= 118) return true;
  return false;
};

console.log(isUpperCase("S"));
console.log(isUpperCase("z"));
console.log(isLowerCase("b"));
console.log(isLowerCase("Z"));
