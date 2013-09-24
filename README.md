# Emmitt - Event Emitter for Everything

Emmitt is a small Javascript library that can emit events on any Javascript object. It works with

1. Plain Javascript objects (POJOs)
2. jQuery wraped DOM elements
3. Backbone models or objects extended with Backbone.Event
4. Raw DOM elements

## Usage

Simple example

    var E = require('emmitt');

    var obj = new SomeObject();
    E.on(obj, 'refresh', function(data){
      console.log(obj, 'was refreshed with', data);
    });

    // then later on...
    E.emit(obj, 'refresh', data)

If the object in question is a jQuery wrapped DOM element, a Backbone model, or a raw DOM element, event handling will delegate properly to their respective methods for event handling.

## API

* `on(object, event, handler)` - registers an event handler for a given event on an object.
* `off(object, event, [handler])` - unregisters an event handler. If `handler` is not provided, removes all event handlers for the given event. Aliased to `removeListener`.
* `emit(object, event, [...args])` - emits an event on an object with the given arguments. Aliased to `trigger`.
* `allOff(object)` - remove all event handlers from an object. Aliased to `clearAllListeners`.

## Support

* Node
* Standard compliant browsers
* Non-standard IE 7 and up