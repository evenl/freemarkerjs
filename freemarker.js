const path = require('path');

// Copyright 2009 amplafi.com, Andreas Andreou
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

module.exports = {
	// Currently supports:
	// - basic interpolations
	// - directives:
	// 		if, else, list 
	// - size builtin for arrays
	// - includes
	// - built-ins
	//		toUpperCase, toLowerCase, capitalize, length

	// Usage:
	// var engine = freemarker.create("Hello ${name}");
	// alert( freemarker.render(engine, {name:'Bob'}) );
	// // or if don't plan to reuse the engine
	// alert( freemarker.render("Hello ${name}", {name:'Bob'}); );

	// TODO:
	// - support default values, i.e. ${user!"Anonymous"}
	// - null resistance in above expressions if in parenthesis
	// - support methods, i.e. ${avg(3, 5)}
	// - alternative syntax if starts with [#ftl]
	// - ftl comments ( <#-- ftl --> )
	// - directives elseif, switch, case, default, break, stop, compress, noparse, assign
	// see http://freemarker.sourceforge.net/docs/ref_directives.html
	// - string builtin for booleans, i.e. boolean?string("yes", "no")
	// - t, lt, rt, nt directives (or atleast ignore them)
	symbols: {	
		'replace': {start:'${', end:'}', process:function(parts, cmd, template) {
			parts.push(freemarker._p(cmd));

			return true;
		}},

		'if': {start:'<#if', end:'>', process:function(parts, cmd, template) {
			if (cmd.indexOf('??')>=0) {
				var expr = cmd.substring(0, cmd.length-2);
				expr = freemarker._v(expr);
				parts.push("if (" + expr + ") {");
			} else if (cmd.indexOf('?size')>=0) {
				var pos = cmd.indexOf('?size');
				var expr = freemarker._v(cmd.substring(0, pos)) + '.length' +
				cmd.substring(pos+5);
				parts.push("if (" + expr + ") {");
			} else {
				parts.push("if (" + freemarker._v(cmd) + ") {");
			}

			return true;
		}},
		
		'endif': {start:'</#if', end:'>', process:function(parts, cmd, template) {
			parts.push("}");

			return true;
		}},

		'else': {start:'<#else', end:'>', process:function(parts, cmd, template) {
			parts.push("} else {");

			return true;
		}},

		'list': {start:'<#list', end:'>', process:function(parts, cmd, template) {
			// <#list envelopes as envelope >
			var match = cmd.match(/\s*(\S*)\s*as\s*(\S*)\s*/);
			if (match) {
				parts.push("for (var " + match[2] + "_index in " + freemarker._v(match[1]) + ")");
			}
			parts.push("{");
            		if (match) {
                		parts.push(freemarker._v(match[2]) + "=" + freemarker._v(match[1]) + "[" + match[2] + "_index];");
            		}

			return true;
		}},

		'endlist': {start:'</#list', end:'>', process:function(parts, cmd, template) {
			parts.push("}");

			return true;
		}},

		'include': {start:'<#include ', end:'>', process:function(parts, cmd, template) {
			cmd_length    = cmd.length + 1;
			symbol_length = this.start.length + this.end.length + 1;
			
			cmd = cmd.replace(/\s/g, "");
			cmd = cmd.replace(/\"/g, "");
			include = fs.readFileSync(path.resolve(__dirname, cmd), "utf8");
			template.engine = template.engine.slice(0, template.pos) + include + template.engine.slice(template.pos + 1 + symbol_length + cmd_length);

			return false;
		}}

	},
	builtin: {
		'upper_case': function(cmd) {
			return cmd.cmd = cmd.cmd + ".toUpperCase()";
		},
		'lower_case': function(cmd) {
			return cmd.cmd = cmd.cmd + ".toLowerCase()";
		},
		'capitalize' : function(cmd) {
			return cmd.cmd = cmd.cmd + ".toLowerCase().replace( /\\b./g, function(a){ return a.toUpperCase(); })";
		},
		/*'left_pad' : function(cmd) {
			var str = "var padding = new Array(" + cmd.param + "+ 1).join(\"0\");";
			str = str + "(padding + " + cmd.cmd + ").slice(-padding.length);";
			return cmd.cmd = str;
		}*/
		'length' : function(cmd) {
			return cmd.cmd = cmd.cmd + ".length";
		}
	},
	_o : function(cmd) {
		return "p.push(\"" + escape(cmd) + "\");";
	},
	_p : function(cmd) {
		return "p.push(" + freemarker._v(cmd, true) + ");";
	},
	_d : function(cmd) {
		return "console.debug(this, \"" + escape(cmd) + "\");";
	},
	_v : function(name, out) {
		return out ? 'this._fm_out(this.'+name+')' : 'this.'+name;
	},
	_setlocalvarscode: function(obj) {
		var buf = [];
		buf.push("this._vars={};");
		for (var p in obj) {
			buf.push("this._vars.", p, " = this['", p, "'];\n");
		}
		return buf.join('');
	},
	
	splitCmdAndBuiltin: function(cmd) {
		var res = cmd.split("?");
		if (res[1] == undefined) {
			return {
				cmd:     res[0],
				builtin: undefined,
				param:   undefined
			};
		} else {
			return {
				cmd:     res[0],
				builtin: res[1].substring(0, res[1].lastIndexOf("(") == -1 ? res[1].length : res[1].lastIndexOf("(")), 
				param:   res[1].substring(res[1].lastIndexOf("(")+1,res[1].lastIndexOf(")")) || undefined
			};
		}
	},

	nextToken: function(template) {
		var newPos;
		var endPos;
		var found={};
		for (var i in this.symbols) {
			var symbol = this.symbols[i];
			var n = template.engine.indexOf(symbol.start, template.pos);
			if (n>=0 && (!found.symbol || n<found.newPos)) {
				var e = template.engine.indexOf(symbol.end, n);
				if (e>=0) {
					found.newPos = n;
					found.endPos = e;
					found.start = n + symbol.start.length;
					found.symbol = symbol;
				}
			}
		}
		return found;
	},

	create: function(template) {
		var parts = [];
		parts.push("var p=[];");
		var move_pos=true;
		
		while (template.pos>=0) {
			var token = this.nextToken(template);
			if (!token.symbol) {
				parts.push(this._o(template.engine.substring(template.pos)));
				break;
			}
			
			parts.push(this._o(template.engine.substring(template.pos, token.newPos)));
			if (token.symbol.process) {
				var cmd = this.splitCmdAndBuiltin(template.engine.substring(token.start, token.endPos));
				if(cmd.builtin != undefined) {
					this.builtin[cmd.builtin](cmd);
				}
				move_pos = token.symbol.process(parts, cmd.cmd, template);
			}
			
			if (move_pos == true) {
				template.pos = token.endPos+1;
			}
		}
		parts.push("this._out = unescape(p.join(''));");

		var engine={
			compiled:parts.join(''),
			template:template.engine
		};
		//console.debug(parts.join('\n'));
		return engine;
	},

	render: function(engine, context) {
		var template = {
							"engine"  : engine,
							"context" : context || {},
							"pos"     : 0
		};
		
		engine = this.create(template);

		template.context._fm_out = function(val){
			if (typeof val == 'object'){
				if (typeof val._render == 'function')
					return val._render();
				else if (val[0])
					return val[0];
			} 

			return val;
		};

		var vars = this._setlocalvarscode(template.context);
		(function(){eval(engine.compiled);}).call(context);
		return template.context._out;
	}
}; 
