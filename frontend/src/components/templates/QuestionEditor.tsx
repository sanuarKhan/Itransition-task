import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  Form,
  Button,
  Alert,
  Badge,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Plus,
  GripVertical,
  Trash2,
  Save,
  X,
  Copy,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "react-toastify";
import { Template, QuestionType } from "../../types/index";
import { updateTemplateQuestions } from "../../services/api";

interface QuestionEditorProps {
  template: Template;
  onSave: () => void;
  onCancel: () => void;
}

interface QuestionItem {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  isRequired: boolean;
  showInTable: boolean;
  order: number;
}

const QUESTION_TYPES: {
  value: QuestionType;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    value: "SINGLE_LINE",
    label: "Short Text",
    icon: "📝",
    description: "Single line text input",
  },
  {
    value: "MULTI_LINE",
    label: "Long Text",
    icon: "📄",
    description: "Multiple line text area",
  },
  {
    value: "INTEGER",
    label: "Number",
    icon: "🔢",
    description: "Non-negative integer input",
  },
  {
    value: "CHECKBOX",
    label: "Checkbox",
    icon: "☑️",
    description: "True/False checkbox",
  },
];

// Draggable Question Card Component
const DraggableQuestionCard: React.FC<{
  question: QuestionItem;
  index: number;
  onUpdate: (index: number, updates: Partial<QuestionItem>) => void;
  onDelete: (index: number) => void;
  onDuplicate: (index: number) => void;
  moveQuestion: (dragIndex: number, hoverIndex: number) => void;
  questionCounts: Record<QuestionType, number>;
}> = ({
  question,
  index,
  onUpdate,
  onDelete,
  onDuplicate,
  moveQuestion,
  questionCounts,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "question",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Enhanced drag and drop implementation
  const [, drop] = useDrop({
    accept: "question",
    hover: (item: { index: number }, monitor) => {
      if (!ref.current || item.index === index) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      if (item.index < index && hoverClientY < hoverMiddleY) return;
      if (item.index > index && hoverClientY > hoverMiddleY) return;

      moveQuestion(item.index, index);
      item.index = index;
    },
  });

  drag(drop(ref));

  const canDuplicate = questionCounts[question.type] < 4;

  const getQuestionPreview = () => {
    switch (question.type) {
      case "SINGLE_LINE":
        return (
          <Form.Control
            type="text"
            placeholder="Short answer text"
            disabled
            size="sm"
          />
        );
      case "MULTI_LINE":
        return (
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Long answer text"
            disabled
            size="sm"
          />
        );
      case "INTEGER":
        return (
          <Form.Control
            type="number"
            placeholder="0"
            min="0"
            disabled
            size="sm"
            style={{ width: "150px" }}
          />
        );
      case "CHECKBOX":
        return <Form.Check type="checkbox" label="Option" disabled />;
      default:
        return null;
    }
  };

  return (
    <Card
      ref={ref}
      className={`mb-3 ${isDragging ? "opacity-50" : ""} question-card`}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <Card.Header className="bg-light border-0 py-2">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <GripVertical size={16} className="me-2 text-muted" />
            <span className="fw-medium">
              Question {index + 1}
              {question.isRequired && <span className="text-danger">*</span>}
            </span>
            <Badge bg="secondary" className="ms-2 small">
              {QUESTION_TYPES.find((t) => t.value === question.type)?.icon}{" "}
              {QUESTION_TYPES.find((t) => t.value === question.type)?.label}
            </Badge>
          </div>

          <div className="d-flex gap-1">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <EyeOff size={14} /> : <Eye size={14} />}
            </Button>

            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => onDuplicate(index)}
              disabled={!canDuplicate}
              title="Duplicate question"
            >
              <Copy size={14} />
            </Button>

            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(index)}
              title="Delete question"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </Card.Header>

      <Card.Body className={isExpanded ? "" : "d-none"}>
        <Row>
          <Col lg={8}>
            {/* Question Title */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">
                Question Title{" "}
                {question.isRequired && <span className="text-danger">*</span>}
              </Form.Label>
              <Form.Control
                type="text"
                value={question.title}
                onChange={(e) => onUpdate(index, { title: e.target.value })}
                placeholder="Enter your question here..."
                required
                size="lg"
              />
            </Form.Group>

            {/* Question Description */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">
                Description (Optional)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={question.description || ""}
                onChange={(e) =>
                  onUpdate(index, { description: e.target.value })
                }
                placeholder="Add a description to help people understand this question..."
              />
            </Form.Group>

            {/* Question Preview */}
            <div className="mb-3">
              <Form.Label className="fw-medium">Preview</Form.Label>
              <div className="border rounded p-3 bg-light">
                <div className="mb-2">
                  <strong>
                    {question.title || "Question title"}
                    {question.isRequired && (
                      <span className="text-danger">*</span>
                    )}
                  </strong>
                </div>
                {question.description && (
                  <div className="text-muted small mb-2">
                    {question.description}
                  </div>
                )}
                {getQuestionPreview()}
              </div>
            </div>
          </Col>

          <Col lg={4}>
            {/* Question Type */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Question Type</Form.Label>
              <Form.Select
                value={question.type}
                onChange={(e) =>
                  onUpdate(index, { type: e.target.value as QuestionType })
                }
                size="lg"
              >
                {QUESTION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                {
                  QUESTION_TYPES.find((t) => t.value === question.type)
                    ?.description
                }
              </Form.Text>
            </Form.Group>

            {/* Question Settings */}
            <Card className="border-0 bg-light">
              <Card.Header className="bg-transparent border-0 py-2">
                <div className="d-flex align-items-center">
                  <Settings size={16} className="me-2" />
                  <span className="fw-medium">Settings</span>
                </div>
              </Card.Header>
              <Card.Body className="py-2">
                <Form.Check
                  type="switch"
                  id={`required-${question.id}`}
                  label="Required"
                  checked={question.isRequired}
                  onChange={(e) =>
                    onUpdate(index, { isRequired: e.target.checked })
                  }
                  className="mb-2"
                />
                <Form.Check
                  type="switch"
                  id={`table-${question.id}`}
                  label="Show in Results Table"
                  checked={question.showInTable}
                  onChange={(e) =>
                    onUpdate(index, { showInTable: e.target.checked })
                  }
                />
                <Form.Text className="text-muted">
                  When enabled, answers will appear in the results table
                </Form.Text>
              </Card.Body>
            </Card>

            {/* Type Limit Warning */}
            {questionCounts[question.type] >= 4 && (
              <Alert variant="warning" className="mt-3">
                <small>
                  You've reached the limit of 4{" "}
                  {QUESTION_TYPES.find((t) => t.value === question.type)?.label}{" "}
                  questions
                </small>
              </Alert>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

// Main QuestionEditor Component
export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  template,
  onSave,
  onCancel,
}) => {
  

  const [questions, setQuestions] = useState<QuestionItem[]>(
    template.questions?.map((q, index) => ({
      id: q.id || `temp-${index}`,
      title: q.title,
      description: q.description || "",
      type: q.type,
      isRequired: q.isRequired,
      showInTable: q.showInTable,
      order: index,
    })) || []
  );

  const [isSaving, setIsSaving] = useState(false);

  // Count questions by type
  const questionCounts = questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as Record<QuestionType, number>);

  const addQuestion = (type: QuestionType = "SINGLE_LINE") => {
    if (questionCounts[type] >= 4) {
      toast.error(
        `You can only have up to 4 ${
          QUESTION_TYPES.find((t) => t.value === type)?.label
        } questions`
      );
      return;
    }

    const newQuestion: QuestionItem = {
      id: `new-${Date.now()}`,
      title: "",
      description: "",
      type,
      isRequired: false,
      showInTable: false,
      order: questions.length,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updates: Partial<QuestionItem>) => {
    setQuestions(
      questions.map((q, i) => (i === index ? { ...q, ...updates } : q))
    );
  };

  const deleteQuestion = (index: number) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const duplicateQuestion = (index: number) => {
    const questionToDuplicate = questions[index];
    if (questionCounts[questionToDuplicate.type] >= 4) {
      toast.error(
        `You can only have up to 4 ${
          QUESTION_TYPES.find((t) => t.value === questionToDuplicate.type)
            ?.label
        } questions`
      );
      return;
    }

    const duplicatedQuestion: QuestionItem = {
      ...questionToDuplicate,
      id: `dup-${Date.now()}`,
      title: `${questionToDuplicate.title} (Copy)`,
      order: questions.length,
    };
    setQuestions([...questions, duplicatedQuestion]);
  };

  const moveQuestion = (dragIndex: number, hoverIndex: number) => {
    const draggedQuestion = questions[dragIndex];
    const newQuestions = [...questions];
    newQuestions.splice(dragIndex, 1);
    newQuestions.splice(hoverIndex, 0, draggedQuestion);
    setQuestions(newQuestions);
  };

  const validateQuestions = () => {
    for (const question of questions) {
      if (!question.title.trim()) {
        toast.error("All questions must have a title");
        return false;
      }
    }

    // Check type limits
    for (const [type, count] of Object.entries(questionCounts)) {
      if (count > 4) {
        toast.error(`You can only have up to 4 ${type} questions`);
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateQuestions()) return;

    setIsSaving(true);
    try {
      const questionsToSave = questions.map((q, index) => ({
        title: q.title,
        description: q.description,
        type: q.type,
        isRequired: q.isRequired,
        showInTable: q.showInTable,
        order: index,
      }));

      await updateTemplateQuestions(template.id, questionsToSave);
      toast.success("Questions updated successfully");
      onSave();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update questions");
    } finally {
      setIsSaving(false);
    }
  };

  const canAddQuestionType = (type: QuestionType) => {
    return questionCounts[type] < 4;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container fluid className="py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-1">Edit Questions</h3>
            <p className="text-muted mb-0">
              Add up to 4 questions of each type. Drag to reorder.
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" onClick={onCancel}>
              <X size={16} className="me-2" />
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving || questions.length === 0}
            >
              <Save size={16} className="me-2" />
              {isSaving ? "Saving..." : "Save Questions"}
            </Button>
          </div>
        </div>

        {/* Question Type Overview */}
        <Alert variant="info" className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <strong>Question Types Usage:</strong>
            <div className="d-flex gap-2 flex-wrap">
              {QUESTION_TYPES.map((type) => (
                <Badge
                  key={type.value}
                  bg={canAddQuestionType(type.value) ? "success" : "warning"}
                  className="px-2 py-1"
                >
                  {type.icon} {type.label}: {questionCounts[type.value] || 0}/4
                </Badge>
              ))}
            </div>
          </div>
        </Alert>

        {/* Questions List */}
        <div className="questions-container">
          {questions.map((question, index) => (
            <DraggableQuestionCard
              key={question.id}
              question={question}
              index={index}
              onUpdate={updateQuestion}
              onDelete={deleteQuestion}
              onDuplicate={duplicateQuestion}
              moveQuestion={moveQuestion}
              questionCounts={questionCounts}
            />
          ))}

          {/* Add Question Card */}
          <Card className="border-2 border-dashed border-primary bg-light">
            <Card.Body className="text-center py-5">
              <div className="mb-3">
                <Plus size={32} className="text-primary mb-2" />
                <h5 className="text-primary">Add Question</h5>
                <p className="text-muted">
                  Click on a question type to add it to your form
                </p>
              </div>

              <div className="d-flex justify-content-center gap-2 flex-wrap">
                {QUESTION_TYPES.map((type) => (
                  <Button
                    key={type.value}
                    variant={
                      canAddQuestionType(type.value)
                        ? "outline-primary"
                        : "outline-secondary"
                    }
                    onClick={() => addQuestion(type.value)}
                    disabled={!canAddQuestionType(type.value)}
                    className="d-flex flex-column align-items-center p-3"
                    style={{ minWidth: "120px" }}
                  >
                    <span style={{ fontSize: "24px" }} className="mb-1">
                      {type.icon}
                    </span>
                    <span className="small fw-medium">{type.label}</span>
                    <span className="text-muted" style={{ fontSize: "10px" }}>
                      {questionCounts[type.value] || 0}/4
                    </span>
                  </Button>
                ))}
              </div>

              {questions.length >= 16 && (
                <Alert variant="warning" className="mt-3 mb-0">
                  <small>
                    Maximum number of questions reached (4 per type)
                  </small>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Footer Info */}
        {questions.length > 0 && (
          <Alert variant="light" className="mt-4">
            <div className="d-flex justify-content-between align-items-center">
              <span>
                <strong>{questions.length}</strong> question
                {questions.length !== 1 ? "s" : ""} total
              </span>
              <span className="text-muted small">
                Drag questions to reorder • Use switches to configure settings
              </span>
            </div>
          </Alert>
        )}
      </Container>
    </DndProvider>
  );
};
