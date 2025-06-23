import { useCallback } from "react";

interface Question {
  id: string;
  // Add other question properties as needed
}

export const useDragAndDrop = (
  questions: Question[],
  updateTemplate: (updates: any) => void
) => {
  const moveQuestion = useCallback(
    (dragIndex: number, dropIndex: number) => {
      const newQuestions = [...questions];
      const draggedQuestion = newQuestions[dragIndex];

      // Remove the dragged item
      newQuestions.splice(dragIndex, 1);
      // Insert it at the new position
      newQuestions.splice(dropIndex, 0, draggedQuestion);

      updateTemplate({ questions: newQuestions });
    },
    [questions, updateTemplate]
  );

  return {
    moveQuestion,
  };
};

// Alternative: Individual question drag and drop hook
// Use this if you want to implement drag and drop for individual question components
export const useQuestionDragAndDrop = (
  index: number,
  id: string,
  moveItem: (dragIndex: number, dropIndex: number) => void
) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: "question",
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover: (item: DragItem, monitor: DropTargetMonitor) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset?.y || 0) - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "question",
    item: () => ({ id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return {
    ref,
    isDragging,
    handlerId,
  };
};
