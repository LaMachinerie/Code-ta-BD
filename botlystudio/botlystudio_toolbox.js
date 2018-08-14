'use strict';

/** Create a namespace for the application. */
var BotlyStudio = BotlyStudio || {};
BotlyStudio.TOOLBOX_XML = null;


BotlyStudio.BlocJSON = {
	"categories": {
	  "room": {
		"categoryName": "scene",
		"description": "Affiche la pièce selectionnée",
		"languages": ["fr", "en"],
		"toolboxName": "Scène",
		"toolbox": [
		  "  <category>",
		  "    <block type=\"room\"></block>",
		  "  </category>",
		]
	  },
	  "character": {
		"categoryName": "character",
		"description": "Affiche les personnages selectionnée",
		"languages": ["fr", "en"],
		"toolboxName": "Personnages",
		"toolbox": [
		  "  <category>",
		  "    <block type=\"character\"></block>",
		  "  </category>",
		]
	  },
	  "object": {
		"categoryName": "object",
		"description": "Affiche les objets selectionnée",
		"languages": ["fr", "en"],
		"toolboxName": "Objets",
		"toolbox": [
		  "  <category>",
		  "    <block type=\"object\"></block>",
		  "  </category>",
		]
	  },
	}
  }


BotlyStudio.changeToolbox = function(){
	if(BotlyStudio.DIFFICULTY == 1){
		BotlyStudio.TOOLBOX_XML =
		'<xml>' +
		'  <category id="catLoops" name="Loops">' +
		'    <block type="controls_repeat_ext">' +
		'      <value name="TIMES">' +
		'        <block type="math_number">' +
		'          <field name="NUM">5</field>' +
		'        </block>' +
		'      </value>' +
		'    </block>' +
		'  </category>' +
		'  <sep></sep>' +
		'  <category id="catMath" name="Math">' +
		'    <block type="math_number"></block>' +
		'  </category>' +
		'  <sep></sep>' +
		'  <category id="catTime" name="Time">' +
		'    <block type="infinite_loop"></block>' +
		'  </category>' +
		'</xml>';


		
	}
	if(BotlyStudio.DIFFICULTY == 2){
		BotlyStudio.TOOLBOX_XML =
		'<xml>' +
		'  <category id="catLoops" name="Loops">' +
		'    <block type="controls_repeat_ext">' +
		'      <value name="TIMES">' +
		'        <block type="math_number">' +
		'          <field name="NUM">5</field>' +
		'        </block>' +
		'      </value>' +
		'    </block>' +
		'    <block type="controls_for">' +
		'      <value name="FROM">' +
		'        <block type="math_number">' +
		'          <field name="NUM">1</field>' +
		'        </block>' +
		'      </value>' +
		'      <value name="TO">' +
		'        <block type="math_number">' +
		'          <field name="NUM">10</field>' +
		'        </block>' +
		'      </value>' +
		'      <value name="BY">' +
		'        <block type="math_number">' +
		'          <field name="NUM">1</field>' +
		'        </block>' +
		'      </value>' +
		'    </block>' +
		'  </category>' +
		'  <sep></sep>' +
		'  <category id="catMath" name="Math">' +
		'    <block type="math_number"></block>' +
		'    <block type="math_random_int">' +
		'      <value name="FROM">' +
		'        <block type="math_number">' +
		'          <field name="NUM">1</field>' +
		'        </block>' +
		'      </value>' +
		'      <value name="TO">' +
		'        <block type="math_number">' +
		'          <field name="NUM">100</field>' +
		'        </block>' +
		'      </value>' +
		'    </block>' +
		'  </category>' +
		'  <sep></sep>' +
		'  <category id="catVariables" name="Variables">' +
		'    <block type="variables_get"></block>' +
		'    <block type="variables_set"></block>' +
		'  </category>' +
		'  <sep></sep>' +
		'  <category id="catFunctions" name="Functions" custom="PROCEDURE"></category>' +
		'  <sep></sep>' +
		'  <category id="catTime" name="Time">' +
		'    <block type="infinite_loop"></block>' +
		'</xml>';
	}
	if(BotlyStudio.DIFFICULTY == 3){
		BotlyStudio.TOOLBOX_XML =
		'<xml>' +
		'  <category id="catLogic" name="Logic">' +
		'    <block type="controls_if"></block>' +
		'    <block type="logic_compare"></block>' +
		'    <block type="logic_operation"></block>' +
		'    <block type="logic_negate"></block>' +
		'    <block type="logic_boolean"></block>' +
		'    <block type="logic_null"></block>' +
		'    <block type="logic_ternary"></block>' +
		'  </category>' +
		'  <sep></sep>' +
		'  <category id="catLoops" name="Loops">' +
		'    <block type="controls_repeat_ext">' +
		'      <value name="TIMES">' +
		'        <block type="math_number">' +
		'          <field name="NUM">5</field>' +
		'        </block>' +
		'      </value>' +
		'    </block>' +
		'    <block type="controls_whileUntil"></block>' +
		'    <block type="controls_for">' +
		'      <value name="FROM">' +
		'        <block type="math_number">' +
		'          <field name="NUM">1</field>' +
		'        </block>' +
		'      </value>' +
		'      <value name="TO">' +
		'        <block type="math_number">' +
		'          <field name="NUM">10</field>' +
		'        </block>' +
		'      </value>' +
		'      <value name="BY">' +
		'        <block type="math_number">' +
		'          <field name="NUM">1</field>' +
		'        </block>' +
		'      </value>' +
		'    </block>' +
		'    <block type="controls_flow_statements"></block>' +
		'  </category>' +
		'  <sep></sep>' +
		'  <category id="catMath" name="Math">' +
		'    <block type="math_number"></block>' +
		'    <block type="math_arithmetic"></block>' +
		'    <block type="math_single"></block>' +
		'    <block type="math_trig"></block>' +
		'    <block type="math_constant"></block>' +
		'    <block type="math_number_property"></block>' +
		'    <block type="math_change">' +
		'      <value name="DELTA">' +
		'        <block type="math_number">' +
		'          <field name="NUM">1</field>' +
		'        </block>' +
		'      </value>' +
		'    </block>' +
		'    <block type="math_round"></block>' +
		'    <block type="math_modulo"></block>' +
		'    <block type="math_constrain">' +
		'      <value name="LOW">' +
		'        <block type="math_number">' +
		'          <field name="NUM">1</field>' +
		'        </block>' +
		'      </value>' +
		'      <value name="HIGH">' +
		'        <block type="math_number">' +
		'          <field name="NUM">100</field>' +
		'        </block>' +
		'      </value>' +
		'    </block>' +
		'    <block type="math_random_int">' +
		'      <value name="FROM">' +
		'        <block type="math_number">' +
		'          <field name="NUM">1</field>' +
		'        </block>' +
		'      </value>' +
		'      <value name="TO">' +
		'        <block type="math_number">' +
		'          <field name="NUM">100</field>' +
		'        </block>' +
		'      </value>' +
		'    </block>' +
		'    <block type="math_random_float"></block>' +
		'    <block type="base_map"></block>' +
		'  </category>' +
		'  <sep></sep>' +
		'  <category id="catVariables" name="Variables">' +
		'    <block type="variables_get"></block>' +
		'    <block type="variables_set"></block>' +
		'    <block type="variables_set">' +
		'      <value name="VALUE">' +
		'        <block type="variables_set_type"></block>' +
		'      </value>' +
		'    </block>' +
		'    <block type="variables_set_type"></block>' +
		'  </category>' +
		'  <sep></sep>' +
		'  <category id="catFunctions" name="Functions" custom="PROCEDURE"></category>' +
		'  <sep></sep>' +
		'  <category id="catTime" name="Time">' +
		'    <block type="time_delay">' +
		'      <value name="DELAY_TIME_MILI">' +
		'        <block type="math_number">' +
		'          <field name="NUM">1000</field>' +
		'        </block>' +
		'      </value>' +
		'    </block>' +
		'    <block type="time_delaymicros">' +
		'      <value name="DELAY_TIME_MICRO">' +
		'        <block type="math_number">' +
		'          <field name="NUM">100</field>' +
		'        </block>' +
		'      </value>' +
		'    </block>' +
		'    <block type="time_millis"></block>' +
		'    <block type="time_micros"></block>' +
		'    <block type="infinite_loop"></block>' +
		'  </category>' +
		'</xml>';
	}
	if(BotlyStudio.DIFFICULTY == 4){
		BotlyStudio.TOOLBOX_XML =
		'<xml>' +
		'  <category id="catLogic" name="Logic">' +
		'    <block type="controls_if"></block>' +
		'    <block type="logic_compare"></block>' +
		'    <block type="logic_operation"></block>' +
		'    <block type="logic_negate"></block>' +
		'    <block type="logic_boolean"></block>' +
		'    <block type="logic_null"></block>' +
		'    <block type="logic_ternary"></block>' +
		'  </category>' +
		'  <sep></sep>' +
		'  <category id="catLoops" name="Loops">' +
		'    <block type="controls_repeat_ext">' +
		'      <value name="TIMES">' +
		'        <block type="math_number">' +
		'          <field name="NUM">5</field>' +
		'        </block>' +
		'      </value>' +
		'    </block>' +
		'    <block type="controls_whileUntil"></block>' +
		'    <block type="controls_for">' +
		'      <value name="FROM">' +
		'        <block type="math_number">' +
		'          <field name="NUM">1</field>' +
		'        </block>' +
		'      </value>' +
		'      <value name="TO">' +
		'        <block type="math_number">' +
		'          <field name="NUM">10</field>' +
		'        </block>' +
		'      </value>' +
		'      <value name="BY">' +
		'        <block type="math_number">' +
		'          <field name="NUM">1</field>' +
		'        </block>' +
		'      </value>' +
		'    </block>' +
		'    <block type="controls_flow_statements"></block>' +
		'  </category>' +
		'  <sep></sep>' +
		'  <category id="catMath" name="Math">' +
		'    <block type="math_number"></block>' +
		'    <block type="math_arithmetic"></block>' +
		'    <block type="math_single"></block>' +
		'    <block type="math_trig"></block>' +
		'    <block type="math_constant"></block>' +
		'    <block type="math_number_property"></block>' +
		'    <block type="math_change">' +
		'      <value name="DELTA">' +
		'        <block type="math_number">' +
		'          <field name="NUM">1</field>' +
		'        </block>' +
		'      </value>' +
		'    </block>' +
		'    <block type="math_round"></block>' +
		'    <block type="math_modulo"></block>' +
		'    <block type="math_constrain">' +
		'      <value name="LOW">' +
		'        <block type="math_number">' +
		'          <field name="NUM">1</field>' +
		'        </block>' +
		'      </value>' +
		'      <value name="HIGH">' +
		'        <block type="math_number">' +
		'          <field name="NUM">100</field>' +
		'        </block>' +
		'      </value>' +
		'    </block>' +
		'    <block type="math_random_int">' +
		'      <value name="FROM">' +
		'        <block type="math_number">' +
		'          <field name="NUM">1</field>' +
		'        </block>' +
		'      </value>' +
		'      <value name="TO">' +
		'        <block type="math_number">' +
		'          <field name="NUM">100</field>' +
		'        </block>' +
		'      </value>' +
		'    </block>' +
		'    <block type="math_random_float"></block>' +
		'    <block type="base_map"></block>' +
		'  </category>' +
		'  <sep></sep>' +
		'  <category id="catVariables" name="Variables">' +
		'    <block type="variables_get"></block>' +
		'    <block type="variables_set"></block>' +
		'    <block type="variables_set">' +
		'      <value name="VALUE">' +
		'        <block type="variables_set_type"></block>' +
		'      </value>' +
		'    </block>' +
		'    <block type="variables_set_type"></block>' +
		'  </category>' +
		'  <sep></sep>' +
		'  <category id="catFunctions" name="Functions" custom="PROCEDURE"></category>' +
		'  <sep></sep>' +
		'  <category id="catTime" name="Time">' +
		'    <block type="time_delay">' +
		'      <value name="DELAY_TIME_MILI">' +
		'        <block type="math_number">' +
		'          <field name="NUM">1000</field>' +
		'        </block>' +
		'      </value>' +
		'    </block>' +
		'    <block type="time_delaymicros">' +
		'      <value name="DELAY_TIME_MICRO">' +
		'        <block type="math_number">' +
		'          <field name="NUM">100</field>' +
		'        </block>' +
		'      </value>' +
		'    </block>' +
		'    <block type="time_millis"></block>' +
		'    <block type="time_micros"></block>' +
		'    <block type="infinite_loop"></block>' +
		'  </category>' +
		'</xml>';
	}

}
