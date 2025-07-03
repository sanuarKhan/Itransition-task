import React, { useState, useEffect } from "react";

import { Card, Button, Alert, Badge, Row, Col } from "react-bootstrap";
import { Plus, Edit, GripVertical, Settings, Eye } from "lucide-react";
import type { Template, Question, CreateQuestionData } from "../../types/index";
import { QuestionEditor } from "./QuestionEditor";
import { useForm } from "react-hook-form";
import { useTemplatesStore } from "../../store/index";
import { toast } from "react-toastify";
import { Form } from "react-router-dom";

interface TemplateQuestionsProps {
  template: Template;
  canEdit?: boolean;
  onUpdate?: () => void;
}

export const TemplateQuestions: React.FC<TemplateQuestionsProps> = ({
  template,
  canEdit = false,
  onUpdate = () => {},
}) => {
  const [editingQuestions, setEditingQuestions] = useState(false);
  const { updateTemplateQuestions } = useTemplatesStore();

  const { control, handleSubmit, reset } = useForm<{
    questions: CreateQuestionData[];
  }>({
    defaultValues: {
      questions: template.questions || [],
    },
  });

  useEffect(() => {
    reset({ questions: template.questions || [] });
  }, [template, reset]);

  const handleSaveQuestions = async (data: {
    questions: CreateQuestionData[];
  }) => {
    try {
      const questionsWithOrder = data.questions.map((q, index) => ({
        ...q,
        order: index + 1,
      }));
      await updateTemplateQuestions(template.id, questionsWithOrder);
      toast.success("Questions updated successfully!");
      setEditingQuestions(false);
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update questions");
    }
  };

  const handleCancelEdit = () => {
    reset({ questions: template.questions || [] }); // Reset form to original template questions
    setEditingQuestions(false);
  };

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

  const getQuestionPreview = (question: Question) => {
    switch (question.type) {
      case "SINGLE_LINE":
        return (
          <div className="border rounded p-2 bg-light text-muted">
            Short answer text...
          </div>
        );
      case "MULTI_LINE":
        return (
          <div
            className="border rounded p-2 bg-light text-muted"
            style={{ minHeight: "60px" }}
          >
            Long answer text...
          </div>
        );
      case "INTEGER":
        return (
          <div
            className="border rounded p-2 bg-light text-muted"
            style={{ width: "150px" }}
          >
            0
          </div>
        );
      case "CHECKBOX":
        return (
          <div className="d-flex align-items-center">
            <input type="checkbox" disabled className="me-2" />
            <span className="text-muted">Option</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Show QuestionEditor when editing
  if (editingQuestions) {
    return (
      <Form onSubmit={handleSubmit(handleSaveQuestions)}>
        <QuestionEditor
          control={control}
          name="questions"
          templateTitle={template.title}
        />
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button variant="secondary" onClick={handleCancelEdit}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Questions
          </Button>
        </div>
      </Form>
    );
  }

  // Handle empty or undefined questions
  if (!Array.isArray(template.questions) || template.questions.length === 0) {
    return (
      <Card className="border-2 border-dashed">
        <Card.Body className="text-center py-5">
          <div className="mb-3">
            <div className="display-1 text-muted mb-3">📝</div>
            <h4 className="text-muted">No Questions Added Yet</h4>
            <p className="text-muted mb-4">
              Add questions to make this template interactive. People will be
              able to fill out forms with these questions.
            </p>
          </div>

          {canEdit && (
            <div>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setEditingQuestions(true)}
                className="px-4"
              >
                <Plus size={20} className="me-2" />
                Add Your First Question
              </Button>
              <div className="mt-3">
                <small className="text-muted">
                  You can add up to 4 questions of each type: Short Text, Long
                  Text, Number, and Checkbox
                </small>
              </div>
            </div>
          )}

          {!canEdit && (
            <Alert variant="info" className="mb-0">
              This template doesn't have any questions yet. Check back later!
            </Alert>
          )}
        </Card.Body>
      </Card>
    );
  }

  // Display existing questions
  const sortedQuestions = [...template.questions].sort(
    (a, b) => a.order - b.order
  );

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">
            Questions ({template.questions?.length ?? 0})
          </h4>
          <p className="text-muted mb-0">
            {canEdit
              ? "Manage your template questions. You can edit, reorder, or add new ones."
              : "Preview of all questions in this template"}
          </p>
        </div>

        {canEdit && (
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              onClick={() => setEditingQuestions(true)}
            >
              <Edit size={16} className="me-2" />
              Edit Questions
            </Button>
          </div>
        )}
      </div>

      {/* Questions Display */}
      <div className="questions-list">
        {sortedQuestions.map((question, index) => (
          <Card key={question.id} className="mb-3 question-card">
            <Card.Body>
              <Row>
                <Col lg={8}>
                  <div className="question-content">
                    {/* Question Number and Title */}
                    <div className="d-flex align-items-start mb-2">
                      {canEdit && (
                        <div className="me-2 mt-1">
                          <GripVertical
                            size={16}
                            className="text-muted cursor-move"
                          />
                        </div>
                      )}

                      <h5 className="question-title mb-1">
                        {index + 1}. {question.title}
                        {question.isRequired && (
                          <span className="text-danger ms-1">*</span>
                        )}
                      </h5>
                    </div>

                    {/* Question Description */}
                    {question.description && (
                      <p className="text-muted mb-3">{question.description}</p>
                    )}

                    {/* Question Preview */}
                    <div className="question-input-preview">
                      {getQuestionPreview(question)}
                    </div>
                  </div>
                </Col>

                <Col lg={4}>
                  {/* Question Meta Info */}
                  <div className="question-meta">
                    <div className="d-flex align-items-center mb-2">
                      <span className="me-2">
                        {getQuestionTypeIcon(question.type)}
                      </span>
                      <Badge bg="secondary" className="px-2">
                        {getQuestionTypeName(question.type)}
                      </Badge>
                    </div>

                    <div className="small text-muted">
                      {question.isRequired && (
                        <div className="mb-1">
                          <Badge bg="danger" className="me-1">
                            Required
                          </Badge>
                        </div>
                      )}

                      {question.showInTable && (
                        <div className="mb-1">
                          <Badge bg="info" className="me-1">
                            Shows in Table
                          </Badge>
                        </div>
                      )}

                      {!question.isRequired && !question.showInTable && (
                        <div className="text-muted">Optional</div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Footer Info */}
      {canEdit && (
        <Alert variant="light" className="mt-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Settings size={16} className="me-2" />
              <strong>Question Management</strong>
            </div>
            <div className="d-flex gap-3 small text-muted">
              <span>
                📝 Short Text:{" "}
                {sortedQuestions.filter((q) => q.type === "SINGLE_LINE").length}
                /4
              </span>
              <span>
                📄 Long Text:{" "}
                {sortedQuestions.filter((q) => q.type === "MULTI_LINE").length}
                /4
              </span>
              <span>
                🔢 Number:{" "}
                {sortedQuestions.filter((q) => q.type === "INTEGER").length}/4
              </span>
              <span>
                ☑️ Checkbox:{" "}
                {sortedQuestions.filter((q) => q.type === "CHECKBOX").length}/4
              </span>
            </div>
          </div>
        </Alert>
      )}

      {/* Instructions for non-editors */}
      {!canEdit && (
        <Alert variant="info" className="mt-4">
          <Eye size={16} className="me-2" />
          <strong>Form Preview</strong> - This is how the questions will appear
          when filling out the form.
          {template.questions &&
            template.questions.some((q) => q.isRequired) && (
              <span className="ms-2">
                Questions marked with <span className="text-danger">*</span> are
                required.
              </span>
            )}
        </Alert>
      )}
    </div>
  );
};
