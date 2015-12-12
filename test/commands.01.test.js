function makeEditor() {
  var commands = [];
  var position = 0;
  var current = '';

  function cache(){
    current = "";
    for (var i = 0; i < position; i++) {
      if (commands[i].replace) {
        current = current.replace(new RegExp(commands[i].replace, 'g'), commands[i].with)
      } else {
        current += commands[i].write;
      }
    }
  }

  function command(object){
    var diff = commands.length - Math.max(position, 0);
    for (var i = 0; i < diff; i++) commands.pop();
    commands.push(object);
    position++;
    cache();
  }

  return {
    toString : function() {
      return current;
    },

    write : function(letters) {
      command({write: letters});
    },

    replace : function(from, to) {
      command({replace: from, with: to});
    },

    undo : function() {
      position--;
      cache();
    },

    redo : function() {
      position++;
      cache();
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
