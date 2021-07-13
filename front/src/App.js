import "./App.css";
import Texteditor from "./texteditor/Texteditor";
import React, {useState} from "react";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import Box from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Canvas from './canvas/Canvas';
import Board from "./canvas/Board";
import Main from "./Main";
import {ControlPointDuplicate} from "@material-ui/icons";
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import MyEditor from './texteditor/draft';
import socketIOClient from 'socket.io-client';

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
/*
    const [currentEditor, setCurrentEditor] = useState('0');
    //0 : texteditor , 1: painter


    const changeeditor = (e) => {
        const buttonvalue = e.currentTarget.value;
        setCurrentEditor(buttonvalue);
        console.log(buttonvalue + ' selected')

        //console.log(socket);

    }
*/

    return (
        <Grid container className={classes.root} spacing={4}>
            <BrowserRouter>
                <Grid item className={classes.plate} xs={12}>
                    <Link to="/">
                        <Button color="primary">
                            Title
                        </Button>
                    </Link>
                </Grid>

                <Grid item className={classes.editorselector} xs={12}>
                    editorselector
                    <Link to="/editor">
                        <Button color="primary">
                            texteditor
                        </Button>
                    </Link>

                    <Link to="/canvas">
                        <Button color="primary">
                            painter
                        </Button>
                    </Link>

                </Grid>

                <Grid item className={classes.sidemenu} xs={2}>
                    sidemenu
                </Grid>

                <Grid container item className={classes.board} xs={10}>


                    <Switch>
                        <Route path="/" exact component={Main}></Route>
                        <Route path="/editor" exact component={MyEditor}></Route>
                        <Route path="/canvas" exact component={Canvas}></Route>
                    </Switch>


                </Grid>
            </BrowserRouter>
        </Grid>
    );
}

export default App;
