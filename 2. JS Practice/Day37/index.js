const calculateSimpleInterest = (amount, interest, time) => {
  return (amount * interest * time) / 100;
};

console.log(calculateSimpleInterest(1000, 5, 3));
