import "./App.css";
import Texteditor from "./texteditor/Texteditor";
import React, {useState} from "react";
import Editorselector from "./Editorselector";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Drawboard from './canvas/Drawboard';
import Board from "./canvas/Board";
import {ControlPointDuplicate} from "@material-ui/icons";
import {BrowserRouter, Route} from 'react-router-dom';
import MyEditor from './texteditor/draft';


var socket;

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh",
        //flexGrow:1,
        //backgroundColor:"yellow",
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
    sidemenu: {
        backgroundColor: "#82F0F0	",
        height: "80%",

    },
    editorselector: {
        height: "10%",
        padding: theme.spacing(2),
        backgroundColor: "#82F0F0	",
    },
    plate: {
        height: "10%",
        padding: theme.spacing(2),
    },
    board: {},
    workarea: {
        padding: theme.spacing(2),

    },
    toolbar: {
        //flexGrow:1,
        padding: theme.spacing(2),
    },
}));

function App() {
    const classes = useStyles();

    const [currentEditor, setCurrentEditor] = useState('0');
    //0 : texteditor , 1: painter
    const [color, setColor] = useState("#000000");
    const [size, setSize] = useState("5");


    const changeeditor = (e) => {
        const buttonvalue = e.currentTarget.value;
        setCurrentEditor(buttonvalue);
        console.log(buttonvalue + ' selected')

        //console.log(socket);

    }

    return (
        <div>
            <Grid container className={classes.root} spacing={4}>
                <Grid item className={classes.plate} xs={12}>
                    Title
                </Grid>

                <Grid item className={classes.editorselector} xs={12}>
                    editorselector
                    <Button value={"0"} onClick={changeeditor} color="primary">
                        texteditor
                    </Button>
                    <Button value={"1"} onClick={changeeditor} color="primary">
                        painter
                    </Button>
                </Grid>

                <Grid item className={classes.sidemenu} xs={2}>
                    sidemenu
                </Grid>

                <Grid container className={classes.board} xs={10}>
                    <Grid item xs={9}>
                        workarea

                        {currentEditor === '0' ?
                            <MyEditor/>
                            :
                            <div>
                                <div className="board-Drawboard">
                                    <Board color={color} size={size}></Board>
                                </div>
                            </div>
                        }

                    </Grid>
                    <Grid item xs={3}>
                        toolbar
                        {currentEditor === '0' ?
                            <div>
                            </div>
                            :
                            <div>
                                <Drawboard currenteditor={currentEditor} size={size} color={color} setSize={setSize} setColor={setColor}/>
                            </div>
                        }
                    </Grid>

                </Grid>

            </Grid>
        </div>
    );
}

export default App;
