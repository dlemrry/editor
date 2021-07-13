import React, {useState} from 'react';
import Board from './Board';
import Paintertool from './Paintertool';
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Grid";
import './canvas.css';


const Canvas = (props) => {

    const [color, setColor] = useState("#000000");
    const [size, setSize] = useState("5");

    return (
        <Grid container>
            <Grid container item justify="center" xs={9}>

                <Box border={1} className="board-Drawboard">
                    <Board color={color} size={size}></Board>
                </Box>
            </Grid>
            <Grid item xs={3}>
                toolbar

                <Paintertool  size={size} color={color} setSize={setSize}
                             setColor={setColor}/>


            </Grid>
        </Grid>
    )

}


export default Canvas;
