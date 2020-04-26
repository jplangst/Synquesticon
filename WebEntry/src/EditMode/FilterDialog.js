import React, { useState } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';

import { withTheme } from '@material-ui/styles';

import Button from '@material-ui/core/Button';

import db_helper from '../core/db_helper';

const FilterDialog = props => {
  const [filters, setFilters] = useState([]);
  const [pickedFilters, setPickedFilters] = useState(props.filterObject.tagFilters ? props.filterObject.tagFilters: []);
  const [queryCombination, setQueryCombination] = useState(props.filterObject.queryCombination ? props.filterObject.queryCombination : "OR");
  const [filterType, setFilterType] = useState(null);

  if(props.filterType){
    db_helper.queryAllTagValuesFromDB(props.filterType, (type, result)=>{
      setFilters(result.tags)
      setFilterType(props.filterType);
    });
  }

  const onOKAction = () => {
    //Callback to editor
    props.onFiltersUpdated(props.filterType, pickedFilters, queryCombination);
  }

  const onCancelAction = () => {
    props.closeDialog();
  }

  const onClearAction = () => {
    setPickedFilters([]);
  }

  const onPickFilter = filter => {
    //Since we can't mutate the state directly
    let filtersCopy = pickedFilters.slice();

    if(pickedFilters.includes(filter)){
      let index = pickedFilters.indexOf(filter);
      filtersCopy.splice(index, 1)
    } else{
      filtersCopy.push(filter);
    }

    setPickedFilters(filtersCopy);
  }

    const buttonContainerHeight = 60;
    const buttonHeight = buttonContainerHeight - 4;

    let content = filters.map((filter, ind) => {
      let borderColor = pickedFilters.includes(filter)?"secondary":"default";
      return(
        <Button key={ind} style={{margin: 5, width:120, minWidth:0, minHeight:0, height: 60}} onClick={onPickFilter.bind(this,filter)}
          variant="outlined" color={borderColor}>
            {filter}
        </Button>
      )
    });

    return(
      <Dialog
          open={props.openDialog}
          onClose={onCancelAction}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth='md'
        >
          <DialogTitle style={{height:30}} id="form-dialog-title">{props.filterType.substring(0, props.filterType.length - 1)} Tags</DialogTitle>
          <DialogContent style={{display:'flex', flexDirection:'row',
                           minHeight:100, maxHeight:'90%', maxWidth:'100%', overflowY:'auto'}}>
            <div style={{width:'100%', height:'100%'}}>{ content }</div>
          </DialogContent>
          <DialogActions style={{height:buttonContainerHeight}}>
            <Typography variant="body1" color="textPrimary" align="center"
               style={{whiteSpace:"pre-line"}}>
               Query type
            </Typography>
            <Button style={{height:buttonHeight}} variant="outlined" color={queryCombination==="AND"?"secondary":"default"}
                onClick={() => setQueryCombination("AND")}>
              AND
            </Button>
            <Button style={{height:buttonHeight}} variant="outlined" color={queryCombination==="OR"?"secondary":"default"}
                onClick={() => setQueryCombination("OR")}>
              OR
            </Button>
            <div style={{flexGrow:1}}/>
            <Button style={{height:buttonHeight}} onClick={onCancelAction} variant="outlined">
              CANCEL
            </Button>
            <Button style={{height:buttonHeight}} onClick={onClearAction} variant="outlined">
              Clear
            </Button>
            <Button style={{height:buttonHeight}} onClick={onOKAction} variant="outlined">
              OK
            </Button>
          </DialogActions>
      </Dialog>
    );
}

export default withTheme(FilterDialog);