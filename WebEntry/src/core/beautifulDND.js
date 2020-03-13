// a little function to help us with reordering the result
export const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
export const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);

    //const [removed] = sourceClone.splice(droppableSource.index, 1);

    const draggedObject = sourceClone[droppableSource.index];

    destClone.splice(droppableDestination.index, 0, draggedObject);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

export function getItemStyle(snapshot, draggableStyle, bgColor, highlightColor, noDropAnim){
    return {...draggableStyle,
            userSelect: 'none',
            // change background colour if dragging
            background: snapshot.isDragging ? highlightColor : bgColor,};
}

export const getListStyle = isDraggingOver => ({
    //background: isDraggingOver ? 'lightblue' : 'lightgrey',
    //padding: grid,
    //width: 250
});
