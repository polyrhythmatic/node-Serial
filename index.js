var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000);

//serving the index file 
function handler(req, res) {
    fs.readFile(__dirname + '/index.html',
        function(err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

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

io.on('connection', function(socket) {
    socket.on('ready', function(name, fn) {
        fn(dataIn);
    });
});

var dataIn = '';

myPort.on("data", function(data) {
    dataIn = data.toString();
});
