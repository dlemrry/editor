import React, {useState} from 'react';
//import io from 'socket.io-client';
//import socketIOClient from 'socket.io-client';

import socketIOClient from 'socket.io-client';
import Grid from "@material-ui/core/Grid";
import './boardstyle.css';
import {socket} from './../socket'

const Board2 = () => {


}


class Board extends React.Component {

    timeout;
    //socket;
    ctx;
    isDrawing = false;


    constructor(props) {
        super(props);


    }

    componentDidMount() {
        this.socket=socket;
        this.file=this.props.file;

        /*
        if(!this.props.socket){
            this.socket=socketIOClient("http://13.125.51.192:8000");
            setTimeout(()=>console.log('just made socket : ' + this.socket.id),2000)
        }
        else{
            this.socket=this.props.socket;
        }
*/
        this.drawOnCanvas();
        //this.socket= socketIOClient("http://13.125.51.192:8000");
        console.log(this.socket.id);


        this.socket.on("canvas-data", function (data) {
            console.log('canvas-data receive');
            //console.log(JSON.stringify(data));

            var root = this;

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
        console.log(JSON.stringify(this.file));
        console.log(JSON.stringify(this.props.file));
        console.log('mounted '+this.socket.id);
    }
    componentWillUnmount(){
            //this.socket.disconnect();

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
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));
        var mouse = {x: 0, y: 0};
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
                root.socket.emit("canvas-data", {image:base64ImageData, name:root.file.name});
                //root.socket.emit("canvas-data", base64ImageData);
                console.log('canvas emit');
                console.log('this sockid : ' + root.socket.id);
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