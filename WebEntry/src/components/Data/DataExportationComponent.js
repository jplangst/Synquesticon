import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';

import ExportationIcon from '@material-ui/icons/Archive';


import db_helper from '../../core/db_helper';
import courier from '../../core/courier';

import './DataExportationComponent.css';

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
    if (this.pickedParticipants.length != 0) {
      //TODO
      courier.exportToCSV(this.pickedParticipants[0], (s) => {
        alert(s);
        this.handleClose();
      });
    }


  }

  handleExportAll() {
    courier.exportAllToCSVs((s) => {
      this.handleClose();
      alert(s);
    })
  }

  handleClose() {
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
    return(
      <div>
        <Button onClick={this.onDataExportationButtonClicked.bind(this)} >
          <ExportationIcon/>
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose.bind(this)}>
          <DialogTitle>Choose an experiment to export</DialogTitle>
          <List>
            {this.state.participants.map((p, index) => {
              return(
              <ListItem button onClick={() => {
                  // if (this.pickedParticipants.includes(p)) {
                  //   this.pickedParticipants.splice(this.pickedParticipants.indexOf(p));
                  // }
                  // else {
                    this.pickedParticipants.push(p);
                  // }

                }} key={index} >
                {this.getParticipantName(p)}
              </ListItem>
            );
            })}
          </List>
          <DialogActions>
            <Button onClick={this.handleDeleteAll.bind(this)} color="primary">
              Delete All
            </Button>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleExport.bind(this)} color="primary">
              Export
            </Button>
            <Button onClick={this.handleExportAll.bind(this)} color="primary">
              Export All
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DataExportationComponent;
