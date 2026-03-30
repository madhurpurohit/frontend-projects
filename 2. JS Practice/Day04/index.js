const checkTriangleType = (first, second, third) => {
  if (first == second && second == third) {
    return "Equilateral";
  } else if (first == second || first == third || second == third) {
    return "Isosceles";
  } else {
    return "Scalene";
  }
};

console.log(checkTriangleType(3, 3, 3));
console.log(checkTriangleType(3, 4, 3));
console.log(checkTriangleType(3, 8, 6));
