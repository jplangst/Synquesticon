import React from 'react'
import { DragLayer } from 'react-dnd'
import TaskItemComponentPreview from './TaskItemComponentPreview';
import EditTaskItemComponentPreview from './EditTaskItemComponentPreview';
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
  const { otherOffset, initialOffset, currentOffset } = props
  if (!otherOffset || !initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }

  let { x, y } = currentOffset
  x = x-props.item.width + otherOffset.x - initialOffset.x;

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
        return <EditTaskItemComponentPreview item={item}/>
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
  otherOffset: monitor.getInitialClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
}))(CustomDragLayer)
