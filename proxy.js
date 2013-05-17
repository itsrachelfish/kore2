var net = require("net");
var hexy = require("hexy");

var Proxy = (function _Proxy() {
	var self = Object.create({});
	
	var _isConnected = false;
	
	var _serviceSocket;
	var _clientSocket;
	var _name;
	var _addr;
	var _port;
	var _io;
	//var _outbound = new Array();
	//var _inbound = new Array();
	
	self._init = function _init(name, addr, port, io) {
		// Socket connecting out to RO2
		_serviceSocket = new net.Socket(); 
		_name = name;
		_addr = addr;
		_port = port;
		_io = io;
		return this
	};
	
	self.flush = function() {
		/*if(outbound.length > 0) {
			for (i = 0; i < outbound.length; i++) 
			{
				console.log(outbound[i]);
				this.sock.write(outbound[i]);
			}
		}*/
	}
	
	// TODO: make private as to never need to send raw data
	self.server = function(data) {
		return _serviceSocket
	}
	
	// TODO: make private as to never need to send raw data
	self.client = function(data) {
		return _clientSocket
	}
	
	self.start = function() {
		console.log("Listening on 0.0.0.0:" + _port);
		net.createServer(function (stream)
		{
			_clientSocket = stream
			
			_serviceSocket.connect(_port, _addr, function()
			{
				console.log("Connected to " +_addr +":"+ _port);
				_isConnected = true;
				self.flush();
			});
			
			_clientSocket.on("error", function (e)
			{
				console.error("Proxy socket error: %s", e)
				_serviceSocket.end();
			});
		
			_clientSocket.on("data", function (data)
			{
				if(_isConnected)
				{
					var prettyHex = hexy.hexy(data);
					var plainHex = hexy.hexy(data, {numbering: 'none', format: 'none', annotate: 'none'});

					console.log('%s: Client sent: \n%s', _name, prettyHex);
					_io.sockets.emit('packet', {source: 'client', data: plainHex});

					_serviceSocket.write(data);
				} 
				//else
				//{
				//	buffers[buffers.length] = data;
				//}
			});

			_clientSocket.on("close", function(had_error)
			{
				console.log('%s: Socket 0.0.0.0:%d closed', _name, _port);
				_serviceSocket.end();
			});
			
			// Socket events	
			_serviceSocket.on("error", function (e)
			{
				console.error("%s: Could not connect to service at %s:%d", _name, _addr, _port);
				_clientSocket.end();
			});
			
			_serviceSocket.on("data", function(data)
			{
				var prettyHex = hexy.hexy(data);
				var plainHex = hexy.hexy(data, {numbering: 'none', format: 'none', annotate: 'none'});

				console.log('%s: Server sent: \n%s', _name, prettyHex);
				_io.sockets.emit('packet', {source: 'server', host: _addr, port: _port, data: plainHex});
				
				_clientSocket.write(data);
			});
			
			_serviceSocket.on("close", function(had_error)
			{
				console.log('%s: Socket %s:%d closed', _name, _addr, _port);
				_clientSocket.end();
			});    	
		}).listen(_port);    
	}
	
	/** Stop the proxy */
	self.stop = function()
	{
		_serviceSocket.close();
		_clientSocket.close();
	}

	return self;
}());

// factory function
var createProxy = function _createProxy(name, addr, port, io) {
	var o = Object.create(Proxy, {});
	return o._init(name, addr, port, io);
}

exports.createProxy = createProxy;