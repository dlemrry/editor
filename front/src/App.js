import "./App.css";

import logo2 from './static/logo2.png'
import React, {useState,useEffect} from "react";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import Box from "@material-ui/core/Paper";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Canvas from './canvas/Canvas';
import Board from "./canvas/Board";
import Main from "./Main";
import {ControlPointDuplicate} from "@material-ui/icons";
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import MyEditor from './texteditor/MyEditor';
import Simplequill from './texteditor/Simplequill';
import DescriptionIcon from '@material-ui/icons/Description';
import BrushIcon from '@material-ui/icons/Brush';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Typography from '@material-ui/core/Typography';
import socketIOClient from 'socket.io-client';
import {socket} from './socket'
//var socket;

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100%",
        //flexGrow:1,
        backgroundColor: "#d3d3d3",
    },
    leftpaper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
        height: '80%'
    },
    sidemenu: {
        //backgroundColor: "#F6F6F6 ",
        height: "90vh",
        padding: theme.spacing(2),
        paddingLeft: theme.spacing(4)

    },
    editorroot: {
        height: "90%",
        padding: theme.spacing(2),
    },
    plate: {
        height: "10%",
        padding: theme.spacing(2),
    },
    toolbar: {
        //flexGrow:1,
        //padding: theme.spacing(2),
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
    },
    drawerbutton: {},
}));

//var socket;

function App() {


    const classes = useStyles();

    useEffect(() => {

        if(!socket) {
            socket = socketIOClient("http://13.125.51.192:8000");
            setTimeout(()=>console.log('user join : '+ socket.id),2000);
        }

    }, []);


    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({...state, [anchor]: open});
    };

    const list = (anchor) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <ListItem button component={Link} to="/">
                    <ListItemIcon> <img src={logo2}/> </ListItemIcon>
                </ListItem>
                <br/><br/><br/>
                <Typography variant="subtitle1" align='center'> Choose editor </Typography>
                <br/>
            </List>
            <Divider/>
            <List>
                <ListItem button component={Link} to={{
                    pathname: "/editor",
                    state:{
                        file :'aaa'
                    }
                }
                }>
                    <ListItemIcon> <DescriptionIcon/> </ListItemIcon>
                    <ListItemText primary='text editor'/>
                </ListItem>
                <ListItem button component={Link} to={{
                    pathname: "/canvas",
                    state:{
                       file :'aaa'
                    }
                }
                }>
                    <ListItemIcon> <BrushIcon/> </ListItemIcon>
                    <ListItemText primary='painter'/>
                </ListItem>

            </List>
        </div>
    );

    return (
        <Grid container className={classes.root} alignItems="flex-start">


            <BrowserRouter>
                <Grid item className={classes.plate} xs={12}>
                    <Link to="/">
                        <Button color="primary">
                            <img src={logo2}/>
                        </Button>
                    </Link>
                </Grid>

                <Grid item xs={2} className={classes.sidemenu}>
                    <Paper elevation={6} className={classes.leftpaper}>


                        <Grid container item justifyContent='flex-end'>
                            {['left'].map((anchor) => (
                                <React.Fragment key={anchor}>
                                    <Button onClick={toggleDrawer(anchor, true)}>
                                        <MenuIcon/> </Button>
                                    <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                                        {list(anchor)}
                                    </Drawer>
                                </React.Fragment>
                            ))}
                        </Grid>
                        <Divider/>
                        <Grid item justifyContent='center'>
                            <Typography variant="h5" gutterBottom align='center'> current drafts </Typography>
                            <Typography variant="subtitle1" align='center'> you can create or </Typography>
                            <Typography variant="subtitle1" align='center'> load existing documents </Typography>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={9} className={classes.editorroot}>


                    <Switch>
                        <Route path="/" exact component={Main}></Route>
                        <Route path="/editor" exact component={Simplequill} />
                        <Route path="/canvas" exact  component={Canvas} />

                    </Switch>


                </Grid>
            </BrowserRouter>
        </Grid>
    );
}

export default App;
