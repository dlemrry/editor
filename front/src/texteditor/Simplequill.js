import React, {useState, useRef, useEffect} from "react";
import ReactDOM from "react-dom";
import { useLocation } from "react-router-dom";
import ReactQuill, {Quill} from 'react-quill';
//import quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import Grid from "@material-ui/core/Grid";
import "./quill.css";
import socketIOClient from 'socket.io-client';
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Divider from '@material-ui/core/Divider';
import {socket} from './../socket'
const useStyles = makeStyles((theme) => ({

    quillbackground: {
        height: "100%",
        //padding: theme.spacing(2),
        backgroundColor:'white'
    },
    texteditor:{
        height: "80vh",
    },
    toolbar: {
        height: "100%",
        paddingLeft: theme.spacing(2),
        //padding: theme.spacing(2),
    },
    toolbarpaper:{
        height :'80%'
    }
}));


const Simplequill = (props) => {
    const classes = useStyles();
    const [value, setValue] = useState('');
    const [mounted, setmounted] = useState(0);
    const [quill, setQuill] = useState(null);
    //var socket;
    const elementRef = useRef(null);

    var initialcontents;
    var loc=useLocation();
    useEffect(() => {

    var file;

        //var socket;
        console.log('open texteditor');
        /*
        if(!props.socket){
             socket=socketIOClient("http://13.125.51.192:8000");
        }
        else{
            socket = props.socket;
        }
        */
        if(!loc.state){
            file='';
        }
        else{
            file=loc.state.file;
        }

        socket.emit('join-texteditor');



        const editor = new Quill("#editor", {
            theme: "snow",
            modules: {
                toolbar: [
                    ["bold", "italic", "underline", "strike"], // toggled buttons
                    ["blockquote", "code-block"],

                    [{header: 1}, {header: 2}], // custom button values
                    [{list: "ordered"}, {list: "bullet"}],
                    [{script: "sub"}, {script: "super"}], // superscript/subscript
                    [{indent: "-1"}, {indent: "+1"}], // outdent/indent
                    [{direction: "rtl"}], // text direction
                    ["link", "image", "video", "formula"],
                    [{size: ["small", false, "large", "huge"]}], // custom dropdown
                    [{header: [1, 2, 3, 4, 5, 6, false]}],

                    [{color: []}, {background: []}], // dropdown with defaults from theme
                    [{font: []}],
                    [{align: []}],

                    ["clean"] // remove formatting button
                ]
            }
        });

        socket.on('initial', (delta) => {
            initialcontents = delta;
            //console.log('init from server : ' + JSON.stringify(initialcontents));
            editor.setContents(initialcontents);
            console.log('initial contents : ' + JSON.stringify(editor.getContents()));
        });

        editor.on('text-change', function (delta, oldDelta, source) {
            if (source == 'api') {
                //console.log("An API call triggered this change.");
            } else if (source == 'user') {
                //console.log("A user action triggered this change.");
                //console.log(JSON.stringify(delta));
                socket.emit('send-delta', delta);
                socket.emit('updatecontents', editor.getContents());
                //console.log(socket.id)
            }
        }); // updatecontents only when source is from other clients


        socket.on('deltaupdate', (delta) => {
            console.log('delta received : ' + JSON.stringify(delta));
            editor.updateContents(delta);

        });



        return () => {
            console.log('leaving texteditor');
            socket.emit('leave-texteditor');

            //socket.disconnect();

        }
    }, []);
    //empty array in useEffect will make this effect render once


    //<div className="quillsize">
    //                     <ReactQuill ref={currenteditor} theme="snow" value={value} onChange={handlechange}/>
    //                 </div>
    return (


        <Grid container className={classes.texteditor}>

            <Grid container item justify="center" xs={9} className={classes.quillbackground}>
                <div className="quillsize">
                    <div id="editor" ref={elementRef}/>
                </div>
            </Grid>
            <Grid item xs={3} className={classes.toolbar}>
                <Paper elevation={6} className={classes.toolbarpaper}></Paper>
            </Grid>
        </Grid>

    );
}

export default Simplequill;