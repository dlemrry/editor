import React, {useState} from 'react';
import Board from './Board';
import Grid from "@material-ui/core/Grid";
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import './paintertool.css';


const useStyles = makeStyles({
    root: {
        width: 250,
    },
    input: {
        width: 42,
    },
    margin: {
        height: 30
    },
});


const Paintertool = (props) => {

    const classes = useStyles();
    const [value, setValue] = useState(3);

    const handleSliderChange = (event, newvalue) => {
        setValue(newvalue);
        props.setSize(newvalue);
    };

    const handleInputChange = (event, newvalue) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
        props.setSize(value);
    };

    const handleBlur = () => {
        if (value < 0) {
            setValue(0);
        } else if (value > 50) {
            setValue(50);
        }
    };


    const changeColor = (params) => {
        props.setColor(params.target.value);
    }


    return (

        <div className="tools-section">


            <div className="slider">

                <Typography id="input-slider" gutterBottom>
                    pen attribute
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        size
                    </Grid>
                    <Grid item xs>
                        <Slider
                            max={50}
                            min={1}
                            value={typeof value === 'number' ? value : 3}
                            onChange={handleSliderChange}

                            aria-labelledby="input-slider"
                        />
                    </Grid>

                    <Grid item>
                        <Input
                            className={classes.input}
                            value={value}
                            margin="dense"
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            inputProps={{
                                step: 1,
                                min: 1,
                                max: 50,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                    </Grid>
                </Grid>
                <div className={classes.margin} />
                <Grid container item className="colorpicker" spacing={3}>
                    <Grid item >
                        Color
                    </Grid>
                    <Grid item >
                        <input type="color" value={props.color} onChange={changeColor.bind(this)}/>
                    </Grid>
                </Grid>
            </div>
        </div>

    )

}


export default Paintertool