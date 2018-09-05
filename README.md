# startapp

#Install
1. run ```git clone https://github.com/Tyraka/startapp.git```
2. change directory to downloaded folder ```cd startapp```
3. install all dependencies ```npm install```
4. set arduino port name in server.js
``` javascript
var myPort = new SerialPort("COM4", {
  baudRate: 9600,
})```
5. start the server ```node server.js```
6. start the app ```npm start```
