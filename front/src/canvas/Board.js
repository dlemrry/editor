import React, {useState} from 'react';
//import io from 'socket.io-client';
//import socketIOClient from 'socket.io-client';

import socketIOClient from 'socket.io-client';
import Grid from "@material-ui/core/Grid";
import './boardstyle.css';


const Board2 = () => {


}


class Board extends React.Component {

    timeout;
    //socket;
    socket = socketIOClient("http://13.125.51.192:8000");
    //console.log('socket connect');
    ctx;
    isDrawing = false;


    constructor(props) {
        super(props);

        this.socket.on("canvas-data", function (data, propss) {
            console.log('canvas-data receive');

            var root = this;

            console.log('interval');
            var interval = setInterval(function () {
                if (root.isDrawing) return;
                root.isDrawing = true;
                clearInterval(interval);
                var image = new Image();
                var canvas = document.querySelector('#board');
                var ctx = canvas.getContext('2d');
                image.onload = function () {
                    ctx.drawImage(image, 0, 0);

                    root.isDrawing = false;
                };
                image.src = data;
            }, 200)

        })


    }

    componentDidMount() {
        this.drawOnCanvas();
        //console.log('this sockid : '+this.socket.id);
    }

    componentWillReceiveProps(newProps) {
        this.ctx.strokeStyle = newProps.color;
        this.ctx.lineWidth = newProps.size;
    }

    drawOnCanvas() {
        var canvas = document.querySelector('#board');
        this.ctx = canvas.getContext('2d');
        var ctx = this.ctx;

        var sketch = document.querySelector('#sketch');
        var sketch_style = getComputedStyle(sketch);
        //canvas.width = parseInt(window.innerWidth );
        //canvas.height = parseInt(window.innerHeight );
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));
        //var abwidth = sketch.getBoundingClientRect().left;
        //var abheight = window.pageYOffset + sketch.getBoundingClientRect().top;
        var mouse = {x: 0, y: 0};
        //var mouse = {x: abwidth, y: abheight};
        var last_mouse = {x: 0, y: 0};

        /* mouse capture */
        canvas.addEventListener('mousemove', function (e) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);


        /* draw */
        ctx.lineWidth = this.props.size;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.props.color;

        canvas.addEventListener('mousedown', function (e) {
            canvas.addEventListener('mousemove', onPaint, false);

        }, false);

        canvas.addEventListener('mouseup', function () {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);

        var root = this;
        var onPaint = function () {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();

            if (root.timeout !== undefined) clearTimeout(root.timeout);
            root.timeout = setTimeout(function () {
                var base64ImageData = canvas.toDataURL("image/png");
                root.socket.emit("canvas-data", base64ImageData);
                console.log('canvas emit');
                console.log('this sockid : ' + root.socket.id);
                //console.log(root.socket);
            }, 500)
        };
    }

    render() {
        return (
            <div className="sketch" id="sketch">
                <canvas className="board" id="board"></canvas>
            </div>
        )
    }
}

export default Board