var E = require('./index')
var spy = require('ispy')
var EventEmitter = require('events').EventEmitter
var BodyDouble = require('bodydouble')
var Backbone = require('backbone')
var test = require('tape')

suite('Integration: pojo', worksWith(makeObject))
suite('Integration: event emitter', worksWith(EventEmitter))
suite('Integration: jQuery or Backbone', worksWith(Backbone.Model))
if (typeof document !== 'undefined')
suite('Integration: DOM element', worksWith(makeRealDOMElement))

function worksWith(Object){

  return function(suiteName){
    
    test(suiteName + ' emit', function(t){
      var obj = new Object()
      var oncall = spy()
      E.on(obj, 'call', oncall)
      E.emit(obj, 'call', 1)
      t.assert(oncall.called, 'how come you didnt call?')
      t.equal(oncall.callCount, 1)
      t.deepEqual(oncall.lastCall.args, [1])
      t.end()
    })

    test(suiteName + ' removeListener', function(t){
      var obj = new Object()
      var oncall = spy()
      E.on(obj, 'call', oncall)
      E.off(obj, 'call', oncall)
      E.emit(obj, 'call')
      t.assert(!oncall.called, 'shouldnt have called')
      t.end()
    })

    test(suiteName + ' remove all listeners for an event', function(t){
      var obj = new Object()
      var oncall = spy()
      E.on(obj, 'call', oncall)
      E.on(obj, 'call', oncall)
      E.off(obj, 'call')
      E.emit(obj, 'call')
      t.assert(!oncall.called, 'shouldnt have called')
      t.end()
    })

    test(suiteName + ' remove all listeners for all events', function(t){
      var obj = new Object()
      var oncall = spy()
      E.on(obj, 'call', oncall)
      E.on(obj, 'foo', oncall)
      E.on(obj, 'bar', oncall)
      E.clearAllListeners(obj)
      E.emit(obj, 'call')
      E.emit(obj, 'foo')
      E.emit(obj, 'bar')
      t.assert(!oncall.called, 'shouldnt have called')
      t.end()
    })

  }

}


suite('event emitter', function(){

  test('defers on to event emitter', function(t){
    var obj = makeEventEmitter()
    var oncall = function(){}
    E.on(obj, 'call', oncall)
    t.assert(obj.on.called, 'should have called')
    t.deepEqual(obj.on.lastCall.args, ['call', oncall])
    t.end()
  })

  test('defers off to event emitter', function(t){
    var obj = makeEventEmitter()
    var oncall = function(){}
    E.off(obj, 'call', oncall)
    t.assert(obj.removeListener.called, 'should have called')
    t.deepEqual(obj.removeListener.lastCall.args, ['call', oncall])
    t.end()
  })

  test('defers emit to event emitter', function(t){
    var obj = makeEventEmitter()
    E.emit(obj, 'call', 1)
    t.assert(obj.emit.called, 'should have called')
    t.deepEqual(obj.emit.lastCall.args, ['call', 1])
    t.end()
  })

})


suite('jQuery or Backbone', function(){

  test('defers to on', function(t){
    var obj = makejQueryObject()
    var oncall = function(){}
    E.on(obj, 'call', oncall)
    t.assert(obj.on.called, 'should have called')
    t.deepEqual(obj.on.lastCall.args, ['call', oncall])
    t.end()
  })

  test('defers to off', function(t){
    var obj = makejQueryObject()
    var oncall = function(){}
    E.off(obj, 'call', oncall)
    t.assert(obj.off.called, 'should have called')
    t.deepEqual(obj.off.lastCall.args, ['call', oncall])
    t.end()
  })

  test('defers to trigger', function(t){
    var obj = makejQueryObject()
    E.emit(obj, 'call', 1)
    t.assert(obj.trigger.called, 'should have called')
    t.deepEqual(obj.trigger.lastCall.args, ['call', 1])
    t.end()
  })

})



suite('DOM elements', function(){

  test('defers to addEventListener', function(t){
    var elm = makeStandardElement()
    var oncall = function(){}
    E.on(elm, 'click', oncall)
    t.assert(elm.addEventListener.called, 'should have called')
    t.deepEqual(elm.addEventListener.lastCall.args, ['click', oncall, false])
    t.end()
  })

  test('defers to removeEventListener', function(t){
    var elm = makeStandardElement()
    var oncall = function(){}
    E.off(elm, 'click', oncall)
    t.assert(elm.removeEventListener.called, 'should have called')
    t.deepEqual(elm.removeEventListener.lastCall.args, ['click', oncall, false])
    t.end()
  })

})


suite('Old IE DOM Elements', function(){

  test('defers to attachEvent', function(t){
    var elm = makeOldIEElement()
    var oncall = function(){}
    E.on(elm, 'click', oncall)
    t.assert(elm.attachEvent.called, 'should have called')
    t.deepEqual(elm.attachEvent.lastCall.args, ['onclick', oncall])
    t.end()
  })

  test('defers to detachEvent', function(t){
    var elm = makeOldIEElement()
    var oncall = function(){}
    E.off(elm, 'click', oncall)
    t.assert(elm.detachEvent.called, 'should have called')
    t.deepEqual(elm.detachEvent.lastCall.args, ['onclick', oncall])
    t.end()
  })
})


test('aliases', function(t){
  t.equal(E.emit, E.trigger)
  t.equal(E.off, E.removeListener)
  t.end()
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

  // A fake DOM element. These are 2 methods we care about
  
  // addEventListener(evt, handler, bubbling)
  elm.addEventListener = spy()
  // removeEventListener(evt, handler, bubbling)
  elm.removeEventListener = spy()
  return elm
}

function makeOldIEElement(){
  var elm = {}

  // A fake DOM element on older IEs. We care about 2 methods

  // attachEvent(event, handler)
  elm.attachEvent = spy()
  // detachEvent(event, handler)
  elm.detachEvent = spy()
  return elm
}

function makeRealDOMElement(){
  return document.createElement('div')
}

function suite(name, fun){
  fun(name)
}