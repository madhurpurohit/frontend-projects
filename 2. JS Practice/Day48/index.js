//*---------------------------------------------------------
//* Programming Challenge: Validate Hex Color Code
//*------------------------------------------------------------

//? Write a regular expression to validate a hex color code (e.g., #a3c113).

//* Requirements
//? The hex color code should start with "#".
//? It should be followed by either 3 or 6 hexadecimal characters.

//* Use Cases
//? Validating color codes in design tools.
//? Ensuring consistent color code format in CSS.
//? Filtering valid hex color codes in data processing.

const validateHexColor = (hexColor) => {
  return /^[#]([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hexColor);
};

//* Test Cases
console.log(validateHexColor("#a3c113")); // Expected output: true
console.log(validateHexColor("#fff")); // Expected output: true
console.log(validateHexColor("#1234567")); // Expected output: false
console.log(validateHexColor("a3c113")); // Expected output: false
console.log(validateHexColor("#g3c113")); // Expected output: false
