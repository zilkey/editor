function ranges(currentState, from, to){
  var ranges = [],
      startIndex = currentState.indexOf(from),
      distance = to.length - from.length,
      i = 0;

  while(~startIndex) {
    ranges.push(startIndex + (i * distance));
    startIndex = currentState.indexOf(from, startIndex + from.length);
    i++;
  }

  return ranges;
}

var expect = require('chai').expect;
describe('Editor', function () {

  it("works with shorter strings", function () {
    var input = "more code more problems more stuff";
    var from = "more";
    var to = "mo";
    var expected = [0,8,20];
    expect(ranges(input, from, to)).to.eql(expected)
  });

  it("works with longer strings", function () {
    var input = "more code more problems more stuff";
    var from = "more";
    var to = "mooore";
    var expected = [0,12,28];
    expect(ranges(input, from, to)).to.eql(expected)
  });

  it("works with equal length strings", function () {
    var input = "more code more problems more stuff";
    var from = "more";
    var to = "some";
    var expected = [0,10,24];
    expect(ranges(input, from, to)).to.eql(expected)
  });

})
