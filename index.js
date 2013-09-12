'use strict';

global.PRIVATE = 'private';

var Class = global.Class = {
	onCreate: function() {},
	inherit: function(child) {

		for(var method in child) {
			if(method.length > 4) {
				var prop = method.substr(4);
				if('set_' === method.substr(0,4)) {
					child.__defineSetter__(prop, child[method]);
				}
				else if('get_' === method.substr(0,4)) {
					var getter = child[method] === PRIVATE ? function() { return this['_'+prop]; } : child[method];
					child.__defineGetter__(prop, getter);
				}
			}
		}

		child.binds = [];
		for(var method in child) {			
			if(method.length > 7) {
				if('binded_' == method.substr(0,7)) {
					child.binds.push([method, method.substr(7)]);
				}
			}
		}		

		child.__proto__ = this;

		var props = child.collectProps('binds');

		var exists = {};
		for(var i = props.length - 1; i >= 0; i--)
			for(var j = 0, k = props[i].length; j < k; j++) {
				var item = props[i][j];
				exists[item[0]] = item[1];
			}
		child.binds = [];
		for(i in exists)
			child.binds.push([i, exists[i]]);

        return child;
	},	

	collectProps: function(prop, collector) {
		var props = collector ? collector : [];
		if(prop in this) props.push(this[prop]);
		if(this.__proto__ && this.__proto__.collectProps) this.__proto__.collectProps(prop, props);
		return props;
	},

	create: function() {
		var object = {__proto__: this, parent: this.__proto__}

		for(var i = 0, l = object.binds.length; i < l; i++) {
			var item = object.binds[i];
			object[item[0]] = object[item[1]].bind(object);
		}

		object.onCreate.apply(object, arguments);		
		return object;
	}
}
