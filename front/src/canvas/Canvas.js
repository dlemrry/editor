import React, {useState,useEffect} from 'react';
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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import {socket} from './../socket'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    painter: {
        height: "650px",
        //padding: theme.spacing(2),
    },
    paintboard: {
        height: "100%",
        //padding: theme.spacing(2),
        paddingRight: theme.spacing(2),
        backgroundColor: 'white'
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
    var file=new Object();
    var users = [];
    const [userlist, setuserlist] = useState(users);

    const classes = useStyles();
    const [color, setColor] = useState("#000000");
    const [size, setSize] = useState("3");
    const [filename, setfilename] = useState('');


    if(!loc.state){
        file.name='maincanvas';
        file.type='canvas';
    }
    else{
        file=loc.state.file;

    }



    useEffect(() => {


        setfilename(file.name);

        console.log('file name : '+ file.name)

        socket.emit('user-join',file);
        console.log('join painter');


        socket.on('user-update', (list) => {
            setuserlist(list)
            console.log('initial userlist : '+JSON.stringify(list));

        });

        /*
        socket.on('global-user-left', (id) => {

            let index = userlist.findIndex((element, index, arr) => element.id === id);
            //setuserlist delete
            console.log('before userlist :'+JSON.stringify(userlist));
            let templist = userlist;
            console.log('templist : '+JSON.stringify(templist));
            templist.splice(index, 1);
            //serlist.splice(index, 1);
            console.log('templist delete'+JSON.stringify(templist));
            setuserlist(templist);
            console.log(userlist);

        });
*/

        return () => {
            console.log('leaving painter');
            socket.emit('user-leave',file);
            socket.off("user-update");
            //socket.disconnect();

        }
    }, []);




    return (
        <Grid container item className={classes.painter}>

            <Grid item justify="center" xs={9} className={classes.paintboard}>
                <Grid item>
                    <Typography variant="h5" >{filename} </Typography>
                </Grid>

                <Box border={1} className="board-Drawboard">
                    <Board color={color} size={size} file={file} ></Board>
                </Box>
            </Grid>
            <Grid item xs={3} className={classes.toolbar}>

                <Paper elevation={6} className={classes.toolbarpaper}>

                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography variant="h5" align='center'>current users</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {userlist.map((user, index) => (

                                    <ListItem key={index} button>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={user.id}/>
                                    </ListItem>


                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>

                    <Paintertool size={size} color={color} setSize={setSize}
                                 setColor={setColor}/>
                </Paper>

            </Grid>
        </Grid>
    )

}


export default Canvas;
