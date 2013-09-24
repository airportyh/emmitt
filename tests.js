var E = require('./index')
var spy = require('ispy')
var assert = require('chai').assert
var EventEmitter = require('events').EventEmitter
var BodyDouble = require('bodydouble')

suite('standalone/plain object', function(){

  test('emit', function(){
    var obj = {}
    var oncall = spy()
    E.on(obj, 'call', oncall)
    E.emit(obj, 'call')
    assert(oncall.called, 'how come you didnt call?')
  })

  test('removeListener', function(){
    var obj = {}
    var oncall = spy()
    E.on(obj, 'call', oncall)
    E.removeListener(obj, 'call', oncall)
    E.emit(obj, 'call')
    assert(!oncall.called, 'shouldnt have called')
  })

  test.skip('removeAllListeners', function(){
    var obj = {}
    var oncall = spy()
    E.on(obj, 'call', oncall)
    E.on(obj, 'foo', oncall)
    E.on(obj, 'bar', oncall)
    E.removeAllListeners(obj)
    E.emit(obj, 'call')
    E.emit(obj, 'foo')
    E.emit(obj, 'bar')
    assert(!oncall.called, 'shouldnt have called')
  })

})

suite('event emitter', function(){

  var obj

  before(function(){
    obj = {}

    // The Event Emitter Interface
    // not the full api, we just care about 3 methods

    // on(event, listener)
    obj.on = spy()
    // removeListener(event, listener)
    obj.removeListener = spy()
    // emit(event, [arg1], [arg2], [...])
    obj.emit = spy()
  })

  test('defers on to event emitter', function(){
    var oncall = function(){}
    E.on(obj, 'call', oncall)
    assert(obj.on.called, 'should have called')
    assert.deepEqual(obj.on.lastCall.args, ['call', oncall])
  })

  test('defers off to event emitter', function(){
    var oncall = function(){}
    E.off(obj, 'call', oncall)
    assert(obj.removeListener.called, 'should have called')
    assert.deepEqual(obj.removeListener.lastCall.args, ['call', oncall])
  })

  test('defers emit to event emitter', function(){
    E.emit(obj, 'call', 1)
    assert(obj.emit.called, 'should have called')
    assert.deepEqual(obj.emit.lastCall.args, ['call', 1])
  })

})

suite('jQuery or Backbone', function(){

  var obj

  before(function(){
    obj = {}

    // The event api from jQuery and Backbone
    // not the full api, we just care about 3 methods

    // .on(event, callback)
    obj.on = spy()
    // .off(event, callback)
    obj.off = spy()
    // .trigger(event, [*args])
    obj.trigger = spy()
  })

  test('defers to on', function(){
    var oncall = function(){}
    E.on(obj, 'call', oncall)
    assert(obj.on.called, 'should have called')
    assert.deepEqual(obj.on.lastCall.args, ['call', oncall])
  })

  test('defers to off', function(){
    var oncall = function(){}
    E.off(obj, 'call', oncall)
    assert(obj.off.called, 'should have called')
    assert.deepEqual(obj.off.lastCall.args, ['call', oncall])
  })

  test('defers to trigger', function(){
    E.emit(obj, 'call', 1)
    assert(obj.trigger.called, 'should have called')
    assert.deepEqual(obj.trigger.lastCall.args, ['call', 1])
  })

})

test('aliases', function(){
  assert.equal(E.emit, E.trigger)
  assert.equal(E.off, E.removeListener)
})