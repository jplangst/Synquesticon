import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';

class ResponsesDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responses: ""
    };
  }

  componentWillMount() {
    this.setState({
      responses: this.props.responses.toString()
    });
  }

  getResponses() {
    return this.state.responses.split(",");
  }

  render() {
    return (
      <TextField
        autoFocus
        label="Responses"
        placeholder="Type in the responses separated by commas"
        multiline
        className="textField"
        fullWidth
        margin="normal"
        variant="outlined"
        value={this.state.responses}
                  onChange={(e) => {this.setState({
                    responses: e.target.value
                  })}}
      />
    );
  }
}

export default ResponsesDialog;
