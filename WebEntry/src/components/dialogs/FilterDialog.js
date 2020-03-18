import React, { Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';

import { withTheme } from '@material-ui/styles';

import Button from '@material-ui/core/Button';

import db_helper from '../../core/db_helper';

import './BrowseImagesDialog.css';

class FilterDialog extends Component {
  constructor(props){
    super(props);
    this.queryType = props.queryType;
    this.state = {
      filters: [],
      pickedFilters: []
    }
  }

  componentWillMount() {
    /*db_helper.queryAllTagValuesFromDB(this.queryType) => (filters) {
      console.log(filters);
      this.setState({
        filters: filters
      });
    })*/
  }

  onOKAction() {
    //Callback to editor
    this.props.onFiltersUpdated(this.props.filterType, this.state.pickedFilters);
  }

  onPickFilter(filter) {
    //Since we can't mutate the state directly
    let filtersCopy = this.state.pickedFilters.slice();

    if(this.state.pickedFilters.includes(filter)){
      let index = this.state.pickedFilters.findIndex(filter);
      filtersCopy.splice(index, 1)
    }
    else{
      filtersCopy.push(filter);
    }

    this.setState({
      pickedFilters: filtersCopy
    });
  }

  render() {
    var buttonContainerHeight = 60;
    var buttonHeight = buttonContainerHeight - 4;
    var filterRow = [];
    var rowContent = [];

    return(
      <Dialog
          open={this.props.openDialog}
          onClose={this.props.closeDialog}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth='md'
        >
          <DialogTitle style={{height:30}} id="form-dialog-title">Select Image</DialogTitle>
          <DialogContent style={{display:'flex', flexDirection:'row', flexGrow:1, minHeight:100, maxHeight:'80%', overflowY:'auto'}}>
          {
            this.state.filters.map((filter, ind) => {
              var borderStyle=null;
              if (this.state.pickedFilters.includes(filter)) {
                borderStyle={borderWidth:3, borderStyle:'solid', borderColor:this.props.theme.palette.secondary.main};
              }

              rowContent.push(
                <Typography color="textPrimary" style={borderStyle} key={"filter"+ind}
                            onClick={(e) => this.onPickFilter(filter)}>
                            filter
                </Typography>
              );

              if(ind+1%4===0){
                filterRow.push(<span key={"ispan"+ind}>{rowContent}</span>);
                rowContent=[];
              }
              if(this.state.filters.length-1 === ind){
                if(rowContent.length > 0)
                  filterRow.push(<span key={"ispan"+ind}>{rowContent}</span>);
                return filterRow;
              }
              return null;
            })
          }
          </DialogContent>
          <DialogActions style={{height:buttonContainerHeight}}>
            <Button style={{height:buttonHeight}} onClick={this.props.closeDialog} variant="outlined">
              CANCEL
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
