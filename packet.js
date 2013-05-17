

var Packet = (function _Packet() {
	var self = Object.create({});
	
	self._init = function _init(data) {
		
	}
}());

// factory function
var createPacket = function _createPacket(data) {
	var o = Object.create(Packet, {});
	return o._init(data);
}

exports.createPacket = createPacket;