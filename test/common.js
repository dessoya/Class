'use strict';

var assert = require('assert')
  , Class = require('./../index.js')
  , util = require('util')


describe('Module class', function(){


  it('common functionality', function(done){

		assert.equal(typeof Class, 'function', 'Class type check');
		assert.equal(typeof Class.create, 'function', 'Class type check');
		assert.equal(typeof Class.inherit, 'function', 'Class type check');
		assert.equal(typeof Class.constructor, 'function', 'Class type check');

		done();
	})

  it('inherit', function(done){

		var C = Class.inherit({
			onCreate: function() {
			}
		});

		assert.equal(typeof C, 'function', 'Class type check');
		assert.equal(typeof C.create, 'function', 'Class type check');
		assert.equal(typeof C.inherit, 'function', 'Class type check');
		assert.equal(typeof C.constructor, 'function', 'Class type check');
		assert.equal(typeof C.prototype.onCreate, 'function', 'Class type check');

		done();
	})

  it('create', function(done){

		var C = Class.inherit({
			onCreate: function() {
				this.a = 123;
			}
		});

		var o = C.create();

		assert.equal(o.a, 123, 'onCreate check');

		done();
	})

  it('default onCreate', function(done){

		var C = Class.inherit({
		});

		var o = C.create();

		assert.equal(typeof C.prototype.onCreate, 'function', 'Class type check');

		done();
	})

  it('parent constructor access', function(done){

		var C = Class.inherit({
			onCreate: function() {
				this.foo = 123;
			}
		});

		var B = C.inherit({
			onCreate: function() {
				C.constructor(this)();
			}
		});

		var o = B.create();

		assert.equal(o.foo, 123, 'parent constructor executing');

		done();
	})

  it('multi inherit', function(done){

		var C = Class.inherit({
			onCreate: function() {
				this.foo = 123;
			},

			cmethod: function() { return 'cmethod' },
		})

		var B = C.inherit({
			onCreate: function() {
				this.bar = 456;
			},
			bmethod: function() { return 'bmethod' },
		});

		var S = C.inherit({
			onCreate: function() {
				C.constructor(this)();
				B.constructor(this)();
			}
		}, B);

		var o = S.create();

		assert.equal(o.foo, 123, 'C constructor executing');
		assert.equal(o.bar, 456, 'C constructor executing');
		assert.equal(o.cmethod(), 'cmethod', 'method from C class');
		assert.equal(o.bmethod(), 'bmethod', 'method from B class');

		done();
	})

    it('super', function(done) {

		var C = Class.inherit({
			m: function(a) {
				a['c.m'] = this.b
			}
		})

		var C1 = Class.inherit({
			m: function(a) {
				a['c1.m'] = this.b
			}
		})

		var D = C.inherit({
			m: function(a) {
				a['d.m'] = this.b
			}
		}, C1)

		var D1 = C.inherit({
			m: function(a) {
				a['d1.m'] = this.b
			}
		}, C1)

		var E = D.inherit({
		    
		    onCreate: function() {
		    	this.b = 123
		    },

			m: function(a) {
				a['e.m'] = this.b
			}
		}, D1)

		var c = E.create(), a = {}
		c.super('m', a)

		assert.deepEqual(a, { 'e.m': 123, 'd.m': 123, 'c.m': 123, 'c1.m': 123, 'd1.m': 123 }, 'check')

		done()
	})

  it('multi inherit constructor miss', function(done){
  
        // console.log('c------')

		var C = Class.inherit({
			// name: 'C',
			onCreate: function() {
				this.n = 'C'
			}
		})

		var o1 = C.create()
		//console.log(util.inspect(C.prototype,{depth:null,showHidden:true}))

        // console.log('b------')
		var B = C.inherit({
			onCreate: function() {
				this.n = 'B'
			}
		})

		var o2 = B.create()
        //console.log('d------')

		var D = C.inherit({
		})

		//console.log(util.inspect(D,{depth:null,showHidden:true}))


		var o3 = D.create()

        // console.log('s------')
		var S = D.inherit({
		}, B)

		// console.log(util.inspect(S,{depth:null,showHidden:true}))

		var o4 = S.create()

		assert.equal(o1.n, 'C', 'check 1')
		assert.equal(o2.n, 'B', 'check 2')
		assert.equal(o3.n, 'C', 'check 3')
		assert.equal(o4.n, 'C', 'check 4')

		done()
	})


})
