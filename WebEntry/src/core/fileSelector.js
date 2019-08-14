import * as React from "react";

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
        return <div>
            <input type="file" filename="testing" accept="image/gif, image/jpeg, image/png" onChange={ (e) => this.handleChange(e.target.files) } />
        </div>;
    }
}

export default FileSelector;
