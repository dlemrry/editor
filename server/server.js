var express = require('express');
var app = express();
var ejs = require('ejs');
var http = require("http").Server(app);
const https = require('https');
const multer = require('multer');
const path = require('path');
var mysql = require( 'mysql' );
var dbaccount =  require('./dbaccount.js');
const util = require('util')
const fs = require('fs');



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


const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            //날짜 + 이름
            cb(null, new Date().valueOf() + path.extname(file.originalname));
        }
    }),
});


var io = require('socket.io')(http, {cors: {origin: "*"}});
var currentcontents = {"ops":[{"attributes":{"indent":4},"insert":"\n"}]};
var currentcanvas;
var userlist = new Array();
var painteruserlist = new Array();
var texteditoruserlist=new Array();
var filelist=new Array();


io.on('connection', (socket) => {
    var user = new Object();
    user.id = socket.id;
    userlist.push(user);

    //io.emit('userupdate',userlist);

    console.log('User Online :' + user.id);
    //socket.emit('initial',currentcontents);
    //socket.emit('canvas-data',currentcanvas);

    socket.on('join-painter',() => {
        let user = new Object();
        user.id = socket.id;
        painteruserlist.push(user);
        socket.join('painter')
        console.log('painter join : '+ socket.id);
        socket.emit('canvas-data',currentcanvas);
        io.to('painter').emit('painter-user-update',painteruserlist);

    })
    socket.on('leave-painter',() => {
        for( let i=0; i<painteruserlist.length; i++){
            //console.log(memberlist[i].id);
            if(painteruserlist[i].id == socket.id){
                painteruserlist.splice(i,1);
                console.log("user deleted : " + socket.id);
                break;
            }
        }
        io.to('painter').emit('painter-user-update',painteruserlist);
    })


    socket.on('canvas-data', (data) => {
        //let room = io.sockets.manager.roomClients[socket.id];

        console.log('canvas data send from ' + socket.id);
        currentcanvas=data;
        socket.broadcast.emit('canvas-data', data);

    })

    socket.on('join-texteditor', () => {
        let user = new Object();
        user.id = socket.id;
        texteditoruserlist.push(user);
        socket.join('texteditor');
        console.log('texteditor join : '+ socket.id);
        console.log('socket room : '+ socket.rooms);
        socket.emit('initial',currentcontents);
        io.to('texteditor').emit('texteditor-user-update',texteditoruserlist);
    })

    socket.on('leave-texteditor',() => {
        for( let i=0; i<texteditoruserlist.length; i++){
            //console.log(memberlist[i].id);
            if(texteditoruserlist[i].id == socket.id){
                texteditoruserlist.splice(i,1);
                console.log("texteditor user deleted : " + socket.id);
                break;
            }
        }
        socket.leave('texteditor');
        io.to('texteditor').emit('texteditor-user-update',texteditoruserlist);
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


    socket.on('file-created', (tempfile) => {
        //let room = io.sockets.manager.roomClients[socket.id];
        if(tempfile.fileselect==='text editor'){
        fs.writeFile('./uploads/'+tempfile.name , '{"ops":[{"attributes":{"indent":4},"insert":"\n"}]}' ,function(err){
            if (err === null)
                { console.log('texteditor created'); }
            else
                { console.log(err); }
        });
        }
        else{
            fs.writeFile('./uploads/'+tempfile.name , 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQYV2P4DwABAQEAWk1v8QAAAABJRU5ErkJggg==' ,function(err){
                if (err === null)
                { console.log('canvas created'); }
                else
                { console.log(err); }
            });
        }

    });

    socket.on('open-file', (filename) => {
        //let room = io.sockets.manager.roomClients[socket.id];
        fs.readFile('./uploads/'+filename,'utf8',function(err,data){
            if (err === null){

                socket.emit('file-send',data);
                //console.log(data);
            }
            else{
                console.log('file load fail');
            }

        });


    })


    socket.on('disconnect', function () {
        console.log("user left : " + socket.id);
        for( let i=0; i<userlist.length; i++){
            //console.log(memberlist[i].id);
            if(userlist[i].id == socket.id){
                userlist.splice(i,1);
                console.log("texteditor user deleted : " + socket.id);
                break;
            }
        }
        for( let i=0; i<texteditoruserlist.length; i++){
            //console.log(memberlist[i].id);
            if(texteditoruserlist[i].id == socket.id){
                texteditoruserlist.splice(i,1);
                console.log("texteditor user deleted : " + socket.id);
                break;
            }
        }
        for( let i=0; i<painteruserlist.length; i++){
            //console.log(memberlist[i].id);
            if(painteruserlist[i].id == socket.id){
                painteruserlist.splice(i,1);
                console.log("texteditor user deleted : " + socket.id);
                break;
            }
        }
        io.emit('texteditor-user-update', texteditoruserlist);
        io.emit('painter-user-update', texteditoruserlist);
        //io.emit('userupdate', texteditoruserlist);
        //io.emit('userupdate', memberlist);
    });


})

const options = {

    ca: fs.readFileSync('/etc/letsencrypt/live/www.dglee95.com/fullchain.pem'),

    key: fs.readFileSync('/etc/letsencrypt/live/www.dglee95.com/privkey.pem'),

    cert: fs.readFileSync('/etc/letsencrypt/live/www.dglee95.com/cert.pem')

};


var server_port = process.env.YOUR_PORT || process.env.PORT || 8000;
//var server_port = 3001;


http.listen(server_port, () => {
    console.log("Started on : " + server_port);

})