var express = require('express');
var app = express();
//var ejs = require('ejs');
var http = require("http").Server(app);
//const https = require('https');

const multer = require('multer');
const path = require('path');
var mysql = require('mysql');
var dbaccount = require('./dbaccount.js');
const util = require('util')
const fs = require('fs');
var cors = require('cors')


/*
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
*/

var bodyparser = require('body-parser');
//var urlencodedparser = bodyparser.urlencoded({extended:false});
app.use(bodyparser.urlencoded({extend: false}));
app.use(bodyparser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/')); // views 폴더 경로는 프로젝트 폴더.(__dirname이 폴더 위치)


app.use(cors());

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


//var io = require('socket.io')(http, {cors: {origin: "*"}});

var options= {
    key: fs.readFileSync('./.env/privkey.pem'),
    cert: fs.readFileSync('./.env/cert.pem'),
    ca: fs.readFileSync('./.env/fullchain.pem'),
    requestCert: false,
    rejectUnauthorized: false
};

const https = require('https').Server(options,app);

var io = require('socket.io')(https, {cors: {origin: "*"}});
//var io = require('socket.io').listen(server);

var emptycontents = `{"ops":[{"attributes":{"indent":4},"insert":"\\n"}]}`;
var emptyimage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQYV2P4DwABAQEAWk1v8QAAAABJRU5ErkJggg==";
//console.log(emptycontents);
//var currentcontents = emptycontents;
var texteditorcontents = new Array();

var currentcanvas;
var userlist = new Array();
//userlist.filename.list = 해당 파일 유저리스트
var painteruserlist = new Array();
var texteditoruserlist = new Array();
var filelist = new Array();


//update each file user list


//main canvas init
fs.writeFile('./uploads/maincanvas', emptyimage, function (err) {
    if (err === null) {
        console.log('main canvas created');
    } else {
        console.log(err);
    }
});

//main texteditor init

fs.writeFile('./uploads/maintexteditor', emptycontents, function (err) {
    if (err === null) {
        console.log('main texteditor created');
    } else {
        console.log(err);
    }
});

texteditorcontents.push({name: 'maintexteditor', contents: emptycontents});

fs.readdir('./uploads', function (err, filelist) {
    //console.log(filelist);
    filelist.forEach(file => {
        //console.log(file);
        let templist = new Object();
        console.log(file);
        templist.name = file;
        templist.list = new Array();
        userlist.push(templist);
    });
});

const texteditorcontentssave = () => {

    console.log("scan list");
    for (let i = 0; i < userlist.length; i++) {
        if(userlist[i].list[0] ){
            console.log("getting context from : " +userlist[i].list[0].id + ". in "+userlist[i].name);
            io.to(userlist[i].list[0].id).emit("getcontext");
/*
            var index = texteditorcontents.findIndex((element, index, arr) => element.name === userlist[i].name);
            console.log(texteditorcontents[index].contents);
            fs.writeFile('./uploads/' + texteditorcontents[index].name, texteditorcontents[index].contents, function (err) {
                //console.log(texteditorcontents[i].contents);
                if (err === null) {
                    //console.log(file+' send saved');
                } else {
                    console.log(err);
                }
            });*/
        }
    }
/*
    console.log('context saving...');
    for (let i = 0; i < texteditorcontents.length; i++) {
        console.log(texteditorcontents[i].contents);
        fs.writeFile('./uploads/' + texteditorcontents[i].name, texteditorcontents[i].contents, function (err) {
            //console.log(texteditorcontents[i].contents);
            if (err === null) {
                //console.log(file+' send saved');
            } else {
                console.log(err);
            }
        });
    }*/
}

setInterval(texteditorcontentssave, 2000);


io.on('connection', (socket) => {
    var user = new Object();
    user.id = socket.id;
    //userlist.push(user);

    //io.emit('userupdate',userlist);

    console.log('User Online :' + user.id);
    //socket.emit('initial',currentcontents);
    //socket.emit('canvas-data',currentcanvas);


    socket.on('user-join', (file) => {
        if (!file.name) {
            return;
        }
        var index = userlist.findIndex((element, index, arr) => element.name === file.name);

        let user = new Object();
        user.id = socket.id;
        console.log(index);
        userlist[index].list.push(user);
        //painteruserlist.push(user);
        socket.join(file.name);
        console.log(file.name + ' join : ' + socket.id);

        var currentdata;
        fs.readFile('./uploads/' + file.name, 'utf8', function (err, data) {
            if (err === null) {
                //console.log(data+' read');
                //currentdata=data;
                if (file.type === 'texteditor') {
                    socket.emit('initial', JSON.parse(data));
                } else {
                    socket.emit('canvas-data', data);
                }


                console.log(file.name + ' userlist :' + JSON.stringify(userlist[index].list));
                io.to(file.name).emit('user-update', userlist[index].list);
            } else {
                console.log(err);
            }

        });

        //console.log('currentdata'+currentdata);


    })

    socket.on('user-leave', (file) => {
        var index = userlist.findIndex((element, index, arr) => element.name === file.name);
        console.log(file.name + ' index: ' + index);
        for (let i = 0; i < userlist[index].list.length; i++) {
            //console.log(memberlist[i].id);
            if (userlist[index].list[i].id == socket.id) {
                userlist[index].list.splice(i, 1);
                console.log(file.name + " user left : " + socket.id);
                break;
            }
        }
        socket.leave(file.name);
        io.to(file.name).emit('user-update', userlist[index].list);
    })


    socket.on('canvas-data', (data) => {
        //let room = io.sockets.manager.roomClients[socket.id];
        //console.log(data);
        console.log(data.name + ' data send from ' + socket.id);
        //console.log(data.image);
        fs.writeFile('./uploads/' + data.name, data.image, function (err) {
            if (err === null) {
                console.log(data.name + ' send saved');
            } else {
                console.log(err);
            }
        });

        socket.to(data.name).emit('canvas-data', data.image);

    })


    // too many write
    // make delta variable and set interval writing
    socket.on('updatecontents', (data) => {


        //let index = texteditorcontents.findIndex((element, index, arr) => element.name === data.name);
        //console.log(data.name+' index : '+index);
        //console.log(JSON.stringify(data.content));


        fs.writeFile('./uploads/' + data.name, JSON.stringify(data.content), function (err) {
            //console.log(texteditorcontents[i].contents);
            if (err === null) {
                console.log(data.content);
                //console.log(file+' send saved');
            } else {
                console.log(err);
            }
        });
        //texteditorcontents[index].contents = JSON.stringify(data.content);

    })

    socket.on('send-delta', (data) => {
        //let room = io.sockets.manager.roomClients[socket.id];

        console.log('delta sent from : ' + socket.id);
        console.log('name : ' + data.name + '     delta : ' + JSON.stringify(data.delta));

        socket.to(data.name).emit('deltaupdate', data.delta); //except sender

    })


    socket.on('file-created', (tempfile) => {
        //let room = io.sockets.manager.roomClients[socket.id];
        if (tempfile.fileselect === 'text editor') {
            fs.writeFile('./uploads/' + tempfile.name, emptycontents, function (err) {
                if (err === null) {
                    console.log('texteditor created');
                    var temp = new Object();
                    temp.name = tempfile.name;
                    temp.list = new Array();
                    userlist.push(temp);

                    var tempcontents = new Object();
                    tempcontents.name = tempfile.name;
                    tempcontents.contents = emptycontents;
                    texteditorcontents.push(tempcontents);
                } else {
                    console.log(err);
                }
            });
        } else {
            fs.writeFile('./uploads/' + tempfile.name, emptyimage, function (err) {
                if (err === null) {
                    console.log('canvas created');
                    var temp = new Object();
                    temp.name = tempfile.name;
                    temp.list = new Array();
                    userlist.push(temp);
                } else {
                    console.log(err);
                }
            });
        }

        filelist.push(tempfile);
        socket.broadcast.emit('filelist-update', filelist);
    });

    socket.on('get-filelist', () => {
        //let room = io.sockets.manager.roomClients[socket.id];

        /////////////////////

        socket.emit('filelist-update', filelist);
        //io.to(file).emit('user-update',userlist[index].list);


    })


    socket.on('open-file', (file) => {
        //let room = io.sockets.manager.roomClients[socket.id];

        /////////////////////

        var index = userlist.findIndex((element, index, arr) => element.name === file);
        let user = new Object();
        user.id = socket.id;

        userlist[index].list.push(user);
        socket.join(file);
        console.log(file + ' join : ' + socket.id);
        console.log('socket room : ' + socket.rooms);
        let currentcontents;
        fs.readFile('./uploads/' + file, 'utf8', function (err, data) {
            currentcontents = data;
        });
        socket.emit('initial', currentcontents);
        io.to(file).emit('user-update', userlist[index].list);


    })


    socket.on('disconnect', function () {

        console.log("user left : " + socket.id);
        var flag = 0;
        for (let i = 0; i < userlist.length; i++) {
            for (let j = 0; j < userlist[i].list.length; j++) {
                //let index = userlist[i][j].findIndex((element, index, arr) => element.name === file);
                //console.log(memberlist[i].id);
                if (userlist[i].list[j].id == socket.id) {
                    console.log("user delete : " + userlist[i].list[j].id);
                    userlist[i].list.splice(j, 1);

                    flag = 1;
                    break;
                }

            }
            if (flag === 1)
                break;
        }
        console.log('emitting id');

        io.to(socket.rooms).emit('user-update', socket.id);
        socket.removeAllListeners();

        //io.emit('painter-user-update', texteditoruserlist);
        //io.emit('userupdate', texteditoruserlist);
        //io.emit('userupdate', memberlist);
    });


})




var server_port = process.env.YOUR_PORT || process.env.PORT || 8000;
//var server_port = 3001;
//http.listen(server_port, () => {
//console.log("Started on : " + server_port);

//})
https.listen(server_port, () => {
console.log("Started on : " + server_port);

})

