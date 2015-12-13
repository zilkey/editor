// update currentState on write / replace without replaying commands
// rebuild from the ground up on undo
// only reapply the next command on redo

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

  function rebuild() {
    currentState = "";
    for (var i = 0; i < position; i++) {
      if (commands[i].replace) {
        currentState = currentState.replace(new RegExp(commands[i].replace, 'g'), commands[i].with)
      } else {
        currentState += commands[i].write;
      }
    }
  }

  return {
    toString : function() {
      return currentState;
    },

    // clearsRedos, records the command and appends to the end of the cached string
    write : function(letters) {
      recordCommand({write: letters});
      currentState += letters;
    },

    // clears the redos, records the command and executes the replace
    replace : function(from, to) {
      recordCommand({replace: from, with: to});
      currentState = currentState.replace(new RegExp(from, 'g'), to);
    },

    // for undoing a write, it hacks off the previously written string
    // for undoing replaces, it replays all commands from the beginning
    undo : function() {
      if (position === 0) return;
      position--;
      var command = commands[position];
      if (command.replace) {
        rebuild();
      } else {
        currentState = currentState.substring(0, currentState.length - command.write.length);
      }
    },

    // determine which method to call based on the next command
    redo : function() {
      if (position === commands.length) return;
      var command = commands[position++];
      if (command.replace) {
        currentState = currentState.replace(new RegExp(command.replace, 'g'), command.with);
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
