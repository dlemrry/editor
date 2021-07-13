import "./App.css";
import React, {useState} from "react";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import Box from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {ControlPointDuplicate} from "@material-ui/icons";

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

function Main() {


    return (
        <Grid container item>
            Choose editor
        </Grid>
    );
}

export default Main;
