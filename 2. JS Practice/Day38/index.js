const calculateDaysBetweenDates = (d1, d2) => {
  let date1 = new Date(d1);
  let date2 = new Date(d2);

  return Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
};

console.log(calculateDaysBetweenDates("2024-01-01", "2024-06-20")); // Output: 30
