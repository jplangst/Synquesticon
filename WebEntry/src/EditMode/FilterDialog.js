import React, { Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';

import { withTheme } from '@material-ui/styles';

import Button from '@material-ui/core/Button';

import db_helper from '../core/db_helper';

class FilterDialog extends Component {
  constructor(props){
    super(props);
    this.state = {
      filters: [],
      pickedFilters: props.filterObject.tagFilters ? props.filterObject.tagFilters: [],
      queryCombination: props.filterObject.queryCombination ? props.filterObject.queryCombination : "OR",
      filterType:null
    }

    if(this.props.filterType){
      db_helper.queryAllTagValuesFromDB(this.props.filterType, (type, result)=>{
        this.setState({filters:result.tags, filterType:this.props.filterType});
      });
    }
  }

  onOKAction() {
    //Callback to editor
    this.props.onFiltersUpdated(this.props.filterType, this.state.pickedFilters, this.state.queryCombination);
  }

  onCancelAction(){

    this.props.closeDialog();
  }

  onClearAction(){
    this.setState({pickedFilters:[]});
  }

  onPickFilter(filter) {
    //Since we can't mutate the state directly
    let filtersCopy = this.state.pickedFilters.slice();

    if(this.state.pickedFilters.includes(filter)){
      let index = this.state.pickedFilters.indexOf(filter);
      filtersCopy.splice(index, 1)
    }
    else{
      filtersCopy.push(filter);
    }

    this.setState({
      pickedFilters: filtersCopy
    });
  }

  onQueryCombinationChanged(queryType){
    this.setState({queryCombination: queryType});
  }

  render() {
    var buttonContainerHeight = 60;
    var buttonHeight = buttonContainerHeight - 4;

    let content = this.state.filters.map((filter, ind) => {
      let borderColor = this.state.pickedFilters.includes(filter)?"secondary":"default";
      return(
        <Button key={ind} style={{margin: 5, width:120, minWidth:0, minHeight:0, height: 60}} onClick={this.onPickFilter.bind(this,filter)}
          variant="outlined" color={borderColor}>
            {filter}
        </Button>
      )
    });

    return(
      <Dialog
          open={this.props.openDialog}
          onClose={this.onCancelAction.bind(this)}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth='md'
        >
          <DialogTitle style={{height:30}} id="form-dialog-title">{this.props.filterType.substring(0, this.props.filterType.length - 1)} Tags</DialogTitle>
          <DialogContent style={{display:'flex', flexDirection:'row',
                           minHeight:100, maxHeight:'90%', maxWidth:'100%', overflowY:'auto'}}>
            <div style={{width:'100%', height:'100%'}}>{ content }</div>
          </DialogContent>
          <DialogActions style={{height:buttonContainerHeight}}>
            <Typography variant="body1" color="textPrimary" align="center"
               style={{whiteSpace:"pre-line"}}>
               Query type
            </Typography>
            <Button style={{height:buttonHeight}} variant="outlined" color={this.state.queryCombination==="AND"?"secondary":"default"}
                onClick={this.onQueryCombinationChanged.bind(this, "AND")}>
              AND
            </Button>
            <Button style={{height:buttonHeight}} variant="outlined" color={this.state.queryCombination==="OR"?"secondary":"default"}
                onClick={this.onQueryCombinationChanged.bind(this, "OR")}>
              OR
            </Button>
            <div style={{flexGrow:1}}/>
            <Button style={{height:buttonHeight}} onClick={this.onCancelAction.bind(this)} variant="outlined">
              CANCEL
            </Button>
            <Button style={{height:buttonHeight}} onClick={this.onClearAction.bind(this)} variant="outlined">
              Clear
            </Button>
            <Button style={{height:buttonHeight}} onClick={this.onOKAction.bind(this)} variant="outlined">
              OK
            </Button>
          </DialogActions>
      </Dialog>
    );
  }
}

export default withTheme(FilterDialog);