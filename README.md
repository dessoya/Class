### Code

	'use strict';

	var util = require('util');
	require('class');

	var MyClass = Class.inherit({

		// after creating event aka constructor
		onCreate: function() {
			this.name ='MyClassName';
			console.log('MyClass.onCreate ' + this.name);
		},

		// use auto creating binded callbacks in instance of Class
		binded_getName: 0,
		getName: function() {
			return this.name;
		}

	});

	var MyClass2 = MyClass.inherit({
		// use getter\setter
		set_name: function(v) { this._name = 'MyClass2.setter:' + v; },
		// use default getter, return _name property
		get_name: PRIVATE
	});

	var MyClass3 = MyClass2.inherit({
		onCreate: function() {

			// use parent access
			this.parent.onCreate();

			this.name ='MyClass3Name';
			console.log('MyClass3.onCreate ' + this.name);
		}
	});

	var a = MyClass.create();
	var f1 = a.binded_getName;

	var b = MyClass2.create();
	var f2 = b.binded_getName;

	var c = MyClass3.create();
	var f3 = c.binded_getName;


	console.log(a._name);
	console.log(b._name);
	console.log(c._name);

	console.log('----1');
	console.log(f1());
	console.log(f2());
	console.log(f3());
