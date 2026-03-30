const rates = {
  USD: 1, // Base Currency
  EUR: 0.8626, // 1 USD = 0.8626 EUR
  GBP: 0.7475, // 1 USD + 0.7475 GBP
  INR: 85.9905, // 1 USD = 85.9905 INR
};

// const convertCurrency = (amount, fromCurrency, toCurrency) => {
//   usdCurrency = 1 / rates[fromCurrency];

//   usdCurrency = usdCurrency * amount;

//   return Number((usdCurrency * rates[toCurrency]).toFixed(2));
// };

const convertCurrency = (amount, FC, TC) => {
  let usdCurrency = 0;
  if (FC !== "USD") {
    usdCurrency = amount / rates[FC];
  } else {
    usdCurrency = amount;
  }

  let convertedCurrency = 0;

  if (TC !== "USD") {
    convertedCurrency = usdCurrency * rates[TC];
  } else {
    convertedCurrency = usdCurrency;
  }

  return convertedCurrency;
};

console.log(convertCurrency(100, "GBP", "EUR"));
console.log(convertCurrency(380, "USD", "EUR"));
console.log(convertCurrency(500, "INR", "USD"));
console.log(convertCurrency(5400, "USD", "USD"));
