var express = require('express');
var app = express();
var ejs = require('ejs');
var http = require("http").Server(app);
const multer = require('multer');
const path = require('path');
var mysql = require( 'mysql' );
var dbaccount =  require('./dbaccount.js');

console.log('mysql constructing');
var conn = mysql.createConnection({
    host: dbaccount.host,
    user: dbaccount.user,
    password: dbaccount.password,
    port: dbaccount.port,
    database: dbaccount.database
});
console.log('mysql establsh');
conn.connect();
console.log('mysql connected');


var bodyparser = require('body-parser');
//var urlencodedparser = bodyparser.urlencoded({extended:false});
app.use(bodyparser.urlencoded({extend: false}));
app.use(bodyparser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/')); // views 폴더 경로는 프로젝트 폴더.(__dirname이 폴더 위치)


var io = require('socket.io')(http, {cors: {origin: "*"}});
var currentcontents = {"ops":[{"attributes":{"indent":4},"insert":"\n"}]};
var currentcanvas;
var userlist = new Array();



io.on('connection', (socket) => {
    var user = new Object();
    user.id = socket.id;
    userlist.push(user);

    console.log('User Online :' + user.id);
    //socket.emit('initial',currentcontents);
    //socket.emit('canvas-data',currentcanvas);

    socket.on('join-painter',(data) => {
        socket.emit('canvas-data',currentcanvas);

    })


    socket.on('canvas-data', (data) => {
        //let room = io.sockets.manager.roomClients[socket.id];

        console.log('canvas data send from ' + socket.id);
        currentcanvas=data;
        socket.broadcast.emit('canvas-data', data);

    })

    socket.on('join-texteditor', (data) => {
        //socket.join('main-texteditor');
        //console.log('texteditor join : ' + socket.id);
        socket.emit('initial',currentcontents);

    })

    socket.on('updatecontents', (delta) => {

        currentcontents = delta;
        //console.log('current delta : ' + JSON.stringify(currentcontents));
        //socket.broadcast.emit('deltaupdate', delta); //except sender
        //console.log('current contents : ' + JSON.stringify(currentcontents));
    })

    socket.on('send-delta', (delta) => {
        //let room = io.sockets.manager.roomClients[socket.id];
        console.log('delta sent from : ' + socket.id);
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