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
    portName = '/dev/cu.usbmodem1411';//process.argv[2]; removing command line invocation of port

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

    io.on('connection', function(socket) {
        socket.on('ready', function(data) {
            console.log('node socket received:',data);
            myPort.write("into the serial port\n", function(err, results){
                if (err) { console.log('error writing to serial:',err); }
                console.log('serial results',results);
            });
        });

        socket.on('dataFromBrowser', function(data){
            console.log('got data from browser:',data);
            myPort.write(data.message, function(err){
                if (err) { console.log('err from serial:',err);}
            });
        });

        myPort.on("data", function(data) {
            var dataIn = data.toString();
            socket.emit('serialPortData', {data: dataIn});
            //console.log(data);
        });

    });
});

