import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import type { QuestionType } from "../../types/question.types";
import { QUESTION_TYPES } from "../../utils/constants";

interface AddQuestionPanelProps {
  questionCounts: Record<QuestionType, number>;
  onAddQuestion: (type: QuestionType) => void;
}

export const AddQuestionPanel: React.FC<AddQuestionPanelProps> = ({
  questionCounts,
  onAddQuestion,
}) => {
  return (
    <Card>
      <Card.Body>
        <h5 className="mb-3">Add Question</h5>
        <Row>
          {QUESTION_TYPES.map((type) => {
            const count = questionCounts[type.type] || 0;
            const isDisabled = count >= type.limit;
            const Icon = type.icon;

            return (
              <Col key={type.type} xs={6} md={3} className="mb-3">
                <Button
                  variant={isDisabled ? "outline-secondary" : "outline-primary"}
                  className="w-100 d-flex flex-column align-items-center p-3"
                  disabled={isDisabled}
                  onClick={() => onAddQuestion(type.type)}
                  style={{ minHeight: "100px" }}
                >
                  <Icon size={24} className="mb-2" />
                  <span className="fw-medium">{type.label}</span>
                  <small className="text-muted">
                    {count}/{type.limit}
                  </small>
                </Button>
              </Col>
            );
          })}
        </Row>
      </Card.Body>
    </Card>
  );
};
