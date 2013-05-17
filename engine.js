var net = require('net');
var proxy = require('./proxy');
var config = require('./config');

var Engine = (function _Engine() {
	var self = Object.create({});
	/** Holds active listening sockets*/
	var _proxyList = {};
	var _io;
	
	self._init = function _init(io) {
		_io = io;
		return this
	};

	/** 
	 * Start the bot using everything in config.servers
	 */
	self.start = function()
	{
		for (var i = 0; i < config.servers.length; i++)
		{
			var server = config.servers[i];
			self.setupProxy(server.addr, server.port, server.name)
		}
		_io.sockets.emit('chat', {user: 'system', message: "Proxy started..."});
	}
	
	self.stop  = function()
	{
		for (var i = 0; i < _proxyList.length; i++) {
			_proxyList[i].stop();
		}
		_io.sockets.emit('chat', {user: 'system', message: "Proxy stopped"});
	}
	
	/** Setup a Proxy object which will listen and connect to an address while forwarding between */
	self.setupProxy = function(addr, port, name)
	{
		var message = "Created proxy \"" + name + "\" at " + addr + ":" + port + "";
		if(typeof(name)==='undefined')
		{	
			name = "unknown"
		}
		if(typeof(addr)==='undefined' || typeof(port)==='undefined')
		{
			message = "Please use the following arguments:"
									+ " service_host port [name]"
									+ " e.g. www.google.com 9001";
		} else {
			_proxyList[name] = proxy.createProxy(name, addr, port, _io)
			_proxyList[name].start()
		}
		_io.sockets.emit('chat', {user: 'system', message: message});
	}
	
	/** Send raw packet data */
	self.replay = function(addr, packet)
	{
		var message = "";
		console.log(new Buffer(packet, 'hex')); 
		serverSocket[packet].write(new Buffer(packet, 'hex'));
		message = "Packet sent!";     
		_io.sockets.emit('chat', {user: 'system', message: message});
	}
	
	/** Do player emote */
	self.emote = function(type)
	{
		var proxy = _proxyList['unknown1']
		switch(type)
		{
			case "finger":
				proxy.client.write(new Buffer('13570115015c0901101000cde21170ba1e1170ba1e04000000', 'hex'));
				proxy.server.write(new Buffer('13570111015905010c0c00cce21170ba1e04000000', 'hex'));
				break;
		}
	}
	
	return self;
}());

// factory function
var createEngine = function _createEngine(io) {
	var o = Object.create(Engine, {});
	return o._init(io);
}
exports.createEngine = createEngine;
