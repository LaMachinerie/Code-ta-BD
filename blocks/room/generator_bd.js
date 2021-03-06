
'use strict';

goog.provide('Blockly.Javascript.room');

goog.require('Blockly.Javascript');


Blockly.JavaScript['room'] = function (block) {
  var dropdown_rooms = block.getFieldValue("ROOMS");
  var value_name = Blockly.JavaScript.valueToCode(block, "LIGHT", Blockly.JavaScript.ORDER_ATOMIC);
  if(value_name == undefined || value_name == ""){
    if(dropdown_rooms == "bathroom") value_name = "full_light";
    else value_name = "day";
  }
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  var code = 'room("' + dropdown_rooms + '", "' + value_name + '");\n';
  code += statements_code + '\n';
  return code;
};


Blockly.JavaScript['light'] = function (block) {
  var room = null;
  var surround = undefined;

  surround = block.getSurroundParent()
  if (surround != null) {
    if (surround.getFieldValue("ROOMS") != null) {
      room = surround.getFieldValue("ROOMS");
    }
  }


  var dropdown_light = block.getFieldValue('LIGHT');
  var dropdown_part = block.getFieldValue('PART');
  let code = "day";


  if(surround != undefined){
    if(room != "bathroom"){
        surround.light = dropdown_light;
        code = surround.light
      
    }
    else{
      let state = true;
      if(dropdown_light == "day") state = true;
      if(dropdown_light == "night") state = false;

      if (dropdown_part == "bathroom_light") SpriteManager.bathroomLight.bathroom = state;
      if (dropdown_part == "stairs_light") SpriteManager.bathroomLight.stairs = state;
      if (dropdown_part == "all"){ 
        SpriteManager.bathroomLight.stairs = state;
        SpriteManager.bathroomLight.bathroom = state;
      }

      if(SpriteManager.bathroomLight.bathroom && SpriteManager.bathroomLight.stairs)
        code = 'full_light';
      if(SpriteManager.bathroomLight.bathroom && !SpriteManager.bathroomLight.stairs)
        code = 'bathroom_light';
      if(!SpriteManager.bathroomLight.bathroom && SpriteManager.bathroomLight.stairs)
        code = 'stairs_light';
      if(!SpriteManager.bathroomLight.bathroom && !SpriteManager.bathroomLight.stairs)
        code = 'no_light';
    }
  }
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
