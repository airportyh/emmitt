# Event API Notes

## jQuery Events:

* .on( events [, selector ] [, data ], handler(eventObject) )
* .off( events [, selector ] [, handler(eventObject) ] )
* .trigger( eventType [, extraParameters ] )

## Backbone Events:

* .on(event, callback, [context])
* .off([event], [callback], [context])
* .trigger(event, [*args])

## Node.js event emitter:

* on(event, listener)
* removeListener(event, listener)
* emit(event, [arg1], [arg2], [...])
