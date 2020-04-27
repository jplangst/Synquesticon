import React, { useState, useEffect } from 'react';

import AOIComponent from './AOIComponent';

import './AOIEditorComponent.css';

const imageRef = React.createRef();

const AOIImageViewComponent = props => {

  const [imageWidth, setImageWidth] = useState(100);
  const [imageHeight, setImageHeight] = useState(100);
  const [imageElement, setImageElement] = useState(null);

  const onSelectAOI = aoi => {
    if (props.onSelectAOI !== undefined) {
      props.onSelectAOI(aoi);
    }
  }

  useEffect ( () =>  {
    let url = "/Images/" + props.imageName;
    if (props.image) {
      url = URL.createObjectURL(props.image);
      const img = document.createElement('img');
      img.src = url;
    }
  }, []);

  const handleImageLoaded = () => {
    const image = imageRef.current;
    setImageHeight(image.height);
    setImageWidth(image.width);
    setImageElement(image);
  }

  const tempAOI = props.mode !== "SELECT" ? <AOIComponent aoi={props.tempAOI}/> : null;
  let url = "/Images/" + props.imageName;
  if (props.image) {
    url = URL.createObjectURL(props.image);
  }

  let left = 0;
  if (imageElement) {
    left = parseInt(imageElement.offsetLeft);
  }

  return (
    <div className="imagePreviewContainer"
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onMouseMove={props.onMouseMove}>
      <img className="imageCanvas" src={url} alt="Task" ref={imageRef}
        onLoad={handleImageLoaded.bind(this)}/>
      <svg style={{left:left}} id="AOICanvas" className="AOICanvas" width={imageWidth} height={imageHeight} viewBox="0 0 100 100" preserveAspectRatio="none">
        {tempAOI}
        {props.aois.map((aoi, index) => {
          return <AOIComponent aoi={aoi} key={index} onSelected={e => onSelectAOI(aoi)}/>
        })}
      </svg>
    </div>
  );
}

export default AOIImageViewComponent;