import * as React from "react";
import { withTheme } from '@material-ui/styles';

/**
 * A file selector React component. Can be used to select files.
 * Props should contain: handleSelectionCallback.
 * The selected file is passed to the callback.
 */
export class FileSelector extends React.Component<undefined, undefined>
{
    constructor(props: any)
    {
        super(props);
        this.handleChange = this.handleChange.bind(this);
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
            <input style={{color:theme.palette.text.primary}} type="file" filename="testing"
              accept="image/gif, image/jpeg, image/png" onChange={ (e) => this.handleChange(e.target.files) } />
        </div>;
    }
}

export default withTheme(FileSelector);
