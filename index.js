var serialport = require('serialport'), // include the library
    SerialPort = serialport.SerialPort, // make a local instance of it
    // get port name from the command line:
    portName = process.argv[2];

var myPort = new SerialPort(portName, {
    baudRate: 9600,
    // look for return and newline at the end of each data packet:
    parser: serialport.parsers.readline("\r\n")
}, false);


myPort.open(function(error) {
    if (error) {
        console.log('failed to open: ' + error);
    } else {
        console.log('open');
    }
});

myPort.on("data", function (data) {
  console.log(data);
});
