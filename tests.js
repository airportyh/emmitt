var E = require('./index')
var spy = require('ispy')
var assert = require('chai').assert
var EventEmitter = require('events').EventEmitter
var BodyDouble = require('bodydouble')

suite('standalone/plain object', function(){

  var obj

  before(function(){
    obj = makeObject()
  })

  test('emit', function(){
    var oncall = spy()
    E.on(obj, 'call', oncall)
    E.emit(obj, 'call')
    assert(oncall.called, 'how come you didnt call?')
  })

  test('removeListener', function(){
    var oncall = spy()
    E.on(obj, 'call', oncall)
    E.removeListener(obj, 'call', oncall)
    E.emit(obj, 'call')
    assert(!oncall.called, 'shouldnt have called')
  })

  test.skip('removeAllListeners', function(){
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
    obj = makeEventEmitter()
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
    obj = makejQueryObject()
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

suite('DOM elements', function(){

  var elm

  before(function(){
    elm = makeStandardElement()
  })

  test('defers to addEventListener', function(){
    var oncall = function(){}
    E.on(elm, 'click', oncall)
    assert(elm.addEventListener.called, 'should have called')
    assert.deepEqual(elm.addEventListener.lastCall.args, ['click', oncall, false])
  })

  test('defers to removeEventListener', function(){
    var oncall = function(){}
    E.off(elm, 'click', oncall)
    assert(elm.removeEventListener.called, 'should have called')
    assert.deepEqual(elm.removeEventListener.lastCall.args, ['click', oncall, false])
  })

})

test('aliases', function(){
  assert.equal(E.emit, E.trigger)
  assert.equal(E.off, E.removeListener)
})

function makeObject(){
  return {}
}

function makeEventEmitter(){
  var obj = {}

  // The Event Emitter Interface
  // not the full api, we just care about 3 methods

  // on(event, listener)
  obj.on = spy()
  // removeListener(event, listener)
  obj.removeListener = spy()
  // emit(event, [arg1], [arg2], [...])
  obj.emit = spy()
  return obj
}

function makejQueryObject(){
  var obj = {}

  // The event api from jQuery and Backbone
  // not the full api, we just care about 3 methods

  // .on(event, callback)
  obj.on = spy()
  // .off(event, callback)
  obj.off = spy()
  // .trigger(event, [*args])
  obj.trigger = spy()
  return obj
}

function makeStandardElement(){
  var elm = {}

  // A fake DOM element. These are the 3 things we care about
  elm.nodeType = 1
  // addEventListener(evt, handler, bubbling)
  elm.addEventListener = spy()
  // removeEventListener(evt, handler, bubbling)
  elm.removeEventListener = spy()
  return elm
}