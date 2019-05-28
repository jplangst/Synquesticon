import React from 'react';
import PropTypes from 'prop-types';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    //position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: 0,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearSearchIcon: {
    width: theme.spacing.unit * 9,
    right: '0%',
    top: 0,
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: {

  },
  inputRoot: {
    color: 'inherit',
    //backgroundColor: '#EEE',
    borderStyle: 'solid',
    borderWidth: 'thin',
    borderRadius: '15px',
    width: '100%',
    height: 'calc(100%-5px)',
    marginTop: '10px',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit * 8,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 8,
    transition: theme.transitions.create('width'),
    width: '100%',
    borderRadius: '15px',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
});

function ClearSearch(e, elementID, onChange){
  document.getElementById(elementID).value = "";
  onChange("");
}

function SearchAppBar(props) {
  const { classes } = props;
  return (
    <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase id={props.searchID} onChange={props.onChange} placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
        />
        <div className={classes.clearSearchIcon}>
          <ClearIcon className={classes.clearIcon} onClick={(e) => ClearSearch(e,props.searchID, props.onChange)}/>
        </div>
    </div>
  );
}

SearchAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchAppBar);
