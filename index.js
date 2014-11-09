'use strict'

/* uses: smart-require
*/

var util		= require('util')
  , fs			= require('fs')

var Class = function(){}

Class.prototype = {

    // name: 'Class',
	//onCreate: function onCreate () { console.log('Class.onCreate') },
	onCreate: function onCreate () { },
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

		// console.log(util.inspect(classes,{depth:null,showHidden:true}))

		var childContructor = function(){}
		var p = childContructor.prototype = {}

		p.parent = this.prototype
		p.parents = []

		var o = Class.prototype.onCreate, i = classes.length; while(i--) {
			var parent = classes[i]
			if('function' === typeof parent) {
				parent = parent.prototype
				p.parents.push(parent)
			}
			for(var name in parent) {
				if('parent' === name || 'parents' === name || 'onCreate' === name) continue
				//if('parent' === name || 'parents' === name) continue
				//if('onCreate' === name && parent.onCreate == o) continue
				p[name] = parent[name]
			}
		}
		
		if(classes.length > 2) {
			var a = classes.pop()
			classes.splice(1, 0, a)
		}


/*
		if(!p.onCreate) {
			p.onCreate = this.onCreate
		}
*/
		for(var i = 0, l = classes.length; i < l; i++) {
			var parent = classes[i]
			if('function' === typeof parent) {
				parent = parent.prototype
			}

			//console.log('name: '+parent.name)
			if(parent.onCreate && parent.onCreate === o) continue

			if(parent.onCreate && !p.onCreate) {
				// console.log('apply onCreate')
				p.onCreate = parent.onCreate
				break
			}
		}

		if(!p.onCreate) p.onCreate = o


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

		this._super(this, name, args, [])
	},

	_super: function(object, name, args, e) {

		if(name in this) {
			if(e.indexOf(this[name]) === -1) {
				e.push(this[name])
				this[name].apply(object, args)
			}
		}

		var p = this.parents

		for(var i = 0, l = p.length; i < l; i++) {
			var item = p[i]
			if(name in item) {
				if(e.indexOf(item[name]) === -1) {
					e.push(item[name])
					item[name].apply(object, args)
				}
			}
			item._super(object, name, args, e)
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

/*
Class.loadClasses = function(path) {
}
*/

module.exports = Class