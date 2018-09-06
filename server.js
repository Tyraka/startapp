var http = require('http');
var SerialPort = require("serialport");
var inByte;
function onRequest(request, response) {
  if (request.method == 'POST'){
    myPort.write('1');
    setTimeout(()=>{myPort.write('0')}, 3000)
  }
  console.log(`A user made a ${request.method} request`);
  response.writeHead(200, {"Context-Type": "text/plain"});
  response.write(inByte);
  response.end();
}
function onData(data) {
    inByte = data.toString('ascii');
}

var myPort = new SerialPort("COM4", {
  baudRate: 115200,
})

myPort.on('data', onData);

http.createServer(onRequest).listen(8888);
console.log('Server is running...');
