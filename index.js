
var data = '__emmittdata__'

function defineMessengerProp(obj){
  var value = {
    handlers: {}
  }
  if (Object.defineProperty){
    Object.defineProperty(obj, data, {
      value: value,
      enumerable: false
    })
  }else{
    obj[data] = value
  }
}

function registerHandler(obj, evt, callback){
  if (!obj[data]){
    defineMessengerProp(obj)
  }
  var handlers = obj[data].handlers
  if (!handlers[evt]){
    handlers[evt] = []
  }
  handlers[evt].push(callback)
}

function on(obj, evt, callback){

  registerHandler(obj, evt, callback)

  if (isEventEmitter(obj)){
    obj.on(evt, callback)
    return
  }

  if (isjQuery(obj)){
    obj.on(evt, callback)
    return
  }

  if (isStandardElement(obj)){
    obj.addEventListener(evt, callback, false)
    return
  }

  if (isOldIEElement(obj)){
    obj.attachEvent('on' + evt, callback)
    return
  }

}

function unregisterHandlers(obj, evt, callback){
  var removed = {}
  if (obj[data]){
    var handlers = obj[data].handlers
    if (handlers){
      if (evt){
        if (handlers[evt]){
          var callbacks = handlers[evt]
          if (callback){
            for (var i = 0; i < callbacks.length; i++){
              if (callbacks[i] === callback){
                var rm = callbacks.splice(i, 1)[0]
                if (!removed[evt]) removed[evt] = []
                removed[evt].push(rm)
                break
              }
            }
          }else{
            removed[evt] = handlers[evt]
            handlers[evt] = []
          }
        }
      }else{
        removed = handlers
        obj[data].handlers = {}
      }
    }
  }
  return removed
}

function off(obj, evt, callback){

  var removed = unregisterHandlers(obj, evt, callback)

  if (isEventEmitter(obj)){
    if (callback){
      obj.removeListener(evt, callback)
    }else{
      for (var e in removed){
        var callbacks = removed[e]
        for (var i = 0; i < callbacks.length; i++){
          obj.removeListener(e, callbacks[i])
        }
      }
    }
    return
  }

  if (isjQuery(obj)){
    if (callback){
      obj.off(evt, callback)
    }else{
      for (var e in removed){
        var callbacks = removed[e]
        for (var i = 0; i < callbacks.length; i++){
          obj.off(e, callbacks[i])
        }
      }
    }
    return
  }

  if (isStandardElement(obj)){
    obj.removeEventListener(evt, callback, false)
    return
  }

  if (isOldIEElement(obj)){
    if (callback){
      obj.detachEvent('on' + evt, callback)
    }
    return
  }
  
}

function allOff(obj){

  var removed = unregisterHandlers(obj)

  if (isEventEmitter(obj)){
    for (var e in removed){
      var callbacks = removed[e]
      for (var i = 0; i < callbacks.length; i++){
        obj.removeListener(e, callbacks[i])
      }
    }
    return
  }
  
  if (isjQuery(obj)){
    for (var e in removed){
      var callbacks = removed[e]
      for (var i = 0; i < callbacks.length; i++){
        obj.off(e, callbacks[i])
      }
    }
    return
  }

}

function emit(obj, evt){
  if (isEventEmitter(obj)){
    var args = Array.prototype.slice.call(arguments, 1)
    obj.emit.apply(obj, args)
    return
  }

  if (isjQuery(obj)){
    var args = Array.prototype.slice.call(arguments, 1)
    obj.trigger.apply(obj, args)
    return
  }

  if (!obj[data]) return
  var args = Array.prototype.slice.call(arguments, 2)
  var handlers = obj[data].handlers
  handlers = handlers[evt] || []
  for (var i = 0; i < handlers.length; i++){
    var callback = handlers[i]
    callback.apply(obj, args)
  }
}

function isEventEmitter(obj){
  return obj.on && obj.removeListener && obj.emit
}

function isjQuery(obj){
  return obj.on && obj.off && obj.trigger
}

function isStandardElement(obj){
  return obj.addEventListener && obj.removeEventListener
}

function isOldIEElement(obj){
  return obj.attachEvent && obj.detachEvent
}

module.exports = {
  emit: emit,
  trigger: emit,
  on: on,
  off: off,
  removeListener: off,
  allOff: allOff,
  clearAllListeners: allOff
}