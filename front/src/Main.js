import "./App.css";
import React, {useState} from "react";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import Box from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {ControlPointDuplicate} from "@material-ui/icons";
import logo1 from './static/logo1.png'
import Typography from '@material-ui/core/Typography';

var socket;

const useStyles = makeStyles((theme) => ({
    main: {
        height: "100%",
        //flexGrow:1,
        //backgroundColor:"yellow",
    },

}));

function Main() {
    const classes = useStyles();

    return (
        <Grid container justifyContent='center' >

            <Grid container  justifyContent='center' xs={9} >
                <img src={logo1}/>


            </Grid>
            <Grid item xs={9}>
                <br/><br/><br/><br/><br/><br/>
                <Typography variant="h3" gutterBottom align='left'>WHAT IS THIS</Typography>
                <Typography variant="h5" gutterBottom align='left'> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. </Typography>
                <br/><br/><br/><br/><br/><br/><br/><br/>
            </Grid>
        </Grid>
    )
        ;
}

export default Main;
