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

  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.primary.main, 0.15),
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: 0,
    marginRight: 0,
    width: '100%',
    flexGrow: 1,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingLeft: 0,
      paddingRight: 0,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(2),
    color: theme.palette.text.primary,
    height: '100%',
    top: 0,
    left: theme.spacing(2),
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearSearchIcon: {
    width: theme.spacing(2),
    color: theme.palette.text.primary,
    right: theme.spacing(2),
    top: 0,
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    borderStyle: 'solid',
    borderWidth: 'thin',
    borderRadius: '15px',
    borderColor: 'grey',
    width: '100%',
    height: 'calc(100%-5px)',
    marginTop: '10px',
    display: 'relative'
  },
  inputInput: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(4),
    transition: theme.transitions.create('width'),
    width: '100%',
    borderRadius: '15px',
    color: theme.palette.text.primary,
    display: 'relative'
  },
});

const ClearSearch = (e, elementID, onChange) => {
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