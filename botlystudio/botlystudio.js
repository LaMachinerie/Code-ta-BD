'use strict';
/** Create a namespace for the application. */
var BotlyStudio = BotlyStudio || {};
var SpriteManager = SpriteManager || {};

BotlyStudio.vignetteSpinbox = undefined;

BotlyStudio.leftMouse = false;


/** Initialize function for BotlyStudio, to be called on page load. */
BotlyStudio.init = function () {
  // Lang init must run first for the rest of the page to pick the right msgs
  BotlyStudio.changeToolbox();
  BotlyStudio.initLanguage();
  BotlyStudio.initDifficulty();
  BotlyStudio.vignetteSpinbox = new SpinBox("spinbox", {'minimum' : 1, 'maximum' : 6, 'step': 1});


  Renderer.init();
  BotlyStudio.initSlider();
  BotlyStudioIPC.initIPC();
  SpriteManager.importTreeJson(true); //override past ressource
  // Inject Blockly into content_blocks and fetch additional blocks
  BotlyStudio.injectBlockly(document.getElementById('content_blocks'),
    BotlyStudio.TOOLBOX_XML, 'blockly/');

  //BotlyStudio.importExtraBlocks();
  
  
  
  document.body.onmousedown = BotlyStudio.setLeftButtonState;
  document.body.onmousemove = BotlyStudio.setLeftButtonState;
  document.body.onmouseup = BotlyStudio.setLeftButtonState;

  BotlyStudio.designJsInit();
  BotlyStudio.showExtraIdeButtons();
  BotlyStudio.initialiseIdeButtons();

  BotlyStudio.bindDesignEventListeners();
  BotlyStudio.bindActionFunctions();
  BotlyStudio.bindBlocklyEventListeners();
};

BotlyStudio.setLeftButtonState = function(e) {
  BotlyStudio.leftMouse = e.buttons === undefined 
    ? e.which === 1 
    : e.buttons === 1;
}

BotlyStudio.autosave = function(){
  BotlyStudio.saveSessionStorageBlocks();
}


/** Binds functions to each of the buttons, nav links, and related. */
BotlyStudio.bindActionFunctions = function () {
  // Navigation buttons
  BotlyStudio.bindClick_('button_load', BotlyStudio.loadUserXmlFile);
  BotlyStudio.bindClick_('button_save', BotlyStudio.saveXmlFile);
  BotlyStudio.bindClick_('button_delete', BotlyStudio.discardAllBlocks);

  // Side menu buttons, they also close the side menu
  BotlyStudio.bindClick_('menu_load', function () {
    BotlyStudio.loadUserXmlFile();
    $('.button-collapse').sideNav('hide');
  });
  BotlyStudio.bindClick_('menu_save', function () {
    BotlyStudio.saveXmlFile();
    $('.button-collapse').sideNav('hide');
  });
  BotlyStudio.bindClick_('menu_delete', function () {
    BotlyStudio.discardAllBlocks();
    $('.button-collapse').sideNav('hide');
  });
  BotlyStudio.bindClick_('menu_settings', function () {
    BotlyStudio.openSettings();
    $('.button-collapse').sideNav('hide');
  });
  BotlyStudio.bindClick_('menu_sprite', function () {
    BotlyStudio.addSpriteDialog();
    $('.button-collapse').sideNav('hide');
  });
  // Floating buttons
  BotlyStudio.bindClick_('button_ide_large', function () {
    BotlyStudio.ideButtonLargeAction();
  });
  BotlyStudio.bindClick_('button_ide_middle', function () {
    BotlyStudio.ideButtonMiddleAction();
  });
  BotlyStudio.bindClick_('button_ide_left', function () {
    BotlyStudio.ideButtonLeftAction();
  });
  BotlyStudio.bindClick_('button_ide_last', function () {
    BotlyStudio.ideButtonLastAction();
  });

  BotlyStudio.bindClick_('button_toggle_toolbox', BotlyStudio.toogleToolbox);

};

BotlyStudio.ideButtonLargeAction = function () {
  Renderer.execute();
};

BotlyStudio.ideButtonMiddleAction = function () {
  Renderer.reset();
};

BotlyStudio.ideButtonLeftAction = function () {
  BotlyStudio.saveCanvas();
};

BotlyStudio.ideButtonLastAction = function () {
  BotlyStudio.devTools();
};


BotlyStudio.saveCanvas = function(){
  
  var path = "botlystudio/sprites/copyright.png";

  var cpyright = new Image();
  cpyright.src = path;
  var ctx = document.getElementById("display").getContext("2d");

  // Make sure the image is loaded first otherwise nothing will draw.
  cpyright.onload = function(){
      ctx.drawImage(cpyright,0,1300,600, 100);  

      var canvas = document.getElementById("display");
      var img    = canvas.toDataURL("image/png");
      var filename = document.getElementById("sketch_name").value + "_vignette_" + BotlyStudio.vignetteSpinbox.getValue();

      var pom = document.createElement('a');
      pom.setAttribute('href', img);
      pom.setAttribute('download', filename);

      if (document.createEvent) {
          var event = document.createEvent('MouseEvents');
          event.initEvent('click', true, true);
          pom.dispatchEvent(event);
      }
      else {
          pom.click();
      }
  }


}

/** Initialises the IDE buttons with the default option from the server. */
BotlyStudio.initialiseIdeButtons = function () {
  document.getElementById('button_ide_left').title =
    BotlyStudio.getLocalStr('openSketch');
  document.getElementById('button_ide_middle').title =
    BotlyStudio.getLocalStr('verifySketch');
  document.getElementById('button_ide_large').title =
    BotlyStudio.getLocalStr('uploadSketch');
};

/**
 * Changes the IDE launch buttons based on the option indicated in the argument.
 * @param {!string} value One of the 3 possible values from the drop down select
 *     in the settings modal: 'upload', 'verify', or 'open'.
 */
BotlyStudio.changeIdeButtons = function (value) {
  var largeButton = document.getElementById('button_ide_large');
  var middleButton = document.getElementById('button_ide_middle');
  var leftButton = document.getElementById('button_ide_left');
  var openTitle = BotlyStudio.getLocalStr('openSketch');
  var verifyTitle = BotlyStudio.getLocalStr('verifySketch');
  var uploadTitle = BotlyStudio.getLocalStr('uploadSketch');
  if (value === 'upload') {
    BotlyStudio.changeIdeButtonsDesign(value);
    BotlyStudio.ideButtonLeftAction = BotlyStudio.ideSendOpen;
    BotlyStudio.ideButtonMiddleAction = BotlyStudio.ideSendVerify;
    BotlyStudio.ideButtonLargeAction = BotlyStudio.ideSendUpload;
    leftButton.title = openTitle;
    middleButton.title = verifyTitle;
    largeButton.title = uploadTitle;
  } else if (value === 'verify') {
    BotlyStudio.changeIdeButtonsDesign(value);
    BotlyStudio.ideButtonLeftAction = BotlyStudio.ideSendOpen;
    BotlyStudio.ideButtonMiddleAction = BotlyStudio.ideSendUpload;
    BotlyStudio.ideButtonLargeAction = BotlyStudio.ideSendVerify;
    leftButton.title = openTitle;
    middleButton.title = uploadTitle;
    largeButton.title = verifyTitle;
  } else if (value === 'open') {
    BotlyStudio.changeIdeButtonsDesign(value);
    BotlyStudio.ideButtonLeftAction = BotlyStudio.ideSendVerify;
    BotlyStudio.ideButtonMiddleAction = BotlyStudio.ideSendUpload;
    BotlyStudio.ideButtonLargeAction = BotlyStudio.ideSendOpen;
    leftButton.title = verifyTitle;
    middleButton.title = uploadTitle;
    largeButton.title = openTitle;
  }
};

/**
 * Loads an XML file from the server and replaces the current blocks into the
 * Blockly workspace.
 * @param {!string} xmlFile Server location of the XML file to load.
 */
BotlyStudio.loadServerXmlFile = function (xmlFile) {
  var loadXmlfileAccepted = function () {
    // loadXmlBlockFile loads the file asynchronously and needs a callback
    var loadXmlCb = function (sucess) {
      if (sucess) {
        BotlyStudio.renderContent();
      } else {
        BotlyStudio.alertMessage(
          BotlyStudio.getLocalStr('invalidXmlTitle'),
          BotlyStudio.getLocalStr('invalidXmlBody'),
          false);
      }
    };
    var connectionErrorCb = function () {
    };
    BotlyStudio.loadXmlBlockFile(xmlFile, loadXmlCb, connectionErrorCb);
  };

  if (BotlyStudio.isWorkspaceEmpty()) {
    loadXmlfileAccepted();
  } else {
    BotlyStudio.alertMessage(
      BotlyStudio.getLocalStr('loadNewBlocksTitle'),
      BotlyStudio.getLocalStr('loadNewBlocksBody'),
      true, loadXmlfileAccepted);
  }
};

/**
 * Loads an XML file from the users file system and adds the blocks into the
 * Blockly workspace.
 */
BotlyStudio.loadUserXmlFile = function () {
  // Create File Reader event listener function
  var parseInputXMLfile = function (e) {
    var xmlFile = e.target.files[0];
    var filename = xmlFile.name;
    var extensionPosition = filename.lastIndexOf('.');
    if (extensionPosition !== -1) {
      filename = filename.substr(0, extensionPosition);
    }

    var reader = new FileReader();
    reader.onload = function () {
      Blockly.Events.disable();
      var success = BotlyStudio.replaceBlocksfromXml(reader.result);
      if (success) {
        BotlyStudio.renderContent();
        BotlyStudio.sketchNameSet(filename);
        BotlyStudio.refreshDynamicDropdown();
      } else {
        BotlyStudio.alertMessage(
          BotlyStudio.getLocalStr('invalidXmlTitle'),
          BotlyStudio.getLocalStr('invalidXmlBody'),
          false);
      }
      Blockly.Events.enable();
    };
    reader.readAsText(xmlFile);
  };

  // Create once invisible browse button with event listener, and click it
  var selectFile = document.getElementById('select_file');
  if (selectFile === null) {
    var selectFileDom = document.createElement('INPUT');
    selectFileDom.type = 'file';
    selectFileDom.id = 'select_file';

    var selectFileWrapperDom = document.createElement('DIV');
    selectFileWrapperDom.id = 'select_file_wrapper';
    selectFileWrapperDom.style.display = 'none';
    selectFileWrapperDom.appendChild(selectFileDom);

    document.body.appendChild(selectFileWrapperDom);  
    selectFile = document.getElementById('select_file');
    selectFile.addEventListener('change', parseInputXMLfile, false);
  }
  selectFile.click();
};


BotlyStudio.refreshDynamicDropdown = function(){
  var Blocks = BotlyStudio.workspace.getAllBlocks();
  for(var block in Blocks){
    if(Blocks[block].isDynamic == true){
      var b = Blocks[block];
      var roomDropValue = b.getFieldValue("ROOMS");
      if(roomDropValue != undefined){
        let field = b.getField("ROOMS")
        let possibilitieTree = SpriteManager.getRoomSubTree();
        let possibilities = SpriteManager.getDisplayNameArray(SpriteManager.getRoomSubTree(), [["une pièce","default"]]);
        field.menuGenerator_ = possibilities;
        field.setText(possibilitieTree[roomDropValue].displayName);
        field.setValue(roomDropValue);
      }
      
      var characterDropValue = b.getFieldValue("CHAR");
      var actionsDropValue = b.getFieldValue("ACTIONS");
      if(characterDropValue != undefined && actionsDropValue != undefined){
        let field = b.getField("CHAR")
        let parentRoom = b.getSurroundParent().getFieldValue("ROOMS");
        let possibilitieTree = SpriteManager.getCharacterSubTree(parentRoom);
        let possibilities = SpriteManager.getDisplayNameArray(SpriteManager.getCharacterSubTree(parentRoom), [["Quelqu'un","default"]]);
        field.menuGenerator_ = possibilities;
        field.setText(possibilitieTree[characterDropValue].displayName);
        field.setValue(characterDropValue);

        let actfield = b.getField("ACTIONS")
        possibilitieTree = SpriteManager.getActionsSubTree(parentRoom, characterDropValue);
        possibilities = SpriteManager.getDisplayNameArray(SpriteManager.getActionsSubTree(parentRoom, characterDropValue), [["fait quelque chose","default"]]);
        actfield.menuGenerator_ = possibilities;
        actfield.setText(possibilitieTree[actionsDropValue].displayName);
        actfield.setValue(actionsDropValue);
      }

      var lightDropValue = b.getFieldValue("PART");
      if(lightDropValue != undefined){
        let partfield = b.getField("PART")
        let parentRoom = b.getSurroundParent().getFieldValue("ROOMS");
        let possibilities = undefined;
        if(parentRoom == "bathroom") {
          let displayName;
          let array = [["toutes les pièces", "all"],["la salle de bain", "bathroom_light"],["l'escalier", "stairs_light"]];
          for(let i in array){
            if(array[i][1] == lightDropValue){
              displayName = array[i][0];
            }
          }
          possibilities = array;
          partfield.menuGenerator_ = possibilities;
          partfield.setText(displayName);
          partfield.setValue(lightDropValue);
        }
        else{
          possibilities = [["la pièce","current"]];
          partfield.menuGenerator_ = possibilities;
          partfield.setText("la pièce");
          partfield.setValue("current");
        }
      }
      
      var objDropValue = b.getFieldValue("OBJ");
      if(objDropValue != undefined){
        let objfield = b.getField("OBJ")
        let parentRoom = b.getSurroundParent().getFieldValue("ROOMS");
        let possibilitieTree = SpriteManager.getObjectSubTree(parentRoom);
        let possibilities = undefined;
        if(parentRoom != "bathroom") {
          possibilities = SpriteManager.getDisplayNameArray(SpriteManager.getObjectSubTree(parentRoom), [["un objet","default"]]);
          objfield.menuGenerator_ = possibilities;
          objfield.setText(possibilitieTree[objDropValue].displayName);
          objfield.setValue(objDropValue);
        }
        else{
          possibilities = [["un objet","default"]];
          objfield.menuGenerator_ = possibilities;
          objfield.setText("un objet");
          objfield.setValue("default");
        }
      }
    }
  }
}








/**
 * Creates an XML file containing the blocks from the Blockly workspace and
 * prompts the users to save it into their local file system.
 */
BotlyStudio.saveXmlFile = function () {
  BotlyStudio.saveTextFileAs(
    document.getElementById('sketch_name').value + '.xml',
    BotlyStudio.generateXml());
};


/**
 * Creates an text file with the input content and files name, and prompts the
 * users to save it into their local file system.
 * @param {!string} fileName Name for the file to be saved.
 * @param {!string} content Text datd to be saved in to the file.
 */
BotlyStudio.saveTextFileAs = function (fileName, content) {
  var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, fileName);
};

BotlyStudio.openSettings = function () {
  // Language menu only set on page load within BotlyStudio.initLanguage()
  BotlyStudio.openSettingsModal();
};


/** Populate the workspace blocks with the XML written in the XML text area. */
BotlyStudio.XmlTextareaToBlocks = function () {
  var success = BotlyStudio.replaceBlocksfromXml(
    document.getElementById('content_xml').value);
  if (success) {
    BotlyStudio.renderContent();
  } else {
    BotlyStudio.alertMessage(
      BotlyStudio.getLocalStr('invalidXmlTitle'),
      BotlyStudio.getLocalStr('invalidXmlBody'),
      false);
  }
};


/**
 * Populate the Arduino Code and Blocks XML panels with content generated from
 * the blocks.
 */
BotlyStudio.renderContent = function () {
  // Only regenerate the code if a block is not being dragged
  if (BotlyStudio.blocklyIsDragging()) return;

  // Render Arduino Code with latest change highlight and syntax highlighting

  var outputCode = "";
  if (BotlyStudio.OUTPUT_LANGUAGE == 1) {
    outputCode = BotlyStudio.generateArduino();
  } else if (BotlyStudio.OUTPUT_LANGUAGE == 2) {
    outputCode = BotlyStudio.generatePython();
  } else if (BotlyStudio.OUTPUT_LANGUAGE == 3) {
    outputCode = BotlyStudio.generateJavaScript();
  }


  if (outputCode !== BotlyStudio.PREV_OUTPUT_CODE_) {
    var diff = JsDiff.diffWords(BotlyStudio.PREV_OUTPUT_CODE_, outputCode);
    var resultStringArray = [];
    for (var i = 0; i < diff.length; i++) {
      if (!diff[i].removed) {
        var escapedCode = diff[i].value.replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        if (diff[i].added) {
          resultStringArray.push(
            '<span class="code_highlight_new">' + escapedCode + '</span>');
        } else {
          resultStringArray.push(escapedCode);
        }
      }
    }
    BotlyStudio.PREV_OUTPUT_CODE_ = outputCode;

    if (BotlyStudio.OUTPUT_LANGUAGE == 1) {
      document.getElementById('content_code').innerHTML =
        prettyPrintOne(resultStringArray.join(''), 'cpp', false);
    } else if (BotlyStudio.OUTPUT_LANGUAGE == 2) {
      document.getElementById('content_code').innerHTML =
        prettyPrintOne(resultStringArray.join(''), 'py', false);
    } else if (BotlyStudio.OUTPUT_LANGUAGE == 3) {
      document.getElementById('content_code').innerHTML =
        prettyPrintOne(resultStringArray.join(''), 'js', false);
    }

  }

  // Generate plain XML into element
  document.getElementById('content_xml').value = BotlyStudio.generateXml();
};



BotlyStudio.devTools = function () {
  $('#code_dialog').openModal({
    dismissible: true,
    opacity: .5,
    in_duration: 200,
    out_duration: 250
  });
};


BotlyStudio.addSpriteDialog = function () {
  $('#sprite_dialog').openModal({
    dismissible: true,
    opacity: .5,
    in_duration: 200,
    out_duration: 250
  });
};



/**
 * Private variable to indicate if the toolbox is meant to be shown.
 * @type {!boolean}
 * @private
 */
BotlyStudio.TOOLBAR_SHOWING_ = true;

/**
 * Toggles the blockly toolbox and the BotlyStudio toolbox button On and Off.
 * Uses namespace member variable TOOLBAR_SHOWING_ to toggle state.
 */
BotlyStudio.toogleToolbox = function () {
  if (BotlyStudio.TOOLBAR_SHOWING_) {
    BotlyStudio.blocklyCloseToolbox();
    BotlyStudio.displayToolbox(false);
  } else {
    BotlyStudio.displayToolbox(true);
  }
  BotlyStudio.TOOLBAR_SHOWING_ = !BotlyStudio.TOOLBAR_SHOWING_;
};

/** @return {boolean} Indicates if the toolbox is currently visible. */
BotlyStudio.isToolboxVisible = function () {
  return BotlyStudio.TOOLBAR_SHOWING_;
};

/**
 * Lazy loads the additional block JS files from the ./block directory.
 * Initialises any additional BotlyStudio extensions.
 * TODO: Loads the examples into the examples modal
 */
BotlyStudio.importExtraBlocks = function () {

  var jsonDataObj = BotlyStudio.BlocJSON;

  if (jsonDataObj.categories !== undefined) {
    var head = document.getElementsByTagName('head')[0];
    for (var catDir in jsonDataObj.categories) {
      var blocksJsLoad = document.createElement('script');
      blocksJsLoad.src = 'blocks/' + catDir + '/blocks.js';
      head.appendChild(blocksJsLoad);

      var blocksLangJsLoad = document.createElement('script');
      blocksLangJsLoad.src = 'blocks/' + catDir + '/msg/' + 'messages.js';
      //'lang/' + BotlyStudio.LANG + '.js';
      head.appendChild(blocksLangJsLoad);

      var blocksGeneratorJsLoad = document.createElement('script');
      blocksGeneratorJsLoad.src = 'blocks/' + catDir +
        '/generator_bd.js';
      head.appendChild(blocksGeneratorJsLoad);

      var cat = jsonDataObj.categories[catDir];
      var catDom = (new DOMParser()).parseFromString(
        cat.toolbox.join(''), 'text/xml').firstChild;

      BotlyStudio.addToolboxCategory(cat.toolboxName, catDom);
      BotlyStudio.resizeToggleToolboxBotton();

      // Check if the blocks add additional BotlyStudio functionality
      var extensions = jsonDataObj.categories[catDir].extensions;
      if (extensions) {
        for (var i = 0; i < extensions.length; i++) {
          var blockExtensionJsLoad = document.createElement('script');
          blockExtensionJsLoad.src = 'blocks/' + catDir + '/extensions.js';
          head.appendChild(blockExtensionJsLoad);
          // Add function to scheduler as lazy loading has to complete first
          setTimeout(function (category, extension) {
            var extensionNamespaces = extension.split('.');
            var extensionCall = window;
            var invalidFunc = false;
            for (var j = 0; j < extensionNamespaces.length; j++) {
              extensionCall = extensionCall[extensionNamespaces[j]];
              if (extensionCall === undefined) {
                invalidFunc = true;
                break;
              }
            }
            if (typeof extensionCall != 'function') {
              invalidFunc = true;
            }
            if (invalidFunc) {
              throw 'Blocks ' + category.categoryName + ' extension "' +
              extension + '" is not a valid function.';
            } else {
              extensionCall();
            }
          }, 800, jsonDataObj.categories[catDir], extensions[i]);
        }
      }
    }
  }
};

/** Opens a modal with a list of categories to add or remove to the toolbox */
BotlyStudio.openExtraCategoriesSelect = function () {
  var jsonDataObj = BotlyStudio.BlocJSON
  var htmlContent = document.createElement('div');
  if (jsonDataObj.categories !== undefined) {
    for (var catDir in jsonDataObj.categories) {
      // Function required to maintain each loop variable scope separated
      (function (cat) {
        var clickBind = function (tickValue) {
          if (tickValue) {
            var catDom = (new DOMParser()).parseFromString(
              cat.toolbox.join(''), 'text/xml').firstChild;
            BotlyStudio.addToolboxCategory(cat.toolboxName, catDom);
          } else {
            BotlyStudio.removeToolboxCategory(cat.toolboxName);
          }
        };
        htmlContent.appendChild(BotlyStudio.createExtraBlocksCatHtml(
          cat.categoryName, cat.description, clickBind));
      })(jsonDataObj.categories[catDir]);
    }
  }
};

/** Informs the user that the selected function is not yet implemented. */
BotlyStudio.functionNotImplemented = function () {
  BotlyStudio.shortMessage('Function not yet implemented');
};

/**
 * Interface to display messages with a possible action.
 * @param {!string} title HTML to include in title.
 * @param {!element} body HTML to include in body.
 * @param {boolean=} confirm Indicates if the user is shown a single option (ok)
 *     or an option to cancel, with an action applied to the "ok".
 * @param {string=|function=} callback If confirm option is selected this would
 *     be the function called when clicked 'OK'.
 */
BotlyStudio.alertMessage = function (title, body, confirm, callback) {
  BotlyStudio.materialAlert(title, body, confirm, callback);
};

/**
 * Interface to displays a short message, which disappears after a time out.
 * @param {!string} message Text to be temporarily displayed.
 */
BotlyStudio.shortMessage = function (message) {
  BotlyStudio.MaterialToast(message);
};

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!function} func Event handler to bind.
 * @private
 */
BotlyStudio.bindClick_ = function (el, func) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  // Need to ensure both, touch and click, events don't fire for the same thing
  var propagateOnce = function (e) {
    e.stopPropagation();
    e.preventDefault();
    func();
  };
  el.addEventListener('ontouchend', propagateOnce);
  el.addEventListener('click', propagateOnce);
};
