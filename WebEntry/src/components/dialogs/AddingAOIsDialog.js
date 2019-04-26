import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';

class AddingAOIsDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AOIs: ""
    };
  }

  componentWillMount() {
    this.setState({
      AOIs: this.props.AOIs.toString()
    });
  }

  getAOIs() {
    return this.state.AOIs.split(",");
  }

  render() {
    return (
      <TextField
        autoFocus
        label="AOIs"
        placeholder="Type in the AOIs separated by commas"
        multiline
        className="textField"
        fullWidth
        margin="normal"
        variant="outlined"
        value={this.state.AOIs}
                  onChange={(e) => {this.setState({
                    AOIs: e.target.value
                  })}}
      />
    );
  }
}

export default AddingAOIsDialog;
