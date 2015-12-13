console.time("push");
var pushResult = [];
for(var i=0; i < 1000000; i++) {
  pushResult.push(i);
}
console.timeEnd("push");

console.time("brackets");
var bracketResult = [];
for(var i=0; i < 1000000; i++) {
  bracketResult[bracketResult.length] = i;
}
console.timeEnd("brackets");
