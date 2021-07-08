import "./App.css";
import Texteditor from "./texteditor/Texteditor";
import React from "react";
import Editorselector from "./Editorselector";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Drawboard from './canvas/Drawboard';
import { ControlPointDuplicate } from "@material-ui/icons";

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
  plate:{
    height:"10%",
    padding: theme.spacing(2),
  },
  board:{
    
  },
  workarea:{
    padding: theme.spacing(2),
    
  },
  toolbar:{
    //flexGrow:1,
    padding: theme.spacing(2),
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div>
      <Grid container className={classes.root} spacing={4}>
        <Grid item className={classes.plate} xs={12}>
          Title
        </Grid>

        <Grid item className={classes.editorselector} xs={12}>
          editorselector
          <Editorselector />
        </Grid>

        <Grid item className={classes.sidemenu} xs={2}>
          sidemenu
        </Grid>
        
        <Grid container className={classes.board} xs={10}>
          <Grid item  xs={9}>
            workarea
            <Drawboard/>
          </Grid>
          <Grid item  xs={3}>
            toolbar
          </Grid>
          
        </Grid>

      </Grid>
    </div>
  );
}

export default App;
