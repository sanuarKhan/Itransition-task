import React from "react";
import { Card, Form, Alert } from "react-bootstrap";
import { Type } from "lucide-react";
import type { FormTemplate } from "../../types/form.types";

interface PreviewTabProps {
  template: FormTemplate;
}

export const PreviewTab: React.FC<PreviewTabProps> = ({ template }) => {
  const renderQuestionInput = (question: any) => {
    switch (question.type) {
      case "SINGLE_LINE":
        return <Form.Control type="text" placeholder="Your answer" />;
      case "MULTI_LINE":
        return (
          <Form.Control as="textarea" rows={3} placeholder="Your answer" />
        );
      case "INTEGER":
        return <Form.Control type="number" placeholder="0" />;
      case "CHECKBOX":
        return <Form.Check type="checkbox" label="Check this option" />;
      default:
        return null;
    }
  };

  if (template.questions.length === 0) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <Type size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No questions added yet</h5>
          <p className="text-muted">
            Go to the Questions tab to add some questions!
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Body>
        <div className="mb-4">
          <h1>{template.title}</h1>
          {template.description && (
            <p className="text-muted">{template.description}</p>
          )}
        </div>

        {template.questions.map((question, index) => (
          <Card key={question.id} className="mb-3">
            <Card.Body>
              <h5>
                {question.title}
                {question.isRequired && <span className="text-danger">*</span>}
              </h5>
              {question.description && (
                <p className="text-muted small">{question.description}</p>
              )}
              {renderQuestionInput(question)}
            </Card.Body>
          </Card>
        ))}
      </Card.Body>
    </Card>
  );
};
