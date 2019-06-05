import React from 'react'
import { DragLayer } from 'react-dnd'
import TaskItemComponentPreview from './TaskItemComponentPreview';

const Types = {
 ITEM: 'taskItemComp',
 REORDER: 'taskReorder',
}
const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
}
function getItemStyles(props) {
  const { initialOffset, currentOffset } = props
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }
  let { x, y } = currentOffset

  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}
const CustomDragLayer = props => {
  const { item, itemType, isDragging } = props
  function renderItem() {
    switch (itemType) {
      case Types.ITEM:
        return <TaskItemComponentPreview item={item}/>
      case Types.REORDER:
        return <TaskItemComponentPreview item={item}/>
      default:
        return null
    }
  }
  if (!isDragging) {
    return null
  }
  return (
    <div style={layerStyles}>
      <div style={getItemStyles(props)}>{renderItem()}</div>
    </div>
  )
}
export default DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
}))(CustomDragLayer)
