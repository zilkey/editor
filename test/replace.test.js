// string concatenation is faster than split/join and also string.concat - http://jsperf.com/concat-vs-plus-vs-join

function replace(string, ranges, from, to){
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

var expect = require('chai').expect;
describe('Editor', function () {

  it("works with shorter strings", function () {
    var input = "more code more problems more stuff";
    var from = "more";
    var to = "mo";
    var ranges = [0,10,24];
    expect(replace(input, ranges, from, to)).to.eql("mo code mo problems mo stuff");
  });

  it("works with longer strings", function () {
    var input = "more code more problems more stuff";
    var from = "more";
    var to = "mooore";
    var ranges = [0,10,24];
    expect(replace(input, ranges, from, to)).to.eql("mooore code mooore problems mooore stuff");
  });

  it("works with equal length strings", function () {
    var input = "more code more problems more stuff";
    var from = "more";
    var to = "some";
    var ranges = [0,10,24];
    expect(replace(input, ranges, from, to)).to.eql("some code some problems some stuff");
  });

})
