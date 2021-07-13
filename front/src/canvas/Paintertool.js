import React, {useState} from 'react';
import Board from './Board';
import Grid from "@material-ui/core/Grid";

import './paintertool.css';


const Paintertool = (props) => {

    const changeColor = (params) => {
        props.setColor(params.target.value);
    }

    const changeSize = (params) => {
        props.setSize(params.target.value);

    }

    return (
        <div className="Drawboard">
            <div className="tools-section">
                <div className="color-picker-Drawboard">
                    Select Brush Color : &nbsp;
                    <input type="color" value={props.color} onChange={changeColor.bind(this)}/>
                </div>

                <div className="brushsize-Drawboard">
                    Select Brush Size : &nbsp;
                    <select value={props.size} onChange={changeSize.bind(this)}>
                        <option> 5</option>
                        <option> 10</option>
                        <option> 15</option>
                        <option> 20</option>
                        <option> 25</option>
                        <option> 30</option>
                    </select>
                </div>

            </div>

        </div>
    )

}


export default Paintertool