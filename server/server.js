var express = require('express');
var app = express();
var ejs = require('ejs');
var http = require("http").Server(app);

var bodyparser = require('body-parser');
//var urlencodedparser = bodyparser.urlencoded({extended:false});
app.use(bodyparser.urlencoded({extend: false}));
app.use(bodyparser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/')); // views 폴더 경로는 프로젝트 폴더.(__dirname이 폴더 위치)


var io = require('socket.io')(http, {cors: {origin: "*"}});
var currentcontents;


io.on('connection', (socket) => {
    console.log('User Online :' + socket.id);
    socket.emit('initial',currentcontents);

    socket.on('canvas-data', (data) => {
        console.log('canvas data send from ' + socket.id);
        socket.broadcast.emit('canvas-data', data);

    })

    socket.on('join-texteditor', (data) => {
        console.log('texteditor join : ' + socket.id);


    })

    socket.on('updatecontents', (delta) => {
        currentcontents = delta;
        //console.log('current delta : ' + JSON.stringify(currentcontents));
        //socket.broadcast.emit('deltaupdate', delta); //except sender

    })

    socket.on('send-delta', (delta) => {
        console.log('delta sent from : ' + socket.id);
        currentcontents = delta;
        console.log('current delta : ' + JSON.stringify(delta));
        socket.broadcast.emit('deltaupdate', delta); //except sender

    })

    socket.on('disconnect', function () {
        console.log("user left : " + socket.id);

        //io.emit('userupdate', memberlist);
    });


})


var server_port = process.env.YOUR_PORT || process.env.PORT || 8000;
//var server_port = 3001;
http.listen(server_port, () => {
    console.log("Started on : " + server_port);
})