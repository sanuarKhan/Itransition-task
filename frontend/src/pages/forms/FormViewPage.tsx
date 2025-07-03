import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Calendar,
  FileText,
  Share2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuthStore, useFormsStore } from "../../store/index";
import { getForm } from "../../services/api";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { formatDistanceToNow } from "date-fns";

export const FormViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { deleteForm } = useFormsStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleShare = async () => {
    if (!form) return;

    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success(t("common.copySuccess", "Form link copied to clipboard!"));
    } catch (error) {
      toast.error(t("common.copyError", "Failed to copy link"));
    }
  };

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

  const canEdit =
    user &&
    form &&
    (user.id === form.userId ||
      user.id === form.template.owner.id ||
      user.role === "ADMIN");

  const canDelete =
    user &&
    form &&
    (user.id === form.userId ||
      user.id === form.template.owner.id ||
      user.role === "ADMIN");

  const handleDelete = async () => {
    if (!form) return;

    setIsDeleting(true);
    try {
      await deleteForm(form.id);
      toast.success(
        t("formView.toastDeleteSuccess", "Form submission deleted successfully")
      );

      navigate("/forms");
      //eslint-disable-next-line
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        t("formView.toastDeleteError", "Failed to delete form submission");
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };
  //eslint-disable-next-line
  const getAnswerValue = (answer: any) => {
    if (answer.valueText) return answer.valueText;
    if (answer.valueInt !== null) return answer.valueInt.toString();
    if (answer.valueBool !== null)
      return answer.valueBool
        ? t("formView.yes", "Yes")
        : t("formView.no", "No");
    return "-";
  };

  if (isLoading) return <LoadingSpinner center text={t("formFill.loading")} />;

  if (error || !form) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>{t("formView.notFoundTitle", "Form Not Found")}</h4>
          <p>
            {t(
              "formView.notFoundText",
              "The form submission you're looking for doesn't exist or has been deleted."
            )}
          </p>
          <Button onClick={() => navigate("/forms")} variant="outline-primary">
            <ArrowLeft size={16} className="me-2" />
            {t("formView.backToForms", "Back to Forms")}
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
            onClick={() => navigate("/forms")}
            variant="outline-secondary"
            size="sm"
            className="me-3"
          >
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="h4 mb-1">
              <FileText size={20} className="me-2" />
              {t("formView.title", "Form Submission")}
            </h1>
            <p className="text-muted mb-0">
              {t("formView.forTemplate", {
                title: form.template.title,
                defaultValue: `for "${form.template.title}"`,
              })}
            </p>
          </div>
        </div>

        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm" onClick={handleShare}>
            <Share2 size={16} className="me-2" />
            {t("common.share")}
          </Button>
          {canEdit && (
            <Button
              onClick={() => navigate(`/forms/${form.id}/edit`)}
              variant="outline-primary"
              size="sm"
            >
              <Edit size={16} className="me-2" />
              {t("formView.edit", "Edit")}
            </Button>
          )}

          {canDelete && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 size={16} className="me-2" />
              {t("formView.delete", "Delete")}
            </Button>
          )}
        </div>
      </div>

      {/* Form Details */}
      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">{t("formView.answers", "Answers")}</h5>
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
              <h6 className="mb-0">
                {t("formView.submissionDetails", "Submission Details")}
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <User size={16} className="me-2 text-muted" />
                <span>
                  <strong>{t("formView.submittedBy", "Submitted by:")}</strong>{" "}
                  {form.user.name}
                </span>
              </div>

              <div className="d-flex align-items-center mb-3">
                <Calendar size={16} className="me-2 text-muted" />
                <span>
                  <strong>{t("formView.submitted", "Submitted:")}</strong>{" "}
                  {formatDistanceToNow(new Date(form.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {form.updatedAt !== form.createdAt && (
                <div className="d-flex align-items-center mb-3">
                  <Calendar size={16} className="me-2 text-muted" />
                  <span>
                    <strong>
                      {t("formView.lastUpdated", "Last updated:")}
                    </strong>{" "}
                    {formatDistanceToNow(new Date(form.updatedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              )}

              <hr />

              <h6 className="mb-2">
                {t("formView.templateInfo", "Template Info")}
              </h6>
              <p className="mb-2">
                <strong>{t("formView.templateTitle", "Title:")}</strong>{" "}
                {form.template.title}
              </p>
              <p className="mb-2">
                <strong>{t("formView.topic", "Topic:")}</strong>{" "}
                <Badge bg="primary">{form.template.topic}</Badge>
              </p>
              <p className="mb-0">
                <strong>{t("formView.createdBy", "Created by:")}</strong>{" "}
                {form.template.owner.name}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ConfirmModal
        show={showDeleteModal}
        title={t("formView.deleteModalTitle", "Delete Form Submission")}
        message={t(
          "formView.deleteModalMessage",
          "Are you sure you want to delete this form submission? This action cannot be undone."
        )}
        confirmText={t("formView.delete", "Delete")}
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={isDeleting}
      />
    </Container>
  );
};
