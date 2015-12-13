// only time we need to build from scratch is undoing a replace
// so maybe just store ranges along with the values - figure out how to do this with good memory stats
// on replace, determine the ranges before replacing

function makeEditor() {
  var commands = [];
  var position = 0;
  var currentState = '';

  function clearRedos() {
    var diff = commands.length - Math.max(position, 0);
    for (var i = 0; i < diff; i++) commands.pop();
  }

  function recordCommand(object){
    clearRedos();
    commands.push(object);
    position++;
  }

  return {

    // runs in constant time
    toString : function() {
      return currentState;
    },

    // runs in linear time
    write : function(letters) {
      recordCommand({write: letters});
      currentState += letters;
    },

    replace : function(from, to) {
      var ranges = [],
          startIndex = currentState.indexOf(from),
          distance = to.length - from.length,
          i = 0;

      while(~startIndex) {
        ranges.push(startIndex + (i * distance));
        startIndex = currentState.indexOf(from, startIndex + from.length);
        i++;
      }
      recordCommand({replace: from, with: to, ranges: ranges});
      currentState = currentState.replace(new RegExp(from, 'g'), to);
    },

    undo : function() {
      position--;
      var command = commands[position];
      if (command.replace) {
        currentState = currentState.replace(new RegExp(command.with, 'g'), function (match, index, string) {
          if (command.ranges.indexOf(index) > -1) {
            return command.replace;
          } else {
            return match;
          }
        });
      } else {
        currentState = currentState.substring(0, currentState.length - command.write.length);
      }
    },

    // determine which method to call based on the next command
    redo : function() {
      var command = commands[position];
      command.replace ? this.replace(command.replace, command.with) : this.write(command.write);
    }
  }
}

var expect = require('chai').expect;
describe('Editor', function () {

  it("works", function () {
    var editor = makeEditor();
    editor.write("more code ")
    expect(editor.toString()).to.eq("more code ");

    editor.write("more ")
    expect(editor.toString()).to.eq("more code more ");

    editor.write("joy")
    expect(editor.toString()).to.eq("more code more joy");

    editor.write("!")
    expect(editor.toString()).to.eq("more code more joy!");

    editor.undo();
    expect(editor.toString()).to.eq("more code more joy");

    editor.undo();
    expect(editor.toString()).to.eq("more code more ");

    editor.write("problems")
    expect(editor.toString()).to.eq("more code more problems");

    editor.write("!");
    editor.write("!");
    expect(editor.toString()).to.eq("more code more problems!!");

    editor.undo();
    editor.redo();
    expect(editor.toString()).to.eq("more code more problems!!");

    editor.undo();
    editor.undo();
    expect(editor.toString()).to.eq("more code more problems");

    editor.replace("more", "mo'")
    expect(editor.toString()).to.eq("mo' code mo' problems");

    editor.undo();
    expect(editor.toString()).to.eq("more code more problems");

    editor.redo();
    expect(editor.toString()).to.eq("mo' code mo' problems");

    editor.replace("code", "money");
    expect(editor.toString()).to.eq("mo' money mo' problems");

    editor.replace("problems", "money");
    expect(editor.toString()).to.eq("mo' money mo' money");

    editor.undo();
    expect(editor.toString()).to.eq("mo' money mo' problems");
  });

})
