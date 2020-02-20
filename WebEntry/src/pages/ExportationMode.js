import React, { Component } from 'react';

import './ExportationMode.css';

import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import { withTheme } from '@material-ui/styles';

import FileSaver from 'file-saver';

import store from '../core/store';

import db_helper from '../core/db_helper';

class ExportationMode extends Component {
  constructor(props){
    super(props);
    this.state = {
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
      /*console.log("all comments", msgs);*/
    })
  }

  componenWillUnmount() {
    this.pickedParticipants = [];
  }

  async handleDeleteSelected() {
    if(this.pickedParticipants.length>0){
      var snackbarAction = {
        type: 'TOAST_SNACKBAR_MESSAGE',
        snackbarOpen: true,
        snackbarMessage: "Deleting data sets"
      };
      store.dispatch(snackbarAction);


      //Delete each selection synchronously
      for (var i = 0; i < this.pickedParticipants.length; i++) {
        await db_helper.deleteParticipantFromDbPromise(this.pickedParticipants[i]._id);
      }

      //Empty the user selection
      this.pickedParticipants = [];

      //Update the list after the deletion have been completed
      db_helper.getAllParticipantsFromDb((ids) => {
        var snackbarAction = {
          type: 'TOAST_SNACKBAR_MESSAGE',
          snackbarOpen: true,
          snackbarMessage: "Deletion completed"
        };
        store.dispatch(snackbarAction);
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

  handleClose() {

  }

  handleExport() {
    this.pickedParticipants.map((p, index) => {
      db_helper.exportToCSV(p, (res) => {
        var blob = new Blob([res.data.csv_string], {type: 'text/csv'});
        FileSaver.saveAs(blob, res.data.file_name + '.csv');
        if (res.data.gaze_data !== undefined) {
          var gaze_blob = new Blob([res.data.gaze_data], {type: 'text/csv'});
          FileSaver.saveAs(gaze_blob, res.data.file_name + '_gaze.csv');
        }
        this.handleClose();
      });
      return 1;
    });
  }

  handleExportAll() {
    this.state.participants.map((p, ind) => {
      db_helper.exportToCSV(p, (res) => {
        var blob = new Blob([res.data.csv_string], {type: 'text/csv'});
        FileSaver.saveAs(blob, res.data.file_name + '.csv');
        if (res.data.gaze_data !== undefined) {
          var gaze_blob = new Blob([res.data.gaze_data], {type: 'text/csv'});
          FileSaver.saveAs(gaze_blob, res.data.file_name + '_gaze.csv');
        }
        this.handleClose();
        return 1;
      });
      return 1;
    })
  }

  formatDateTime(t) {
    var d = new Date(t);
    var fillZero = (num) => {
      if (num < 10) {
        return '0' + num;
      }
      else {
        return num;
      }
    }
    var datestring = d.getFullYear() + '-' + fillZero(d.getMonth() + 1) + '-' + fillZero(d.getDate())
                      + '_' + fillZero(d.getHours()) + ':' + fillZero(d.getMinutes());
    return datestring;
  }

  getParticipantName(p) {
    if (!p.linesOfData || p.linesOfData.length <= 0 || p.globalVariables.length <= 0) {
      return "Anonymous";
    }

    // var name = p.globalVariables[0].label + "_" + p.globalVariables[0].value;
    // for (var i = 1; i < p.globalVariables.length; i++) {
    //   name += ("-" + p.globalVariables[i].label + "_" + p.globalVariables[i].value);
    // }

    var file_name = "";

    if(p.linesOfData && p.linesOfData.length > 0){
      file_name = this.formatDateTime(p.linesOfData[0].startTimestamp) + '_';
      file_name += p.linesOfData[0].tasksFamilyTree[0] + '_';
    }

    for (let i = 0; i < p.globalVariables.length; i++) {
      /*header += p.globalVariables[i].label + ",";*/
      if (!p.globalVariables[i].label.toLowerCase().includes("record data")) {
        file_name += p.globalVariables[i].label + '-' + p.globalVariables[i].value + '_';
      }
    }

    return file_name;
  }

  render(){
    let theme = this.props.theme;
    let exportationBG = theme.palette.type === "light" ? theme.palette.primary.main : theme.palette.primary.dark;
    var buttonHeight = 50;

    return(
      <div className="ExportationModeContainer" style={{backgroundColor:exportationBG}}>
        <List style={{display:'flex', flexDirection:'column', flexGrow:1, width:'100%', minHeight:100, maxHeight:'calc(100% - 100px)', overflowY:'auto', overflowX:'hidden'}}>
          {this.state.participants.map((p, index) => {
            if(this.pickedParticipants.includes(p)){
              return(<ListItem style={{borderBottom:'grey solid 1px'}} selected button onClick={() => {
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
                <ListItem style={{borderBottom:'grey solid 1px'}} button onClick={() => {
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
        <div className="ExportationActions">
          <Typography variant="body1" color="textPrimary"> {this.pickedParticipants.length} data sets selected </Typography>
          <Button style={{height:buttonHeight, marginLeft:20}} onClick={this.handleExport.bind(this)} variant="outlined">
            Export Selected
          </Button>
          <Button style={{height:buttonHeight, marginLeft:20}} onClick={this.handleExportAll.bind(this)} variant="outlined">
            Export All
          </Button>
          <Button style={{height:buttonHeight, marginLeft:20}} onClick={this.handleDeleteSelected.bind(this)} variant="outlined">
            Delete Selected
          </Button>
        </div>
      </div>)
    }
}
export default withTheme(ExportationMode);
