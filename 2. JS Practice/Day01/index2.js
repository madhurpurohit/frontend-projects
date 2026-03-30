const findLongestWord = (str) => {
  if (str.trim().length === 0) {
    return false;
  }

  words = str.split(" ");

  return words.reduce(
    (accumulator, curWord) =>
      curWord.length > accumulator.length ? curWord : accumulator,
    ""
  );
};

console.log(findLongestWord("The quick brown fox jumps over the lazy dog"));
