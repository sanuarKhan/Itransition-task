// frontend/src/pages/Templates/TemplateViewPage.tsx - FIXED VERSION
import React, { useState, useEffect } from "react";
import { Container, Tab, Tabs, Button, Alert } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Edit,
  Heart,
  Share2,
  Trash2,
  PlusCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify"; // FIXED: Use react-toastify
import { useAuthStore } from "../../store/index"; // FIXED: Removed useUIStore
import { deleteTemplate, getTemplate, toggleLike } from "../../services/api";
import { LoadingSpinner } from "../../components/UI/LoadingSpinner";
import { ConfirmModal } from "../../components/UI/ConfirmModal";
import { TemplateInfo } from "../../components/Templates/TemplateInfo";
import { TemplateQuestions } from "../../components/Templates/TemplateQuestions";
import { TemplateResults } from "../../components/Templates/TemplateResults";
import { TemplateAnalytics } from "../../components/Templates/TemplateAnalytics";
import { TemplateComments } from "../../components/Templates/TemplateComments";

export const TemplateViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState("info");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Fetch template
  const {
    data: templateData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["template", id],
    queryFn: () => getTemplate(id!),
    enabled: !!id,
  });

  console.log(templateData, "templateData");

  const template = templateData?.template ;

  // Check if current user can edit/delete
  const canEdit =
    user && template && (user.id === template.ownerId || user.role === "ADMIN");

  const canDelete =
    user && template && (user.id === template.ownerId || user.role === "ADMIN");

  // Initialize like status
  useEffect(() => {
    if (template && user) {
      setIsLiked(
        template._count.likes > 0 && template.likes?.some((like: any) => like.userId === user.id) || false
      );
    }
  }, [template, user]);

  const handleLike = async () => {
    if (!user) {
      // FIXED: Use toast instead of addNotification
      toast.error("Please login to like templates");
      return;
    }

    if (!template) return;

    setIsLiking(true);
    try {
      const response = await toggleLike(template.id);
      setIsLiked(response.liked);

      // FIXED: Use toast instead of addNotification
      toast.success(response.message);

      // Refetch template to update like count
      refetch();
    } catch (error: any) {
      // FIXED: Use toast instead of addNotification
      const errorMessage =
        error.response?.data?.error || "Failed to update like";
      toast.error(errorMessage);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!template) return;

    setIsDeleting(true);
    try {
      await deleteTemplate(template.id);

      // FIXED: Use toast instead of addNotification
      toast.success("Template deleted successfully");

      navigate("/templates");
    } catch (error: any) {
      // FIXED: Use toast instead of addNotification
      const errorMessage =
        error.response?.data?.error || "Failed to delete template";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleShare = async () => {
    if (!template) return;

    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);

      // FIXED: Use toast instead of addNotification
      toast.success("Template link copied to clipboard!");
    } catch (error) {
      // FIXED: Use toast instead of addNotification
      toast.error("Failed to copy link");
    }
  };

  if (isLoading) {
    return <LoadingSpinner center text="Loading template..." />;
  }

  if (error || !template) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>Template Not Found</h4>
          <p>
            The template you're looking for doesn't exist or has been deleted.
          </p>
          <Button as={Link} to="/templates" variant="outline-primary">
            <ArrowLeft size={16} className="me-2" />
            Back to Templates
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
            onClick={() => navigate("/templates")}
            variant="outline-secondary"
            size="sm"
            className="me-3"
          >
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="h3 mb-1">{template.title}</h1>
            <p className="text-muted mb-0">
              by {template.owner.name} • {template._count.forms || 0} responses
            </p>
          </div>
        </div>

        <div className="d-flex gap-2">
          {/* Like Button */}
          <Button
            variant={isLiked ? "danger" : "outline-danger"}
            size="sm"
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart
              size={16}
              className={isLiked ? "me-2" : "me-2"}
              fill={isLiked ? "currentColor" : "none"}
            />
            {template._count.likes || 0}
          </Button>

          {/* Share Button */}
          <Button variant="outline-primary" size="sm" onClick={handleShare}>
            <Share2 size={16} className="me-2" />
            Share
          </Button>

          {/* Edit Button */}
          {canEdit && (
            <Button
            onClick={() => navigate(`/templates/${template.id}/edit`)}
            variant="outline-primary"
            size="sm"
          >
              <Edit size={16} className="me-2" />
              Edit
            </Button>
          )}

          {/* Delete Button */}
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

          {/* Fill Form Button */}
          {template.isPublic ||
            (user &&
              (template.allowedUsers?.some((u: any) => u.id === user.id) ||
                canEdit) && (
                <Button
                  onClick={() => navigate(`/templates/${template.id}/fill`)}
                  variant="primary"
                  size="sm"
                >
                  <PlusCircle size={16} className="me-2" />
                  Fill Form
                </Button>
              ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || "info")}
        className="mb-4"
      >
        <Tab eventKey="info" title="Info">
          <TemplateInfo template={template} />
        </Tab>

        <Tab
          eventKey="questions"
          title={`Questions (${template.questions?.length || 0})`}
        >
          <TemplateQuestions template={template} />
        </Tab>

        {canEdit && (
          <Tab
            eventKey="results"
            title={`Results (${template._count.forms || 0})`}
          >
            <TemplateResults templateId={template.id} />
          </Tab>
        )}

        {canEdit && (
          <Tab eventKey="analytics" title="Analytics">
            <TemplateAnalytics templateId={template.id} />
          </Tab>
        )}

        <Tab
          eventKey="comments"
          title={`Comments (${template._count.comments || 0})`}
        >
          <TemplateComments templateId={template.id} />
        </Tab>
      </Tabs>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        title="Delete Template"
        message="Are you sure you want to delete this template? This action cannot be undone and will also delete all associated form responses."
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={isDeleting}
      />
    </Container>
  );
};
