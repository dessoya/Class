'use strict'

/* uses: smart-require
*/

var util = require('util')

var Class = function(){}

Class.prototype = {

	onCreate: function onCreate () {},
	inherit: function() {

		var child = arguments[0]
		var classes = Array.prototype.slice.call(arguments, 0)

		/* debug: class.inherit
		
		var className = null
		for(var i = 0, l = classes.length; i < l; i++) {
			var item = classes[i]
			if('string' === typeof item) {
				className = item
				classes.splice(i, 1)
				break
			}
		}
		console.log(%dt% + 'create class "' + (null !== className ? className : 'unknown') + '" ' + require('smart-require').filenameFromStack(2, true) )

		*/

		classes.push(this)

		var childContructor = function(){}
		var p = childContructor.prototype = {}

		p.parent = this.prototype
		p.parents = []

		var i = classes.length; while(i--) {
			var parent = classes[i]
			if('function' == typeof parent) {
				parent = parent.prototype
				p.parents.push(parent)
			}
			for(var name in parent) {
				if('parent' == name || 'parents' == name) continue
				p[name] = parent[name]
			}
		}

		/* debug: class.inherit

		p.className = className

		*/

		childContructor.create = this.create
		childContructor.inherit = this.inherit
		childContructor.constructor = this.constructor

        return childContructor
	},	

	constructor: function(object) {
		return this.prototype.onCreate.bind(object)
	},

	super: function(name) {
		var args = Array.prototype.slice.call(arguments)
		args.shift()

		this._super(name, args, [])
	},

	_super: function(name, args, e) {

		if(name in this) {
			if(e.indexOf(this[name]) === -1) {
				e.push(this[name])
				this[name].apply(this, args)
			}
		}

		var p = this.parents

		for(var i = 0, l = p.length; i < l; i++) {
			var item = p[i]
			if(name in item) {
				if(e.indexOf(item[name]) === -1) {
					e.push(item[name])
					item[name].apply(this, args)
				}
			}
			item._super(name, args, e)
		}
	},

	create: function() {

		var object = new this // time 0.085
		// var object = Object.create(this.prototype)	// time 0.973

		/* debug: class.inherit
		console.log(%dt% + 'spawn object of class "' + (null !== object.className ? object.className : 'unknown') + '" ' + require('smart-require').filenameFromStack(2, true))
		*/

		object.onCreate.apply(object, arguments)
		return object
	}
}

Class = Class.prototype.inherit({}
	/* debug: class.inherit
	, 'BaseClass'
	*/
)

module.exports = Class