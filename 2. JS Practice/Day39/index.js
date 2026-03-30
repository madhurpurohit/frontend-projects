// const calculateAge = (date) => {
//   let birthDate = new Date(date);
//   let currentDate = new Date();

//   let currentYear = currentDate.getFullYear();
//   let birthYear = birthDate.getFullYear();

//   let age = Math.abs(currentYear - birthYear);

//   let currentMonth = currentDate.getMonth();
//   let birthMonth = birthDate.getMonth();

//   if (currentMonth < birthMonth) age = age - 1;

//   let currentDay = currentDate.getDate();
//   let birthDay = birthDate.getDate();

//   if (currentDay < birthDay) age = age - 1;

//   return age;
// };

const calculateAge = (date) => {
  let todayDate = new Date();
  let birthDate = new Date(date);

  let age = Math.abs(birthDate.getFullYear() - todayDate.getFullYear());

  let monthDifference = todayDate.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && todayDate.getDate() < birthDate.getDate())
  )
    age -= 1;

  return age;
};

console.log(calculateAge("1990-07-17"));
console.log(calculateAge("2001-06-05"));
