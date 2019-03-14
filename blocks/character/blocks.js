'use strict';
var SpriteManager = SpriteManager || {};
var BotlyStudio = BotlyStudio || {};

goog.provide('Blockly.Blocks.character');

goog.require('Blockly.Blocks');

Blockly.Blocks.character.HUE = 180;

Blockly.Blocks['character'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Afficher")
        .appendField(new Blockly.FieldDropdown([["Quelqu'un", "default"]]), "CHAR")
        .appendField("qui")
        .appendField(new Blockly.FieldDropdown([["fait quelque chose", "default"]]), "ACTIONS");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  onchange: function(event) {
    var surround = this.getSurroundParent()
    if(surround != undefined && surround.type != "room") 
      surround = undefined;

    //var selectedBlock = undefined;
    //if(Blockly.selected != undefined)
    //  selectedBlock = Blockly.selected;

    if(surround != undefined){
      var currentRoom = surround.getFieldValue("ROOMS");
      if(currentRoom != this.lastRoom){
        this.lastRoom = currentRoom;
        setRoom(currentRoom, this);
        this.lastCharacter = this.getFieldValue("CHAR");
        this.lastAction = this.getFieldValue("ACTIONS");
      }else{
        this.setDropdown(lastRoom, lastCharacter, lastAction);
      }
    }else{
      if(this.lastRoom != "default")
      resetBlock(this);
    }

  },
  isDynamic: true,
  lastRoom: "default",
  lastCharacter: "default",
  lastAction: "default"
};



function setRoom(room, block){
  var CharacterDropdown = block.getField("CHAR")
  CharacterDropdown.menuGenerator_ = SpriteManager.getDisplayNameArray(SpriteManager.getCharacterSubTree(room),[["Quelqu'un", "default"]]);
  CharacterDropdown.setText(CharacterDropdown.menuGenerator_[0][0]);
  CharacterDropdown.setValue(CharacterDropdown.menuGenerator_[0][1]);

  var char = block.getFieldValue("CHAR");
  var actionsDropdown = block.getField('ACTIONS');
  actionsDropdown.menuGenerator_ = SpriteManager.getDisplayNameArray(SpriteManager.getActionsSubTree(room, char), [["fait quelque chose", "default"]]);
  actionsDropdown.setText(actionsDropdown.menuGenerator_[0][0]);
  actionsDropdown.setValue(actionsDropdown.menuGenerator_[0][1]);
}

function setDropdown(room, char, action, block){
  setRoom(room, block);
  let characterDropdown = block.getField("CHAR");
  let actionsDropdown = block.getField('ACTIONS');
  characterDropdown.setValue(char);
  actionsDropdown.setValue(action);
  characterDropdown.setText(getDisplayName(characterDropdown.menuGenerator_, char));
  actionsDropdown.setText(getDisplayName(actionsDropdown.menuGenerator_, action));
}

function resetBlock(block){
  var CharacterDropdown = block.getField("CHAR")
  CharacterDropdown.menuGenerator_ = [["Quelqu'un", "default"]];
  CharacterDropdown.setText(CharacterDropdown.menuGenerator_[0][0]);
  CharacterDropdown.setValue(CharacterDropdown.menuGenerator_[0][1]);

  var actionsDropdown = block.getField('ACTIONS');
  actionsDropdown.menuGenerator_ = [["fait quelque chose", "default"]];
  actionsDropdown.setText(actionsDropdown.menuGenerator_[0][0]);
  actionsDropdown.setValue(actionsDropdown.menuGenerator_[0][1]);
}

function getDisplayName(array, key){
  for(let i in array){
    if(array[i][1] == key){
      return array[i][0];
    }
  }
  return array[0][1];
}