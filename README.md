# Browser bus

This was supposed to give you seamless (offline) communication across a
browser instance. Unfortunately not all browsers like the creative use of
technologies.

Tested and working in:

- Chrome 50
- Firefox 46
- IE 10

Does not work in:

- IE 11
- Safari 9
- Edge 13

If you just need cross-window/tab communication see
[domain-bus](https://github.com/srcagency/domain-bus).

```js
var bus = require('browser-bus')({
	relay: 'https://srcagency.github.io/browser-bus/relay.html',
});

bus.listen(function( m ){
	if (m === 'ping')
		bus.write('pong');

	console.log('Received', m);
});

bus.write('ping');
```

The techniques used are:

- `postMessage` for cross-origin

	A limitation of the `postMessage` API is that you need a reference for the
	window you are in contact with, meaning it only works with iframes, popups
	and windows you open from the origin.

- `localStorage` for cross-window/tab

	Has opposite traits of the `postMessage` API: does not need a reference to
	the receiver, as it is domain-wide by default, but has no cross-domain
	capabilities.

## Interface

```js
var bus = new Bus({
	// if you need offline communication, use techniques to make the relay
	// available offline as well
	relay: 'https://srcagency.github.io/browser-bus/relay.html',
});

// write a message to the bus. Any JSON value is supported via JSON.stringify.
bus.write(message);

bus.listen(fn); // `fn(message)` will be called for each received message
```

## Resources

- http://stackoverflow.com/questions/16226924/is-cross-origin-postmessage-broken-in-ie10
- http://stackoverflow.com/questions/20401751/iframe-localstorage-on-safari-and-safari-mobile
- https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5699170/
