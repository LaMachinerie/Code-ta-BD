'use strict';


/** Create a name space for the application. */
var BotlyStudioIPC = {};


BotlyStudioIPC.pendingRequest = 0;

BotlyStudioIPC.initIPC = function () {

}


BotlyStudioIPC.processResponse = function (json_str) {
  BotlyStudioIPC.pendingRequest--;
  var json = JSON.parse(json_str);
  if (json != null) {
    SpriteManager.Tree = json;
    BotlyStudio.refreshDynamicDropdown();
  }
};



BotlyStudioIPC.getJsonTree = function () {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'botlystudio/sprites/tree.json', true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      BotlyStudioIPC.processResponse(xobj.responseText);
    }
  };
  xobj.send(null);
  BotlyStudioIPC.pendingRequest++;
};


BotlyStudioIPC.createElementFromJson = function (json_data) {
  var parsed_json = JSON.parse(json_data);
  var element = null;

  if (parsed_json.element == 'text_input') {
    // Simple text input
    element = document.createElement('input');
    element.setAttribute('type', 'text');
    element.setAttribute('value', parsed_json.display_text);
  } else if (parsed_json.element == 'dropdown') {
    // Drop down list of unknown length with a selected item
    element = document.createElement('select');
    element.name = parsed_json.response_type;
    for (var i = 0; i < parsed_json.options.length; i++) {
      var option = document.createElement('option');
      option.value = parsed_json.options[i].value;
      option.text = parsed_json.options[i].display_text;
      // Check selected option and mark it
      if (parsed_json.options[i].value == parsed_json.selected) {
        option.selected = true;
      }
      element.appendChild(option);
    }
  } else if (parsed_json.element == 'div_ide_output') {
    // Formatted text for the Arduino IDE CLI output
    var el_title = document.createElement('h4');
    el_title.innerHTML = BotlyStudio.getLocalStr(parsed_json.conclusion);
    if (parsed_json.success == true) {
      el_title.className = 'arduino_dialog_success';
    } else {
      el_title.className = 'arduino_dialog_failure';
    }

    var el_out = document.createElement('span');
    el_out.className = 'arduino_dialog_out';
    // If larger than 50 characters then don't bother looking for language key
    if (parsed_json.output.length < 50) {
      el_out.innerHTML = BotlyStudio.getLocalStr(parsed_json.output) ||
        parsed_json.output.split('\n').join('<br />');
    } else {
      el_out.innerHTML = parsed_json.output.split('\n').join('<br />');
    }

    element = document.createElement('div');
    element.appendChild(el_title);
    element.appendChild(el_out);

    // Only ouput error message if it was not successful
    if (parsed_json.success == false) {
      var el_err = document.createElement('span');
      el_err.className = 'arduino_dialog_out_error';
      // If larger than 50 characters then don't bother looking for language key
      if (parsed_json.output.length < 50) {
        el_err.innerHTML = BotlyStudio.getLocalStr(parsed_json.error_output) ||
          parsed_json.error_output.split('\n').join('<br />');
      } else {
        el_err.innerHTML = parsed_json.error_output.split('\n').join('<br />');
      }
      element.appendChild(el_err);
    }
  } else {
    //TODO: Not recognised, alert the user/developer somehow
  }

  return element;
};

