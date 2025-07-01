import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
} from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Calendar,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify"; // FIXED: Added toast import
import { useAuthStore, useFormsStore } from "../../store/index"; // FIXED: Removed useUIStore
import { getForm } from "../../services/api";
import { LoadingSpinner } from "../../components/UI/LoadingSpinner";
import { ConfirmModal } from "../../components/UI/ConfirmModal";
import { formatDistanceToNow } from "date-fns";

export const FormViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { deleteForm } = useFormsStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch form
  const {
    data: formData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["form", id],
    queryFn: () => getForm(id!),
    enabled: !!id,
  });

  const form = formData?.form;

  // Check permissions
  const canEdit =
    user &&
    form &&
    (user.id === form.userId ||
      user.id === form.template.ownerId ||
      user.role === "ADMIN");

  const canDelete =
    user &&
    form &&
    (user.id === form.userId ||
      user.id === form.template.ownerId ||
      user.role === "ADMIN");

  const handleDelete = async () => {
    if (!form) return;

    setIsDeleting(true);
    try {
      await deleteForm(form.id); 
      toast.success("Form submission deleted successfully");

      navigate("/forms");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to delete form submission";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getAnswerValue = (answer: any) => {
    if (answer.valueText) return answer.valueText;
    if (answer.valueInt !== null) return answer.valueInt.toString();
    if (answer.valueBool !== null) return answer.valueBool ? "Yes" : "No";
    return "-";
  };

  if (isLoading) {
    return <LoadingSpinner center text="Loading form..." />;
  }

  if (error || !form) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>Form Not Found</h4>
          <p>
            The form submission you're looking for doesn't exist or has been
            deleted.
          </p>
          <Button as={Link as any} to="/forms" variant="outline-primary">
            <ArrowLeft size={16} className="me-2" />
            Back to Forms
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div className="d-flex align-items-center">
          <Button
            as={Link as any}
            to="/forms"
            variant="outline-secondary"
            size="sm"
            className="me-3"
          >
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="h4 mb-1">
              <FileText size={20} className="me-2" />
              Form Submission
            </h1>
            <p className="text-muted mb-0">for "{form.template.title}"</p>
          </div>
        </div>

        <div className="d-flex gap-2">
          {canEdit && (
            <Button
              as={Link as any}
              to={`/forms/${form.id}/edit`}
              variant="outline-primary"
              size="sm"
            >
              <Edit size={16} className="me-2" />
              Edit
            </Button>
          )}

          {canDelete && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 size={16} className="me-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Form Details */}
      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Answers</h5>
            </Card.Header>
            <Card.Body>
              {form.answers.map((answer) => (
                <div key={answer.id} className="mb-4">
                  <h6 className="fw-bold">{answer.question.title}</h6>
                  {answer.question.description && (
                    <p className="text-muted small mb-2">
                      {answer.question.description}
                    </p>
                  )}
                  <div className="bg-light p-3 rounded">
                    {getAnswerValue(answer)}
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">Submission Details</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <User size={16} className="me-2 text-muted" />
                <span>
                  <strong>Submitted by:</strong> {form.user.name}
                </span>
              </div>

              <div className="d-flex align-items-center mb-3">
                <Calendar size={16} className="me-2 text-muted" />
                <span>
                  <strong>Submitted:</strong>{" "}
                  {formatDistanceToNow(new Date(form.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {form.updatedAt !== form.createdAt && (
                <div className="d-flex align-items-center mb-3">
                  <Calendar size={16} className="me-2 text-muted" />
                  <span>
                    <strong>Last updated:</strong>{" "}
                    {formatDistanceToNow(new Date(form.updatedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              )}

              <hr />

              <h6 className="mb-2">Template Info</h6>
              <p className="mb-2">
                <strong>Title:</strong> {form.template.title}
              </p>
              <p className="mb-2">
                <strong>Topic:</strong>{" "}
                <Badge bg="primary">{form.template.topic}</Badge>
              </p>
              <p className="mb-0">
                <strong>Created by:</strong> {form.template.owner.name}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        title="Delete Form Submission"
        message="Are you sure you want to delete this form submission? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={isDeleting}
      />
    </Container>
  );
};
