import React, { useState, useRef } from "react";
import { Card, Button, Form, Row, Col, Alert, Badge } from "react-bootstrap";
import { useFieldArray, Controller, useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";
import { Plus, Trash2, GripVertical, Edit3 } from "lucide-react";
import { toast } from "react-toastify";
import type { CreateQuestionData, QuestionType } from "../../types";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface QuestionEditorProps {
  control: Control<any>; // Control from the parent form
  name: string; // The name of the field array (e.g., "questions")
  templateTitle?: string; // Optional title for display
  onCancel?: () => void; // Optional cancel handler
}

interface QuestionItemProps {
  question: CreateQuestionData;
  index: number;
  control: Control<any>;
  remove: (index: number) => void;
  move: (dragIndex: number, hoverIndex: number) => void;
  watchedQuestions: CreateQuestionData[];
  questionTypeOptions: { value: QuestionType; label: string }[];
  typeCounts: Record<string, number>;
}

const ItemTypes = {
  QUESTION: "question",
};

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  index,
  control,
  remove,
  move,
  watchedQuestions,
  questionTypeOptions,
  typeCounts,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ItemTypes.QUESTION,
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50% of the height
      // When dragging upwards, only move when the cursor is above 50% of the height

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      move(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations, but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
      // Update the order property of the questions after a drag-and-drop operation
      const updatedQuestions = [...watchedQuestions];
      const [draggedItem] = updatedQuestions.splice(dragIndex, 1);
      updatedQuestions.splice(hoverIndex, 0, draggedItem);
      // You might need to call a function from the parent to update the form state
      // For now, we'll assume the `move` function from `useFieldArray` handles this.
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.QUESTION,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const [isEditing, setIsEditing] = useState(false);

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "SINGLE_LINE":
        return "📝";
      case "MULTI_LINE":
        return "📄";
      case "INTEGER":
        return "🔢";
      case "CHECKBOX":
        return "☑️";
      default:
        return "❓";
    }
  };

  const getQuestionTypeName = (type: string) => {
    const typeNames = {
      SINGLE_LINE: "Short Text",
      MULTI_LINE: "Long Text",
      INTEGER: "Number",
      CHECKBOX: "Checkbox",
    };
    return typeNames[type as keyof typeof typeNames] || type;
  };

  return (
    <Card
      ref={ref}
      className={`mb-3 question-card ${isDragging ? "dragging" : ""}`}
    >
      <Card.Body>
        {isEditing ? (
          // Edit Mode
          <div>
            <Form.Group className="mb-3">
              <Form.Label>Question Title *</Form.Label>
              <Controller
                name={`questions.${index}.title`}
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="Enter question title"
                    isInvalid={!!((control._formState.errors as any).questions?.[index] as any)?.title}
                  />
                )}
              />
              {((control._formState.errors as any).questions?.[index] as any)?.title && (
                <Form.Control.Feedback type="invalid" className="d-block">
                  {((control._formState.errors as any).questions?.[index] as any)?.title?.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description (Optional)</Form.Label>
              <Controller
                name={`questions.${index}.description`}
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    as="textarea"
                    rows={2}
                    placeholder="Enter question description"
                  />
                )}
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Question Type</Form.Label>
                  <Controller
                    name={`questions.${index}.type`}
                    control={control}
                    render={({ field }) => (
                      <Form.Select {...field}>
                        {questionTypeOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            disabled={
                              typeCounts[option.value] >= 4 &&
                              option.value !== watchedQuestions[index].type
                            }
                          >
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    )}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Label>Options</Form.Label>
                <div>
                  <Controller
                    name={`questions.${index}.isRequired`}
                    control={control}
                    render={({ field }) => (
                      <Form.Check
                        type="checkbox"
                        label="Required Question"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Controller
                    name={`questions.${index}.showInTable`}
                    control={control}
                    render={({ field }) => (
                      <Form.Check
                        type="checkbox"
                        label="Show in Results Table"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button
                variant="success"
                size="sm"
                onClick={() => {
                  if (watchedQuestions[index].title.trim()) {
                    setIsEditing(false);
                  } else {
                    // Optionally, show an error message or prevent saving
                    alert("Question title cannot be empty.");
                  }
                }}
                disabled={!watchedQuestions[index].title.trim()}
              >
                Save
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => remove(index)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ) : (
          // View Mode
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center mb-2">
                <GripVertical
                  size={20}
                  className="text-muted me-2 cursor-move"
                />
                <span className="me-2">
                  {getQuestionTypeIcon(question.type)}
                </span>
                <h6 className="mb-0">
                  {question.title || (
                    <span className="text-muted">Untitled Question</span>
                  )}
                </h6>
                {question.isRequired && (
                  <Badge bg="danger" className="ms-2">
                    Required
                  </Badge>
                )}
                {question.showInTable && (
                  <Badge bg="info" className="ms-1">
                    In Table
                  </Badge>
                )}
              </div>
              {question.description && (
                <p className="text-muted small mb-2">{question.description}</p>
              )}
              <Badge bg="secondary">{getQuestionTypeName(question.type)}</Badge>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 size={14} />
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => remove(index)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  control,
  name,
  templateTitle,
  onCancel,
}) => {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: name,
  });

  const watchedQuestions = useWatch({
    control,
    name: name,
  }) as CreateQuestionData[];

  const addQuestion = () => {
    const newQuestion: CreateQuestionData = {
      title: "",
      description: "",
      type: "SINGLE_LINE",
      showInTable: false,
      isRequired: false,
      // order will be set by the parent form's submission logic
    };

    // Check type limits before appending
    const currentTypeCounts = watchedQuestions.reduce((acc, q) => {
      acc[q.type] = (acc[q.type] || 0) + 1;
      return acc;
    }, {} as Record<QuestionType, number>);

    if (currentTypeCounts[newQuestion.type] >= 4) {
      toast.error(
        `You can only have up to 4 ${getQuestionTypeName(
          newQuestion.type
        )} questions.`
      );
      return;
    }

    append(newQuestion);
  };

  const getQuestionTypeName = (type: string) => {
    const typeNames = {
      SINGLE_LINE: "Short Text",
      MULTI_LINE: "Long Text",
      INTEGER: "Number",
      CHECKBOX: "Checkbox",
    };
    return typeNames[type as keyof typeof typeNames] || type;
  };

  const questionTypeOptions: { value: QuestionType; label: string }[] = [
    { value: "SINGLE_LINE", label: "Short Text" },
    { value: "MULTI_LINE", label: "Long Text" },
    { value: "INTEGER", label: "Number" },
    { value: "CHECKBOX", label: "Checkbox" },
  ];

  const typeCounts = watchedQuestions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as Record<QuestionType, number>);

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            {templateTitle ? `Questions for "${templateTitle}"` : "Questions"}
          </h5>
        </Card.Header>
        <Card.Body>
          {fields.length === 0 ? (
            <Alert variant="info" className="text-center">
              No questions added yet. Click "Add Question" to start.
            </Alert>
          ) : (
            <div className="mb-4">
              {fields.map((field, index) => (
                <QuestionItem
                  key={field.id}
                  index={index}
                  question={field as unknown as CreateQuestionData}
                  control={control}
                  remove={remove}
                  move={move}
                  watchedQuestions={watchedQuestions}
                  questionTypeOptions={questionTypeOptions}
                  typeCounts={typeCounts}
                />
              ))}
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <Button variant="outline-primary" onClick={addQuestion}>
              <Plus size={16} className="me-2" />
              Add Question
            </Button>
            <div className="d-flex gap-3 small text-muted">
              <span>📝 Short Text: {typeCounts["SINGLE_LINE"] || 0}/4</span>
              <span>📄 Long Text: {typeCounts["MULTI_LINE"] || 0}/4</span>
              <span>🔢 Number: {typeCounts["INTEGER"] || 0}/4</span>
              <span>☑️ Checkbox: {typeCounts["CHECKBOX"] || 0}/4</span>
            </div>
          </div>

          {onCancel && (
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </DndProvider>
  );
};
