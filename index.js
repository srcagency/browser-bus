'use strict';

module.exports = Bus;

function Bus( opts ){
	if (!opts)
		opts = {};

	if (!(this instanceof Bus))
		return new Bus(opts);

	this._handlers = [];
	this._relay = opts.relay;
	this._queue = [];
	this._ready = false;

	var bus = this;

	var $iframe = this._proxy = document.createElement('iframe');

    $iframe.setAttribute('src', this._relay);
	$iframe.setAttribute('style', 'display: none;');

	$iframe.addEventListener('load', function(){
		bus._ready = true;

		bus._queue.forEach(function( m ){
			bus.write(m);
		});

		bus._queue = null;
	});

	window.addEventListener('message', function( e ){
		bus._handlers.forEach(function( handler ){
			handler(JSON.parse(e.data));
		});
	});

	document.body.appendChild($iframe);
}

Bus.prototype.write = write;
Bus.prototype.listen = listen;

function write( m ){
	if (this._ready)
		this._proxy.contentWindow.postMessage(JSON.stringify(m), this._relay);
	else
		this._queue.push(m);

	return this;
}

function listen( fn ){
	this._handlers.push(fn);

	return this;
}
