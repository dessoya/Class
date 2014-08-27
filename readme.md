## Class

Class implementation

## Using it

### Create Class

```javascript
var SomeClass = Class.inherit({
	// constructor
	onCreate: function(args) {
	},
	foo: function() {
		console.log(213);
	}
})
```

### Create instance of Class

```javascript
var object = SomeClass.create(args)
```

### Class inheritance

```javascript
var AnotherClass = SomeClass.inherit({
	// constructor
	onCreate: function(args) {
		this.foo();
	},

	bar: function() {
	}
})
```

### Class multi inheritance

```javascript
var BigClass = SomeClass.inherit({
	// constructor
	onCreate: function(args) {
		SomeClass.constructor(this)(args);
		AnotherClass.constructor(this)(args);
	}
}, AnotherClass)
```

### debug tuning with smart-require

debug tags:

class - enable all debug messages of class module
class.inherit - enable inheritance and make instance of class debug info

```javascript

file: application.js

require('smart-require')({ cachePath: '/tmp/smart-require', debug: 'class' })('./program1.js')

file: program1.js

'use strict'

var Class			= require('class')
  , util			= require('util')

var c = Class.inherit({
	asd:function(){}
}
// name of class, first string argument
/* debug: class.inherit
, 'test class'
*/
)

var o = c.create()

// output

[class.inherit] create class "BaseClass" at Object.<anonymous> (/node_modules/class/index.js:82:25)
[class.inherit] create class "test class" at Object.<anonymous> (/example/program1.js:6:15)
[class.inherit] spawn object of class "test class" at Object.<anonymous> (/example/program1.js:14:11)


```