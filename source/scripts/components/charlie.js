/*! Charlie Template Plugin 2016, Ehren Coker */

/* HOW TO ----------------------------------------

Charlie is a tiny version of Mustache / Handlebars. Get it? Charlie Chaplin? Eh?

+++++++++
TEMPLATES
It charlies two types of TEMPLATES:
	+ String
	+ Arrays

Here's an example String Template:
var template = '<li><a href="#">{{name}}</a></li>';

And an array template:
var template = [
	'<li>',
		'<a href="#">{{name}}</a>',
	'</li>'
];

+++++++++++++++++
THINGS YOU CAN DO

Use top level strings
Hello, {{name}}!

Use object properties
Hello, {{friend.name}}!

IF statements
{{#item.rating}}<span class="rating">Rating: {{item.rating}}</span>{{/item.rating}}

IF/ELSE statements
{{#item.rating}}<span class="rating">Rating: {{item.rating}}</span>{{else}}<p>NO RATING</p>{{/item.rating}}

EACH statements
{{#each muppet in muppets}}Hello, {{muppet.name}}!{{/each}}

++++
DATA
Format your DATA as an Object or an Array:

Object:
var friend = {
	name: 'Grover'
};

Array:
var friends = [
	{
		name: 'Grover'
	},
	{
		name: 'Kermit'
	},
	{
		name: 'Animal'
	},
	{
		name: 'Chef'
	}
];

++++++++++++++
Examples Calls

For these EXAMPLES, use one of the first
two templates and whatever DATA you like:

1) Return Markup
var markup = $.charlie(template, friend);

2) Render and Place in <ul id="friend-list"></ul>
$.charlie(template, friends, '#friend-list');

3) charlie and Append instead of replace html
$.charlie(template, friends, '#friend-list', 'append');

3) charlie, Place and Bind
var bindCallback = function($markup) {
	$markup.find('a').click(function(){
		alert($(this).text());
	});
	return $markup; // that last line is !important
}
$.charlie(template, friends, '#friend-list', false, bindCallback);

// written by Ehren Coker, 11/17/15
-------------------------------------- */

(function($) {
	$.extend({
		charlie: function(template, data) {
			/* ERROR RESPONSE FOR UNDEFINED DATA PROPERTIES --- */
			var fail = function(){
				return '{{ ERROR: ' + arguments[1] + '}}';
			};

			var matchifyRE = /{{([^#\/][^}]+)}}/g;
			var matchifyIfRE = /{{#([^\s]+)}}([\s\S\n]*){{\/\1}}/g;
			var matchifyEachRE = /{{#each\s+([^\s]+)\s+in\s+([^\s|}]+)}}([\s\S\n]*?({{#each[^}]+}}[\s\S\n]*?{{\/each}})?[\s\S\n]*?){{\/each}}/i;

			var getValue = function(prop) {
				prop = prop.split('.');
				var value = data;
				for (var i=0;i<prop.length;i++) {
					if (typeof value[ prop[i] ] == 'undefined') return false;
					value = value[ prop[i] ];
				}
				return value;
			}

			/* REGULAR EXPRESSION CALLBACK FUNCTION --- */
			var matchify = function() {
				var prop = arguments[1];
				var replace = getValue(prop);
				if (typeof replace !== 'string' && typeof replace !== 'number') return fail(arguments);
				return replace;
			};

			/* REGULAR EXPRESSION CALLBACK FUNCTION + CONDITIONAL */
			var matchifyIf = function() {
				var prop = arguments[1];
				if (getValue(prop)) {
					if (/{{else}}/.test(arguments[2])) {
						return arguments[2].replace(/{{else}}.*/, '');
					}
					return arguments[2];
				} else if (/{{else}}/.test(arguments[2])) {
					return arguments[2].replace(/.*{{else}}/, '');
				}
				return '';
			};

			/* REGULAR EXPRESSION CALLBACK FUNCTION + LOOPY LOOPS */
			var matchifyEach = function() {
				var tempKey = arguments[1], key = arguments[2], tmpl = arguments[3];
				if (data[key]) {
					var replace = $.map(data[key], function(d){
						data[tempKey] = d;
						var _tmpl = tmpl; // temporary value of template
						while (matchifyIfRE.test(_tmpl)) {
							_tmpl = _tmpl.replace(matchifyIfRE, matchifyIf);
						}
						return  _tmpl.replace(matchifyRE, matchify);
					}).join('');
				}
				return replace;
			};

			/* TO PROCESS DATA ARRAYS --- */
			var renderArray = function(template, array){
				var rendered_items = $.map(array, function(array_item){
					return $.charlie(template, array_item);
				});
				
				// RETURN rendered ELEMENT
				return rendered_items.join('')
			};
			if( Object.prototype.toString.call( data ) === '[object Array]' ) {
				/* LOOKS LIKE AN ARRAY DATA OBJECT, LET'S USE THE ALTERNATE --- */
				renderArray(template, data);
			} else {
				/* YES, WE DO ACCEPT ARRAY TEMPLATES --- */
				if (typeof template !== 'string') { template = template.join(''); }
				/* WORK THROUGH THE EACH SCENARIO FIRST --- */
				while(matchifyEachRE.test(template)) template = template.replace(matchifyEachRE, matchifyEach);
				if (matchifyIfRE.test(template)) template = template.replace(matchifyIfRE, matchifyIf);
				var rendered = template.replace(matchifyRE, matchify);
				return rendered;
			}
			
		}
	});
})(jQuery);