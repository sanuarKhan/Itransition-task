
import React from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import  Layout  from "../components/Layout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { formService } from "../services/formService";
import { formSubmissionSchema } from "../schemas/formSchema";
import { FormTemplate, FormSubmission } from "../types/form.types";
import type { QuestionType } from "../types/question.types";
import { ArrowLeft, Send, Globe, Lock } from "lucide-react";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";

export const FormPreview: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();

  const {
    data: form,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["form", formId],
    queryFn: () => formService.getForm(formId!),
    enabled: !!formId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormSubmission>({
    resolver: zodResolver(formSubmissionSchema),
  });

  const onSubmit = async (data: FormSubmission) => {
    try {
      await formService.submitForm(formId!, data);
      toast.success("Form submitted successfully!");
      navigate("/forms");
    } catch (error) {
      toast.error("Failed to submit form");
    }
  };

  const renderQuestion = (question: any, index: number) => {
    const fieldName = `responses.${question.id}` as const;
    const error = errors.responses?.[question.id];

    return (
      <Card key={question.id} className="mb-4 border-0 shadow-sm">
        <Card.Body className="p-4">
          <div className="mb-3">
            <label className="form-label fw-medium">
              <span className="me-2">{index + 1}.</span>
              {question.title}
              {question.isRequired && (
                <span className="text-danger ms-1">*</span>
              )}
            </label>
            {question.description && (
              <div className="text-muted small mt-1">
                <ReactMarkdown>{question.description}</ReactMarkdown>
              </div>
            )}
          </div>

          {question.type === QuestionType.SINGLE_LINE && (
            <Input
              {...register(fieldName, {
                required: question.isRequired
                  ? "This field is required"
                  : false,
              })}
              placeholder="Your answer"
              className={error ? "is-invalid" : ""}
            />
          )}

          {question.type === QuestionType.MULTI_LINE && (
            <Textarea
              {...register(fieldName, {
                required: question.isRequired
                  ? "This field is required"
                  : false,
              })}
              rows={4}
              placeholder="Your answer"
              className={error ? "is-invalid" : ""}
            />
          )}

          {question.type === QuestionType.INTEGER && (
            <Input
              type="number"
              {...register(fieldName, {
                required: question.isRequired
                  ? "This field is required"
                  : false,
                valueAsNumber: true,
              })}
              placeholder="Enter a number"
              className={error ? "is-invalid" : ""}
            />
          )}

          {question.type === QuestionType.CHECKBOX && (
            <div className="form-check">
              <input
                type="checkbox"
                className={`form-check-input ${error ? "is-invalid" : ""}`}
                {...register(fieldName, {
                  required: question.isRequired
                    ? "This field is required"
                    : false,
                })}
              />
              <label className="form-check-label">
                {question.options?.[0] || "Check this option"}
              </label>
            </div>
          )}

          {error && (
            <div className="invalid-feedback d-block mt-2">{error.message}</div>
          )}
        </Card.Body>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading form...</p>
              </div>
            </Col>
          </Row>
        </Container>
      </Layout>
    );
  }

  if (error || !form) {
    return (
      <Layout>
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h4 className="text-danger mb-3">Form not found</h4>
              <p className="text-muted mb-4">
                The form you're looking for doesn't exist or has been removed.
              </p>
              <Button variant="primary" onClick={() => navigate("/forms")}>
                <ArrowLeft size={16} className="me-2" />
                Back to Forms
              </Button>
            </Col>
          </Row>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={8}>
            {/* Header */}
            <div className="d-flex align-items-center mb-4">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => navigate(-1)}
                className="me-3"
              >
                <ArrowLeft size={16} />
              </Button>
              <div>
                <h5 className="mb-0 text-muted">Form Preview</h5>
              </div>
            </div>

            {/* Form Header */}
            <Card className="mb-4 border-0 shadow-sm">
              {form.thumbnail && (
                <div
                  className="card-img-top"
                  style={{
                    height: "200px",
                    backgroundImage: `url(${form.thumbnail})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "0.375rem 0.375rem 0 0",
                  }}
                />
              )}
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <Badge
                    bg={form.isPublic ? "success" : "warning"}
                    className="d-flex align-items-center gap-1"
                  >
                    {form.isPublic ? <Globe size={12} /> : <Lock size={12} />}
                    {form.isPublic ? "Public Form" : "Private Form"}
                  </Badge>
                </div>

                <h1 className="h2 mb-3">{form.title}</h1>

                {form.description && (
                  <div className="text-muted mb-3">
                    <ReactMarkdown>{form.description}</ReactMarkdown>
                  </div>
                )}

                {form.tags.length > 0 && (
                  <div className="d-flex flex-wrap gap-2">
                    {form.tags.map((tag, index) => (
                      <Badge key={index} bg="light" text="dark">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Form Content */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {form.questions.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <Card.Body className="text-center py-5">
                    <div className="text-muted mb-3">
                      <Send size={48} className="opacity-25" />
                    </div>
                    <h5 className="text-muted">No questions in this form</h5>
                    <p className="text-muted">
                      This form doesn't have any questions yet.
                    </p>
                  </Card.Body>
                </Card>
              ) : (
                <>
                  {form.questions
                    .sort((a, b) => a.order - b.order)
                    .map((question, index) => renderQuestion(question, index))}

                  {/* Submit Button */}
                  <div className="d-grid gap-2 mt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send size={16} className="me-2" />
                          Submit Form
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};