var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var path = require('path'); //added this but not using it yet - try implementing instead of __dirname
var execPath = path.dirname(process.execPath);

var serialport = require('serialport'), // include the library
    SerialPort = serialport.SerialPort; // make a local instance of it

var midi = require('midi');
var midiIn = new midi.input();

//file navigator
var fileUrl = '';

function chooseFile(name) {
    var chooser = $(name);
    chooser.change(function(evt) {
        console.log($(this).val());
        fileUrl = $(this).val();
    });

    chooser.trigger('click');
}
chooseFile('#fileDialog');

//serving the index file 
function handler(req, res) {
    console.log('got req for ', req);
    fs.readFile(fileUrl,
        function(err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}


serialport.list(function(err, ports) { // listing out serial ports and populates list
    $(document).ready(function() {
        var serialHtml = "<option value=\"blank\">Select a port</option>";
        ports.forEach(function(port) {
            $("#serialDropdown").append("<option value=\"" + port.comName + "\">" + port.comName + "</option>");
        });
        //populating the baud rate dropdown
        var baudArray = [300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 28800, 38400, 57600, 115200];
        for (i = 0, max = baudArray.length; i < max; i++) {
            $("#baudDropdown").append("<option value=\"" + baudArray[i] + "\">" + baudArray[i] + "</option>");
        }
    })
});

//sets port number
$("#portNumber").change(function() {
    var port = $("#portNumber").val();
    console.log(port);
});

var startSerial = function() {
    app.listen(port, function() {
        console.log('started app on ' + port);
    });

    var portName = $("#serialDropdown").val();

    var myPort = new SerialPort(portName, {
        baudRate: $("#baudDropdown").val(), // look for return and newline at the end of each data packet:
        parser: serialport.parsers.readline("\r\n"),
    }, false);


    myPort.open(function(error) {
        if (error) {
            console.log('failed to open: ' + error);
        } else {
            console.log('open');
        }

        io.on('connection', function(socket) {
            socket.on('ready', function(data) {
                console.log('node socket received:', data);
                myPort.write("into the serial port\n", function(err, results) {
                    if (err) {
                        console.log('error writing to serial:', err);
                    }
                    console.log('serial results', results);
                });
            });

            socket.on('dataFromBrowser', function(data) {
                console.log('got data from browser:', data.data);
                myPort.write(data.message, function(err) {
                    if (err) {
                        console.log('err from serial:', err);
                    }
                });
            });
            //on receiving serial, sends it 
            myPort.on("data", function(data) {
                var dataIn = data.toString();
                socket.emit('serialPortData', {
                    data: dataIn
                });
                $("#message").append(dataIn + "<br>");
                $("#message").scrollTop($("#message")[0].scrollHeight);
                //console.log(data);
            });

        });
    });
}

//populate the midi dropdown
for (var i = 0, max = midiIn.getPortCount(); i < max; i++) {
    $("#midiInputDropdown").append("<option value=\"" + i + "\">" + midiIn.getPortName(i) + "</option>");
}

var startMidi = function() {
    app.listen(port, function() {
        console.log('started app on ' + port);
    });
    var midiPort = parseInt($("#midiInputDropdown").val());
    midiIn.openPort(midiPort);
    midiIn.on('message', function(deltaTime, message) {
        console.log('m:' + message + ' d:' + deltaTime);
        io.on('connection', function(socket) {
            console.log('socket connected midi');
            socket.emit('midi', {
                message: message,
                deltaTime: deltaTime
            });
        });
    });
}
