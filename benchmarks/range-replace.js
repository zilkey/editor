function replace(string, ranges, from, to){
  var j = 0, result = '';
  for (var i = 0; i < string.length;) {
    if (i === ranges[j]) {
      j++;
      result += to;
      i += from.length;
    } else {
      result += string[i];
      i++;
    }
  }
  return result;
}

function replaceJoin(string, ranges, from, to){
  var j = 0, result = [];
  for (var i = 0; i < string.length;) {
    if (i === ranges[j]) {
      j++;
      result[result.length] = to;
      i += from.length;
    } else {
      result[result.length] = string[i];
      i++;
    }
  }
  return result.join('');
}

function builtin(string, ranges, from, to) {
  var i = 0;
  return string.replace(new RegExp(from, 'g'), function (match, index) {
    if (ranges[i] === index) {
      i++;
      return to;
    } else {
      return match;
    }
  });
}

var strings = [];
var string = "";
var ranges;
var j;
for(var i = 0; i < 8000; i++) {
  string += "more code ";
  ranges = [];
  startIndex = string.indexOf("more");

  while(~startIndex) {
    ranges.push(startIndex);
    startIndex = string.indexOf("more", startIndex + "more".length);
  }

  strings.push([string, ranges]);
}

console.time("custom");
var result = 0;;
for (var i = 0; i < strings.length; i++) {
  result += replaceJoin(strings[i][0], strings[i][1], "more", "mo").length;
}
for (var i = 0; i < strings.length; i++) {
  result += replaceJoin(strings[i][0], strings[i][1], "more", "moooore").length;
}
for (var i = 0; i < strings.length; i++) {
  result += replaceJoin(strings[i][0], strings[i][1], "more", "some").length;
}
console.log(result);
console.timeEnd("custom");

console.time("replaceJoin");
var result = 0;;
for (var i = 0; i < strings.length; i++) {
  result += replace(strings[i][0], strings[i][1], "more", "mo").length;
}
for (var i = 0; i < strings.length; i++) {
  result += replace(strings[i][0], strings[i][1], "more", "moooore").length;
}
for (var i = 0; i < strings.length; i++) {
  result += replace(strings[i][0], strings[i][1], "more", "some").length;
}
console.log(result);
console.timeEnd("replaceJoin");

console.time("builtin");
var result = 0;;
for (var i = 0; i < strings.length; i++) {
  result += builtin(strings[i][0], strings[i][1], "more", "mo").length;
}
for (var i = 0; i < strings.length; i++) {
  result += builtin(strings[i][0], strings[i][1], "more", "moooore").length;
}
for (var i = 0; i < strings.length; i++) {
  result += builtin(strings[i][0], strings[i][1], "more", "some").length;
}
console.log(result);
console.timeEnd("builtin");
