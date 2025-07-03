import React, { useState } from "react";
import { Card, Form, Button, Row, Col, Badge, Alert } from "react-bootstrap";
import { Trash2, Edit3 } from "lucide-react";
import type { CreateQuestionData, QuestionType } from "../../types";

interface QuestionBuilderProps {
  questions: CreateQuestionData[];
  onChange: (questions: CreateQuestionData[]) => void;
}
// path issue fixing
const QUESTION_TYPES: { value: QuestionType; label: string; icon: string }[] = [
  { value: "SINGLE_LINE", label: "Short Text", icon: "📝" },
  { value: "MULTI_LINE", label: "Long Text", icon: "📄" },
  { value: "INTEGER", label: "Number", icon: "🔢" },
  { value: "CHECKBOX", label: "Checkbox", icon: "☑️" },
];

export const QuestionBuilder: React.FC<QuestionBuilderProps> = ({
  questions,
  onChange,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Count questions by type
  const questionCounts = questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as Record<QuestionType, number>);

  const addQuestion = (type: QuestionType = "SINGLE_LINE") => {
    if (questionCounts[type] >= 4) {
      alert(
        `You can only have up to 4 ${
          QUESTION_TYPES.find((t) => t.value === type)?.label
        } questions`
      );
      return;
    }

    const newQuestion: CreateQuestionData = {
      title: "",
      description: "",
      type,
      isRequired: false,
      showInTable: false,
    };

    onChange([...questions, newQuestion]);
    setEditingIndex(questions.length);
  };

  const updateQuestion = (
    index: number,
    updates: Partial<CreateQuestionData>
  ) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, ...updates } : q
    );
    onChange(updatedQuestions);
  };

  const deleteQuestion = (index: number) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      onChange(updatedQuestions);
      setEditingIndex(null);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="mb-3">
          <h5 className="text-muted">No Questions Added Yet</h5>
          <p className="text-muted">
            Add questions to make your template interactive.
          </p>
        </div>

        <Row className="g-2 justify-content-center">
          {QUESTION_TYPES.map((type) => (
            <Col key={type.value} xs={6} md={3}>
              <Button
                variant="outline-primary"
                className="w-100"
                onClick={() => addQuestion(type.value)}
                disabled={questionCounts[type.value] >= 4}
              >
                <div className="text-center">
                  <div style={{ fontSize: "1.5rem" }}>{type.icon}</div>
                  <small>{type.label}</small>
                  <br />
                  <small className="text-muted">
                    {questionCounts[type.value] || 0}/4
                  </small>
                </div>
              </Button>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div>
      {/* Questions List */}
      <div className="mb-4">
        {questions.map((question, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              {editingIndex === index ? (
                // Edit Mode
                <div>
                  <Form.Group className="mb-3">
                    <Form.Label>Question Title *</Form.Label>
                    <Form.Control
                      type="text"
                      value={question.title}
                      onChange={(e) =>
                        updateQuestion(index, { title: e.target.value })
                      }
                      placeholder="Enter question title..."
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={question.description}
                      onChange={(e) =>
                        updateQuestion(index, { description: e.target.value })
                      }
                      placeholder="Add additional context..."
                    />
                  </Form.Group>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Question Type</Form.Label>
                        <Form.Select
                          value={question.type}
                          onChange={(e) =>
                            updateQuestion(index, {
                              type: e.target.value as QuestionType,
                            })
                          }
                        >
                          {QUESTION_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Label>Options</Form.Label>
                      <div>
                        <Form.Check
                          type="checkbox"
                          label="Required"
                          checked={question.isRequired}
                          onChange={(e) =>
                            updateQuestion(index, {
                              isRequired: e.target.checked,
                            })
                          }
                          className="mb-2"
                        />
                        <Form.Check
                          type="checkbox"
                          label="Show in results table"
                          checked={question.showInTable}
                          onChange={(e) =>
                            updateQuestion(index, {
                              showInTable: e.target.checked,
                            })
                          }
                        />
                      </div>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => {
                        if (question.title.trim()) {
                          setEditingIndex(null);
                        } else {
                          alert("Question title cannot be empty.");
                        }
                      }}
                      disabled={!question.title.trim()}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => {
                        // Revert changes if canceled and not saved
                        if (!questions[index].title.trim() && editingIndex === index) {
                          deleteQuestion(index); // Remove if title was empty and canceled
                        } else {
                          setEditingIndex(null);
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteQuestion(index)}
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
                      <span className="me-2">
                        {
                          QUESTION_TYPES.find((t) => t.value === question.type)
                            ?.icon
                        }
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
                      <p className="text-muted small mb-2">
                        {question.description}
                      </p>
                    )}
                    <Badge bg="secondary">
                      {
                        QUESTION_TYPES.find((t) => t.value === question.type)
                          ?.label
                      }
                    </Badge>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setEditingIndex(index)}
                    >
                      <Edit3 size={14} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteQuestion(index)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Add Question Buttons */}
      <Card className="border-dashed">
        <Card.Body className="text-center">
          <h6 className="mb-3">Add New Question</h6>
          <Row className="g-2">
            {QUESTION_TYPES.map((type) => (
              <Col key={type.value} xs={6} md={3}>
                <Button
                  variant="outline-primary"
                  className="w-100"
                  onClick={() => addQuestion(type.value)}
                  disabled={questionCounts[type.value] >= 4}
                >
                  <div className="text-center">
                    <div style={{ fontSize: "1.5rem" }}>{type.icon}</div>
                    <small>{type.label}</small>
                    <br />
                    <small className="text-muted">
                      {questionCounts[type.value] || 0}/4
                    </small>
                  </div>
                </Button>
              </Col>
            ))}
          </Row>

          <Alert variant="info" className="mt-3 mb-0">
            <small>
              💡 You can add up to 4 questions of each type. Questions marked as
              "Required" must be answered when filling out the form.
            </small>
          </Alert>
        </Card.Body>
      </Card>
    </div>
  );
};
