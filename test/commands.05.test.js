// Iterate over `string` once and
// build a new string with the replacements
// and calculate the which indices will be required in order to reverse this operation
// and return both the new string and the indices.
//
// So if you have the string "top hat top row" and you replace "top" with "hat" you'd get:
//
//    {result: "a hat a row", indices: [0, 6]}
//
//    "a hat a row"
//     ^     ^
//     0     6
//
// This is necessary because when you roll this back, you'll need to only replace the a's at
// index 0 and 6, not the one at index 3 (the "a" in "hat").
//
// runs in O(nm) where n is string.length and m is from.length
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

// Iterate over `string` once and
// at every index in `indices` replace `from` with `to`
// and return the replaced string
//
// So if you have the string "a hat a row" and you replace "a" with "top", passing indices [0,6] you'd get:
//
//    "top hat top row"
//
// Runs in O(n) where n is string.length
function replaceString(string, indices, from, to){
  var j = 0, result = [];
  for (var i = 0; i < string.length;) {
    if (i === indices[j]) {
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
    commands[commands.length] = object;
    position++;
  }

  return {

    toString : function() {
      return currentState;
    },

    // record a new command
    // append the new string to the current string
    // should run in O(n) time where n is the length of the current string plus `letters`
    write : function(letters) {
      recordCommand({write: letters});
      currentState += letters;
    },

    // replace all occurrences of `from` with `to`
    // calculate the indices required to undo the replacement
    // and store them in the command so that `undo` can use them later
    // runs in O(nm) where n is currentState.length and m is from.length
    replace : function(from, to) {
      var data = replaceAndGetIndices(currentState, from, to);
      recordCommand({replace: from, with: to, indices: data.indices});
      currentState = data.result;
    },

    // if the undo is rolling back a write operation, just remove those characters
    // if the undo is rolling back a replace operation, call replace but check to see that
    // the replacements match the indices captured when it was originally applied
    // so it doesn't replace any strings it shouldn't
    // Pretty much runs in O(n)
    undo : function() {
      if (position === 0) return;
      var command = commands[--position];
      if (command.replace) {
        currentState = replaceString(currentState, command.indices, command.with, command.replace);
      } else {
        currentState = currentState.substring(0, currentState.length - command.write.length);
      }
    },

    // re-executes the next command without recording a new command
    // runs in O(nm) where n is currentState.length and m is the last command's with.length
    redo : function() {
      if (position === commands.length) return;
      var command = commands[position++];
      if (command.replace) {
        currentState = replaceAndGetIndices(currentState, command.replace, command.with).result;
      } else {
        currentState += command.write;
      }
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

  it("makes noops for undo / redo commands beyond their bounds", function () {
    var editor = makeEditor();
    editor.write("foo")

    editor.undo()
    expect(editor.toString()).to.eq("");

    editor.undo()
    expect(editor.toString()).to.eq("");

    editor.redo()
    expect(editor.toString()).to.eq("foo");

    editor.redo()
    expect(editor.toString()).to.eq("foo");
  })

  it("replaces correctly", function () {
    var editor = makeEditor();

    editor.write("more modern code")
    editor.replace("more", "mo")
    expect(editor.toString()).to.eq("mo modern code");

    editor.undo()
    expect(editor.toString()).to.eq("more modern code");

    editor.undo()
    expect(editor.toString()).to.eq("");

    editor.redo()
    expect(editor.toString()).to.eq("more modern code");

    editor.redo()
    expect(editor.toString()).to.eq("mo modern code");
  });

})
