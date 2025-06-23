import React, { useState, useCallback } from "react";
import { Card, Form, Button, ButtonGroup } from "react-bootstrap";
import { GripVertical, Copy, Trash2, Edit3, Save, X } from "lucide-react";
import type { Question, QuestionType } from "../../types/question.types";
import { getQuestionTypeInfo } from "../../utils/helpers";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";

interface QuestionCardProps {
  question: Question;
  index: number;
  onUpdate: (id: string, updates: Partial<Question>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMove: (dragIndex: number, dropIndex: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  onUpdate,
  onDelete,
  onDuplicate,
  onMove,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(question.title);
  const [localDescription, setLocalDescription] = useState(
    question.description
  );

  const { ref, isDragging } = useDragAndDrop(index, question.id, onMove);

  const typeInfo = getQuestionTypeInfo(question.type);
  const Icon = typeInfo?.icon;

  const handleSave = useCallback(() => {
    onUpdate(question.id, {
      title: localTitle,
      description: localDescription,
    });
    setIsEditing(false);
  }, [question.id, localTitle, localDescription, onUpdate]);

  const handleCancel = useCallback(() => {
    setLocalTitle(question.title);
    setLocalDescription(question.description);
    setIsEditing(false);
  }, [question.title, question.description]);

  const renderPreview = () => {
    switch (question.type) {
      case "SINGLE_LINE":
        return (
          <Form.Control
            type="text"
            placeholder="Short answer text"
            disabled
            className="mb-3"
          />
        );
      case "MULTI_LINE":
        return (
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Long answer text"
            disabled
            className="mb-3"
          />
        );
      case "INTEGER":
        return (
          <Form.Control
            type="number"
            placeholder="0"
            disabled
            className="mb-3"
            style={{ maxWidth: "200px" }}
          />
        );
      case "CHECKBOX":
        return (
          <Form.Check
            type="checkbox"
            label="Checkbox option"
            disabled
            className="mb-3"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card
      ref={ref}
      className={`mb-3 ${isDragging ? "opacity-50" : ""}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Card.Body>
        <div className="d-flex align-items-start gap-3">
          <div className="text-muted" style={{ cursor: "move" }}>
            <GripVertical size={20} />
          </div>

          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-2">
              {Icon && <Icon size={18} />}
              <small className="text-muted fw-medium">{typeInfo?.label}</small>
            </div>

            {isEditing ? (
              <div className="mb-3">
                <Form.Control
                  type="text"
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  className="mb-2 fw-bold"
                  placeholder="Question title"
                />
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={localDescription}
                  onChange={(e) => setLocalDescription(e.target.value)}
                  placeholder="Question description (optional)"
                />
                <div className="mt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    className="me-2"
                  >
                    <Save size={14} className="me-1" />
                    Save
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleCancel}>
                    <X size={14} className="me-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="mb-3"
                onClick={() => setIsEditing(true)}
                style={{ cursor: "pointer" }}
              >
                <h5 className="mb-1">{question.title}</h5>
                {question.description && (
                  <p className="text-muted small mb-0">
                    {question.description}
                  </p>
                )}
              </div>
            )}

            {renderPreview()}

            <div className="d-flex gap-3">
              <Form.Check
                type="checkbox"
                label="Required"
                checked={question.isRequired}
                onChange={(e) =>
                  onUpdate(question.id, { isRequired: e.target.checked })
                }
              />
              <Form.Check
                type="checkbox"
                label="Show in results table"
                checked={question.showInTable}
                onChange={(e) =>
                  onUpdate(question.id, { showInTable: e.target.checked })
                }
              />
            </div>
          </div>

          <ButtonGroup size="sm">
            <Button
              variant="outline-secondary"
              onClick={() => onDuplicate(question.id)}
              title="Duplicate question"
            >
              <Copy size={14} />
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => onDelete(question.id)}
              title="Delete question"
            >
              <Trash2 size={14} />
            </Button>
          </ButtonGroup>
        </div>
      </Card.Body>
    </Card>
  );
};
