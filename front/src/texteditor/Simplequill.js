import React, {useState, useRef, useEffect} from "react";
import ReactDOM from "react-dom";
import ReactQuill, {Quill} from 'react-quill';
//import quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import Grid from "@material-ui/core/Grid";
import "./quill.css";
import socketIOClient from 'socket.io-client';

const Simplequill = () => {
    const [value, setValue] = useState('');
    const [mounted, setmounted] = useState(0);
    const [quill, setQuill] = useState(null);
    var socket;
    const elementRef = useRef(null);


    //var tempquill = new Quill.Delta();
    /*var container = document.getElementById('.quillsize');
    var options = {
        debug: 'info',
        modules: {
            toolbar: '#toolbar'
        },
        placeholder: 'Compose an epic...',
        readOnly: true,
        theme: 'snow'
    };
    var tempquill = new Quill(container,options);
*/
    const currenteditor = useRef();
    //editor.getContents() 로 델타 얻음
    //onchange 에서 handler(content,delta,source,editor) 함수로
    var initialcontents;
    useEffect(() => {
        //var editor;

        console.log('open texteditor');
        const socket = socketIOClient("http://13.125.51.192:8000");
        //var initialcontents ;


        //if (!quill) {

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
        //setQuill(editor);

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


        });


        socket.on('deltaupdate', (delta) => {
            console.log('delta received : ' + JSON.stringify(delta));
            editor.updateContents(delta);

        });

        //}


        return () => {
            console.log('leaving texteditor');
            socket.disconnect();

        }
    }, []);
    //empty array in useEffect will render once


    //<div className="quillsize">
    //                     <ReactQuill ref={currenteditor} theme="snow" value={value} onChange={handlechange}/>
    //                 </div>
    return (


        <Grid container>

            <Grid container item justify="center" xs={9}>
                <div className="quillsize">
                    <div id="editor" ref={elementRef}/>
                </div>
            </Grid>
            <Grid item xs={3}>
                toolbar

            </Grid>
        </Grid>

    );
}

export default Simplequill;