const truncateString = (str, size) => {
  if (str.length <= size) return str;
  if (size <= 0) return str;

  let finalStr = str.slice(0, size);
  finalStr += "...";

  return finalStr;
};

console.log(truncateString("A-tisket a-tisket A green and yellow basket", 8));
console.log(truncateString("DevFlux", 7));
