import React, { Component } from 'react';
import { withTheme } from '@material-ui/styles';

import Button from '@material-ui/core/Button';

/**
 * A file selector React component. Can be used to select files.
 * Props should contain: handleSelectionCallback.
 * The selected file is passed to the callback.
 */
export class FileSelector extends Component
{
    constructor(props: any)
    {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.onClickRedirector = this.redirectUploadClick.bind(this);
    }

    redirectUploadClick(){
      console.log("clicked");
      document.getElementById("dataaseImageUploadSelector").click();
    }

    handleChange(selectorFiles: FileList)
    {
      if(selectorFiles.length > 0){
        this.props.handleSelectionCallback(selectorFiles[0]);
      }
    }

    render ()
    {
      let theme = this.props.theme;

        return <div>
            <input style={{opacity:0,position:'absolute',pointerEvents:'none',width:'1px',height:'1px'}} type="file"
              accept="image/gif, image/jpeg, image/png" id="dataaseImageUploadSelector" onChange={ (e) => this.handleChange(e.target.files) } />
            <Button onClick={this.onClickRedirector} variant="outlined">Upload Image To Database</Button>
        </div>;
    }
}

export default withTheme(FileSelector);
