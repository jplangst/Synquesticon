import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';

import ExportationIcon from '@material-ui/icons/Archive';

import { withTheme } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

import db_helper from '../../core/db_helper';
import courier from '../../core/courier';

class DataExportationComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
      participants: []
    };
    this.pickedParticipants = [];
  }

  componentWillMount() {
    db_helper.getAllParticipantsFromDb((ids) => {
      this.setState({
        participants: ids
      });
    });
    db_helper.getAllObserverMessagesFromDb((msgs) => {
      console.log("all comments", msgs);
    })
  }

  /*handleDeleteSelected() {
    if(this.pickedParticipants.length>0){
      //
      Promise.all(this.pickedParticipants.map(p => db_helper.deleteParticipantFromDb(p._id, ()=>{return Promise.resolve('ok');})));
      this.pickedParticipants = [];

      //Update the list after the deletion have been completed
      db_helper.getAllParticipantsFromDb((ids) => {
        this.setState({
          participants: ids
        });
      });

    }
  }*/

  async handleDeleteSelected() {
    if(this.pickedParticipants.length>0){

      /*this.pickedParticipants.map( p =>
         db_helper.deleteParticipantFromDbPromise(p._id)
      );*/

      for (var i = 0; i < this.pickedParticipants.length; i++) {
        await db_helper.deleteParticipantFromDbPromise(this.pickedParticipants[i]._id);
      }

      this.pickedParticipants = [];

      //Update the list after the deletion have been completed
      db_helper.getAllParticipantsFromDb((ids) => {
        this.setState({
          participants: ids
        });
      });
    }
  }

  handleDeleteAll() {
    db_helper.deleteAllParticipantsFromDb(() => {
      db_helper.getAllParticipantsFromDb((ids) => {
        this.setState({
          participants: ids
        });
      })
    });
  }

  handlePick() {

  }

  handleExport() {
    this.pickedParticipants.map((p, index) => {
      courier.exportToCSV(p, (s) => {
        alert(s);
        this.handleClose();
      });
      return 1;
    });
  }

  handleExportAll() {
    courier.exportAllToCSVs((s) => {
      this.handleClose();
      alert(s);
    })
  }

  handleClose() {
    this.pickedParticipants = [];
    this.setState({
      open: false
    });
  }

  onDataExportationButtonClicked() {
    if (!this.state.open) {
      this.setState({
        open: true
      });
    }
  }

  getParticipantName(p) {
    if (p.globalVariables.length <= 0) {
      return "Anonymous";
    }

    var name = p.globalVariables[0].label + "_" + p.globalVariables[0].value;
    for (var i = 1; i < p.globalVariables.length; i++) {
      name += ("-" + p.globalVariables[i].label + "_" + p.globalVariables[i].value);
    }
    return name;
  }

  render() {
    var deleteAllButton = null;
    //<Button onClick={this.handleDeleteAll.bind(this)} variant="outlined">
    //  Delete All
    //</Button>

    //<div style={{height:'100%'}}>

    return(
        <Button style={this.props.exportButtonStyle} onClick={this.onDataExportationButtonClicked.bind(this)} >
          <ExportationIcon fontSize="large" />
          <Dialog open={this.state.open} onClose={this.handleClose.bind(this)}>
            <DialogTitle>Choose an experiment to export</DialogTitle>
            <List>
              {this.state.participants.map((p, index) => {
                if(this.pickedParticipants.includes(p)){
                  return(<ListItem selected button onClick={() => {
                      if (this.pickedParticipants.includes(p)) {
                        this.pickedParticipants.splice(this.pickedParticipants.indexOf(p),1);
                      }
                      else {
                        this.pickedParticipants.push(p);
                      }
                      this.forceUpdate();

                    }} key={index} >
                    <Typography color="textSecondary">{this.getParticipantName(p)}</Typography>
                  </ListItem>);
                }else{
                  return(
                    <ListItem button onClick={() => {
                        if (this.pickedParticipants.includes(p)) {
                          this.pickedParticipants.splice(this.pickedParticipants.indexOf(p),1);
                        }
                        else {
                          this.pickedParticipants.push(p);
                        }
                        this.forceUpdate();

                      }} key={index} >
                      <Typography color="textPrimary">{this.getParticipantName(p)}</Typography>
                    </ListItem>
                  );
                }
              })}
            </List>
            <DialogActions>
              <Button onClick={this.handleClose.bind(this)} variant="outlined">
                Cancel
              </Button>
              <Button onClick={this.handleExport.bind(this)} variant="outlined">
                Export Selected
              </Button>
              <Button onClick={this.handleExportAll.bind(this)} variant="outlined">
                Export All
              </Button>
              <div style={{width:50}} />
              <Button onClick={this.handleDeleteSelected.bind(this)} variant="outlined">
                Delete Selected
              </Button>
              {deleteAllButton}
            </DialogActions>
          </Dialog>
        </Button>
    );
  }
}

export default withTheme(DataExportationComponent);
