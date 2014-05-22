/* host: '42.121.109.203', port: 9090, */
var WebSocketServer = require('ws').Server;  
var wss = new WebSocketServer({
	host: '10.68.101.3',
	port: 9090,
	verifyClient: function(info) {
		return true;
	}
}); 

wss.on('connection', function(ws) {  
	ws.on('message', function(data, flags) { 
	if(flags.binary) {
	}else {
		try{
			var obj = JSON.parse(data); 
			if(obj.hasOwnProperty("exit")&&obj.exit) {
				process.exit();
			}
		}catch(err) {
		/*  console.log("Json Error:%s", err);  */
		}
		/*  console.log('ws event:message, data:%s, flags:%s', data, flags); */
	}
	for(var key in wss.clients) {
		var socket = wss.clients[key];
		var result = {
			unique: socket.upgradeReq.headers['sec-websocket-key'],
			data: data,
			clients: wss.clients.length,
		}
		
		if(socket==ws) {
			result['is_self'] = true; 
		}else {
			result['is_self'] = false;
		}
		socket.send(JSON.stringify(result));
		console.log(JSON.stringify(result));
	}
	});  
	
	ws.on('close', function(code, message) { 
		console.log("clients close, sec-websocket-key: ", ws.upgradeReq.headers['sec-websocket-key']);
	    /* 	console.log('ws event:close, code:%s, message:%s', code, message); */
	}); 
	
	ws.on('error', function(error) {  
		console.log('ws event:error, error:%s', error);
	}); 
	
	ws.on('open', function() {  
		console.log('ws event:open');
	}); 
	
	ws.on('pong', function(data, flags) {  
		console.log('ws event:pong, data:%s, flags:%s', data, flags);
	}); 
	
	ws.on('ping', function(data, flags) {  
		console.log('ws event:ping, data:%s, flags:%s', data, flags);
	}); 
  
}); 

wss.on('error', function(error) {  
	console.log('wss event:error, error:%s', error);
});

wss.on('headers', function(headers) {  
	/*   console.log('headers:%s', headers); */
});

console.log('websocket-server running...ws://%s:%d', wss.options.host, wss.options.port);
  