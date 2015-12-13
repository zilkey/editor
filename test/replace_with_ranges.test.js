function replaceAndGetIndices(string, from, to){
  var j = 0, result = [], indices = [], distance = to.length - from.length;
  for (var i = 0; i < string.length;) {
    if (string.substring(i, i + from.length) === from) {
      result[result.length] = to;
      indices[indices.length] = (i + (j * distance));
      i += from.length;
      j++;
    } else {
      result[result.length] = string[i];
      i++;
    }
  }
  return {result: result.join(''), indices: indices};
}

var expect = require('chai').expect;
describe('Editor', function () {

  it("works with shorter strings", function () {
    var input = "more code more problems more stuff";
    var from = "more";
    var to = "mo";
    var expected = {result: "mo code mo problems mo stuff", indices: [0,8,20]};
    expect(replaceAndGetIndices(input, from, to)).to.eql(expected)
  });

  it("works with longer strings", function () {
    var input = "more code more problems more stuff";
    var from = "more";
    var to = "mooore";
    var expected = {result: "mooore code mooore problems mooore stuff", indices: [0,12,28]};
    expect(replaceAndGetIndices(input, from, to)).to.eql(expected)
  });

  it("works with equal length strings", function () {
    var input = "more code more problems more stuff";
    var from = "more";
    var to = "some";
    var expected = {result: "some code some problems some stuff", indices: [0,10,24]};
    expect(replaceAndGetIndices(input, from, to)).to.eql(expected)
  });

})
