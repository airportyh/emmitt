
var data = '__emmitt__'

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

function on(obj, evt, callback){
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

  if (!obj[data]){
    defineMessengerProp(obj)
  }
  var handlers = obj[data].handlers
  if (!handlers[evt]){
    handlers[evt] = []
  }
  handlers[evt].push([callback])
}

function off(obj, evt, callback){
  if (isEventEmitter(obj)){
    obj.removeListener(evt, callback)
    return
  }

  if (isjQuery(obj)){
    obj.off(evt, callback)
    return
  }

  if (isStandardElement(obj)){
    obj.removeEventListener(evt, callback, false)
  }

  if (!obj[data]) return
  var handlers = obj[data].handlers
  if (!handlers || !handlers[evt]) return
  var callbacks = handlers[evt]
  for (var i = 0; i < callbacks.length; i++){
    if (callbacks[i][0] === callback){
      callbacks.splice(i, 1)
      break
    }
  }
}

function allOff(obj){
  if (isEventEmitter(obj)){
    obj.removeAllListeners()
    return
  }

  if (!obj[data]) return
  obj[data].handlers = {}
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
    var pair = handlers[i]
    var callback = pair[0]
    callback.apply(null, args)
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

var messager = module.exports = {
  emit: emit,
  trigger: emit,
  on: on,
  off: off,
  removeListener: off
  //clearAllListeners: allOff
}