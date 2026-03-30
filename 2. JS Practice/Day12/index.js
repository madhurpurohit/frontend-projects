const removeDuplicates = (arr) => {
  if (arr.length === 0 || arr.length === 1) return [];

  let remove = new Set(arr);
  remove = [...remove];
  return remove;
};

console.log(removeDuplicates([1, 2, 3, 2, 1, 4]));
console.log(removeDuplicates([5, 6, 7, 7, 8, 8, 9]));
console.log(removeDuplicates([1, 2, 3, 4]));
console.log(removeDuplicates([]));
