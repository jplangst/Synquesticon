import React, { Component } from 'react';

import './ExportMode.css';

import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import { withTheme } from '@material-ui/styles';

import FileSaver from 'file-saver';

import store from '../core/store';

import db_helper from '../core/db_helper';

var GAZE_HEADER = "Timestamp(UTC),X,Y,Left pupil radius,Right pupil radius,Task,Target,database_id\n";

function HEADER(seperator) {
  var header = "global_vars" + seperator +
               "content" + seperator +
               "answer" + seperator +
               "answered_correctly" + seperator +
               "correct_answer" + seperator +
               "accepted_margin" + seperator +
               "time_to_first_response" + seperator +
               "time_to_completion" + seperator +
               "comments" + seperator +
               "tags" + seperator +
               "type" + seperator +
               "set_names" + seperator +
               "timestamp_start" + seperator +
               "timestamp_first_response" + seperator +
               "clicked_points" + seperator +
               "database_id\n"; //Note the \n in case more fields are added later
   return header;
 }

class ExportMode extends Component {
  constructor(props){
    super(props);
    this.state = {
      participants: [],
      delimiter: ',',
      combineFiles: false
    };
    this.pickedParticipants = [];
  }

  componentWillMount() {
    db_helper.getAllParticipantsFromDb((ids) => {
      this.setState({
        participants: ids
      });
    });
    /*db_helper.getAllObserverMessagesFromDb((msgs) => {
      /*console.log("all comments", msgs);*/
    //});
  }

  componenWillUnmount() {
    this.pickedParticipants = [];
  }

  onCombineFilesChange() {
    this.setState({
      combineFiles: !this.state.combineFiles
    });
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

  async handleExport() {
    if(this.pickedParticipants.length>0){
      var snackbarAction = {
        type: 'TOAST_SNACKBAR_MESSAGE',
        snackbarOpen: true,
        snackbarMessage: "Exporting selected data sets"
      };
      store.dispatch(snackbarAction);
    }

    console.log("delimiter", this.state.delimiter);
    var exported_csv = "";
    var exported_gaze = "";
    var first_file = false;
    var file_name = "";
    await Promise.all(this.pickedParticipants.map(async (p, index) => {
      var data = {
        participant: p,
        delimiter: this.state.delimiter
      };


      var returnedValue = await db_helper.exportToCSV(data);
      if (this.state.combineFiles) {
        if (!first_file) {
          file_name = "combined_" + returnedValue.file_name;
          first_file = true;
        }

        exported_csv += returnedValue.csv_string;

        if (returnedValue.gaze_data !== undefined && returnedValue.gaze_data) {
          exported_gaze += returnedValue.gaze_data;
        }
      }

      else {
        var blob = new Blob([HEADER(this.state.delimiter) + returnedValue.csv_string], {type: 'text/csv'});
        FileSaver.saveAs(blob, returnedValue.file_name + '.csv');

        if (returnedValue.gaze_data !== undefined && returnedValue.gaze_data) {
          var gaze_blob = new Blob([GAZE_HEADER + returnedValue.gaze_data], {type: 'text/csv'});
          FileSaver.saveAs(gaze_blob, returnedValue.file_name + '_gaze.csv');
        }
      }
      return 1;
    }));

    if (this.state.combineFiles) {
      var blob = new Blob([HEADER(this.state.delimiter) + exported_csv], {type: 'text/csv'});
      FileSaver.saveAs(blob, file_name + '.csv');

      if (this.state.combineFiles && exported_gaze !== "") {
        var gaze_blob = new Blob([GAZE_HEADER + exported_gaze], {type: 'text/csv'});
        FileSaver.saveAs(gaze_blob, file_name + '_gaze.csv');
      }
    }

    this.handleClose();
  }

  handleExportAll() {
    var snackbarAction = {
      type: 'TOAST_SNACKBAR_MESSAGE',
      snackbarOpen: true,
      snackbarMessage: "Exporting all data sets"
    };
    store.dispatch(snackbarAction);

    if (this.state.combineFiles) {
      var data = {
        participants: this.state.participants,
        delimiter: this.state.delimiter
      }

      db_helper.exportManyToCSV(data, (res) => {
        var blob = new Blob([res.data.csv_string], {type: 'text/csv'});
        FileSaver.saveAs(blob, res.data.file_name + '.csv');
        if (res.data.gaze_data !== undefined) {
          var gaze_blob = new Blob([res.data.gaze_data], {type: 'text/csv'});
          FileSaver.saveAs(gaze_blob, res.data.file_name + '_gaze.csv');
        }
        this.handleClose();
        return 1;
      });
    }

    else {
      this.state.participants.map((p, ind) => {
        var data = {
          participant: p,
          delimiter: this.state.delimiter
        };
        db_helper.exportToCSV(data, (res) => {
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
      });
    }
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

    p.globalVariables.sort((a, b) => a.label.localeCompare(b.label));

    for (let i = 0; i < p.globalVariables.length; i++) {
      /*header += p.globalVariables[i].label + ",";*/
      if (!p.globalVariables[i].label.toLowerCase().includes("record data")) {
        file_name += p.globalVariables[i].label + '-' + p.globalVariables[i].value + '_';
      }
    }

    if (file_name.length > 0) {
      file_name = file_name.slice(0, -1);
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

          <FormControlLabel label="Combine files"
            value="combineFiles"
            checked={this.state.combineFiles}
            control={<Checkbox color="secondary" />}
            onChange={this.onCombineFilesChange.bind(this)}
            labelPlacement="end"
            style={{marginLeft:10}}
          />
          <TextField label="Delimiter"
            required
            style={{width:100}}
            id="delim"
            defaultValue={this.state.delimiter}
            placeholder=","
            ref="delimiterRef"
            variant="filled"
            onChange={(e)=>{this.setState({delimiter: e.target.value}) }} //state.delimiter = e.target.value
          />

          <Button style={{height:buttonHeight, marginLeft:20}} onClick={this.handleExport.bind(this)} variant="outlined">
            Export
          </Button>

          <Button style={{height:buttonHeight, marginLeft:20}} onClick={this.handleDeleteSelected.bind(this)} variant="outlined">
            Delete
          </Button>
        </div>
      </div>)
    }
}
export default withTheme(ExportMode);
