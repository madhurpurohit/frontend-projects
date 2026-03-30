const countVowels = (str) => {
  str = str.toLowerCase();

  let vowels = ["a", "e", "i", "o", "u"];
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (vowels.includes(str[i])) count++;
  }

  return count;
};

console.log(countVowels("Helloo world"));
console.log(countVowels("ThE quIck brOwn fOx"));
console.log(countVowels("Brrrp"));
