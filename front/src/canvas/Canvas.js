import React, {useState} from 'react';
import { useLocation } from "react-router-dom";
import { withRouter ,useParams} from 'react-router-dom';
import Board from './Board';
import Paintertool from './Paintertool';
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import './../App.css';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
    painter: {
        height: "80vh",
        //padding: theme.spacing(2),
    },
    paintboard: {
        height: "100%",
        //padding: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    toolbar: {
        height: "100%",
        paddingLeft: theme.spacing(2),
        //padding: theme.spacing(2),
    },
    toolbarpaper:{
        padding:theme.spacing(2),
        height :'80%'
    }
}));


const Canvas = (props) => {

    //const {socket} = useParams();
    var loc=useLocation();
    var file;


    if(!loc.state){
        file='';
    }
    else{
        file=loc.state.file;
    }
    console.log('file name : '+ file)

    const classes = useStyles();
    const [color, setColor] = useState("#000000");
    const [size, setSize] = useState("3");

    return (
        <Grid container item className={classes.painter}>
            <Grid item justify="center" xs={9} className={classes.paintboard}>

                <Box border={1} className="board-Drawboard">
                    <Board color={color} size={size} ></Board>
                </Box>
            </Grid>
            <Grid item xs={3} className={classes.toolbar}>

                <Paper elevation={6} className={classes.toolbarpaper}>

                    <Paintertool size={size} color={color} setSize={setSize}
                                 setColor={setColor}/>
                </Paper>

            </Grid>
        </Grid>
    )

}


export default Canvas;
