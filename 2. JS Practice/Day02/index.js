//* Hash Tag Generator.

let str = "     my name is madhur purohit     ";
// let str = "      ";

function generateHashtag(string) {
  string = string.trim();

  if (string.length > 280 || string.length == 0) {
    return false;
  }

  string = string.split(" ");

  string = string.map(
    (curElement) =>
      // curElement.replace(curElement[0], curElement[0].toUpperCase()) // Method-1
      curElement.charAt(0).toUpperCase() + curElement.slice(1) // Method-2
  );

  string = string.join("");
  string = "#" + string;

  return string;
}

console.log(generateHashtag(str));
