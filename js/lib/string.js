// Example
//   score = 123;
//   score.toString().padLeft("000000");
//   //=> "000123"
String.prototype.padLeft = function (paddingValue) {
  return String(paddingValue + this).slice(-paddingValue.length);
};
