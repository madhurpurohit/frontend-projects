//* Longest Word in a String.

// str1="Watch HTML CSS JavaScript React videos to become a frontend developer"
// str2= "The quick brown fox jumps over the lazy dog"
// str3="Hello, world! This is a test."
// str4="Data123 science42 and AI99"
// str5="" / "   "
// str6="abc!123 def-4567 ghi...789"
// str7= "    !!!   ,,,   ???   "
// str8= "alpha beta gamma delta"

let str = "alpha beta gamma delta";

let trimStr = str.trim();

let arrStr = str.split(" ");

let longestWord,
  wordLength = 0;

function findLongestWord(arrStr) {
  for (let i = 0; i < arrStr.length; i++) {
    if (wordLength < arrStr[i].length) {
      wordLength = arrStr[i].length;
      longestWord = arrStr[i];
    }
  }

  if (longestWord === undefined) {
    longestWord = false;
  }

  return [longestWord, wordLength];
}

let answer = findLongestWord(arrStr);

console.log(`LongestWord is:- ${answer[0]} & the length is:- ${answer[1]}`);
