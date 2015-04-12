var serialport = require("serialport"),
    SerialPort = serialport.SerialPort;

// list serial ports:
serialport.list(function(err, ports) {
    console.log(ports);
    ports.forEach(function(port) {
        console.log(port.comName);
    });
});
