import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Image,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import {
  Save,
  ArrowLeft,
  Upload,
  X,
  Users,
  Globe,
  Lock,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import { useAuthStore, useTemplatesStore, useUIStore } from "../../store/index";
import {
  getTags,
  getTemplate,
  searchUsers,
  uploadImage,
} from "../../services/api";
import { UpdateTemplateData, Topic } from "../../types/index";
import { LoadingSpinner } from "../../components/UI/LoadingSpinner";
import ReactMarkdown from "react-markdown";

export const TemplateEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const { updateTemplate } = useTemplatesStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<UpdateTemplateData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Fetch template
  const {
    data: templateData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["template", id],
    queryFn: () => getTemplate(id!),
    enabled: !!id,
  });

  // Fetch available tags
  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
  });

  // Fetch users for access control
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const { data: usersData } = useQuery({
    queryKey: ["searchUsers", userSearchQuery],
    queryFn: () => searchUsers(userSearchQuery),
    enabled: userSearchQuery.length >= 2,
  });

  const template = templateData?.template;
  const availableTags = tagsData?.tags || [];
  const availableUsers = usersData?.users || [];

  // Initialize form data when template loads
  useEffect(() => {
    if (template) {
      setFormData({
        title: template.title,
        description: template.description,
        topic: template.topic,
        image: template.thumbnail || "",
        tags: template.tags.map((t) => t.tag.name),
        isPublic: template.isPublic,
        allowedUserIds: template.allowedUsers?.map((au) => au.user.id) || [],
      });
    }
  }, [template]);

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          <h4>Authentication Required</h4>
          <p>Please login to edit templates.</p>
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return <LoadingSpinner center text="Loading template..." />;
  }

  if (error || !template) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">
          <h4>Template not found</h4>
          <p>
            The template you're trying to edit doesn't exist or you don't have
            permission to edit it.
          </p>
          <Button onClick={() => navigate(-1)} variant="primary">
            Go Back
          </Button>
        </Alert>
      </Container>
    );
  }

  // Check permissions
  const canEdit = user.id === template.ownerId || user.role === "ADMIN";
  if (!canEdit) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          <h4>Access Denied</h4>
          <p>You don't have permission to edit this template.</p>
          <Button onClick={() => navigate(-1)} variant="primary">
            Go Back
          </Button>
        </Alert>
      </Container>
    );
  }

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      errors.title = "Template title is required";
    }
    if (!formData.description?.trim()) {
      errors.description = "Template description is required";
    }
    if (formData.description && formData.description.length < 20) {
      errors.description = "Description should be at least 20 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof UpdateTemplateData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleTagChange = (selectedOptions: any) => {
    const tags = selectedOptions
      ? selectedOptions.map((option: any) => option.value)
      : [];
    handleChange("tags", tags);
  };

  const handleUserChange = (selectedOptions: any) => {
    const userIds = selectedOptions
      ? selectedOptions.map((option: any) => option.value)
      : [];
    handleChange("allowedUserIds", userIds);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addNotification({
        type: "error",
        title: "Please select an image file",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addNotification({
        type: "error",
        title: "Image size must be less than 5MB",
      });
      return;
    }

    setUploadingImage(true);
    try {
      const response = await uploadImage(file);
      handleChange("image", response.url);
      addNotification({
        type: "success",
        title: "Image uploaded successfully",
      });
    } catch (error: any) {
      addNotification({
        type: "error",
        title: error.response?.data?.error || "Failed to upload image",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await updateTemplate(template.id, formData);
      addNotification({
        type: "success",
        title: "Template updated successfully!",
      });
      navigate(`/templates/${template.id}`);
    } catch (error: any) {
      addNotification({
        type: "error",
        title: error.response?.data?.error || "Failed to update template",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const topics: { value: Topic; label: string }[] = [
    { value: "EDUCATION", label: t("topics.EDUCATION") },
    { value: "BUSINESS", label: t("topics.BUSINESS") },
    { value: "QUIZ", label: t("topics.QUIZ") },
    { value: "SURVEY", label: t("topics.SURVEY") },
    { value: "RESEARCH", label: t("topics.RESEARCH") },
    { value: "POLL", label: t("topics.POLL") },
    { value: "OTHER", label: t("topics.OTHER") },
  ];

  const tagOptions = availableTags.map((tag) => ({
    value: tag.name,
    label: tag.name,
  }));

  const userOptions = availableUsers.map((user) => ({
    value: user.id,
    label: `${user.name} (${user.email})`,
  }));

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <Button
              variant="link"
              className="p-0 me-3"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-grow-1">
              <h1 className="h3 mb-1">Edit Template</h1>
              <p className="text-muted mb-0">
                Update your template settings and information
              </p>
            </div>
          </div>

          <Form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Basic Information</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-4">
                  <Form.Label>Template Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Enter template name..."
                    isInvalid={!!validationErrors.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.title}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    placeholder="Describe your template..."
                    isInvalid={!!validationErrors.description}
                  />
                  <Form.Text className="text-muted">
                    Markdown formatting supported
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.description}
                  </Form.Control.Feedback>
                </Form.Group>

                {formData.description && (
                  <Card className="mb-4 bg-light">
                    <Card.Header className="py-2">
                      <small className="text-muted">Preview</small>
                    </Card.Header>
                    <Card.Body className="py-3">
                      <div className="prose small">
                        <ReactMarkdown>{formData.description}</ReactMarkdown>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                <Form.Group className="mb-4">
                  <Form.Label>Topic *</Form.Label>
                  <Form.Select
                    value={formData.topic || ""}
                    onChange={(e) =>
                      handleChange("topic", e.target.value as Topic)
                    }
                  >
                    {topics.map((topic) => (
                      <option key={topic.value} value={topic.value}>
                        {topic.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Media & Tags */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Media & Tags</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <Tag size={16} className="me-2" />
                    Tags
                  </Form.Label>
                  <Select
                    isMulti
                    options={tagOptions}
                    value={(formData.tags || []).map((tag) => ({
                      value: tag,
                      label: tag,
                    }))}
                    onChange={handleTagChange}
                    placeholder="Select or create tags..."
                    noOptionsMessage={() => "Start typing to add tags..."}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <ImageIcon size={16} className="me-2" />
                    Cover Image
                  </Form.Label>

                  {formData.image ? (
                    <div className="position-relative d-inline-block">
                      <Image
                        src={formData.image}
                        alt="Template cover"
                        className="rounded border"
                        style={{ maxWidth: "300px", maxHeight: "200px" }}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0 rounded-circle"
                        style={{ transform: "translate(50%, -50%)" }}
                        onClick={() => handleChange("image", "")}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border border-dashed rounded p-4 text-center cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                      style={{ cursor: "pointer" }}
                    >
                      {uploadingImage ? (
                        <LoadingSpinner text="Uploading..." />
                      ) : (
                        <>
                          <Upload size={32} className="text-muted mb-2" />
                          <p className="text-muted mb-0">
                            Click to upload cover image
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="d-none"
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Access Control */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Access Control</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-4">
                  <Form.Check
                    type="radio"
                    id="edit-public"
                    name="edit-access"
                    label={
                      <div className="d-flex align-items-center">
                        <Globe size={16} className="me-2 text-success" />
                        <div>
                          <div>Public</div>
                          <small className="text-muted">
                            Anyone can view and fill this template
                          </small>
                        </div>
                      </div>
                    }
                    checked={formData.isPublic !== false}
                    onChange={() => handleChange("isPublic", true)}
                    className="mb-3"
                  />

                  <Form.Check
                    type="radio"
                    id="edit-restricted"
                    name="edit-access"
                    label={
                      <div className="d-flex align-items-center">
                        <Lock size={16} className="me-2 text-warning" />
                        <div>
                          <div>Restricted</div>
                          <small className="text-muted">
                            Only specific users can view and fill this template
                          </small>
                        </div>
                      </div>
                    }
                    checked={formData.isPublic === false}
                    onChange={() => handleChange("isPublic", false)}
                  />
                </div>

                {formData.isPublic === false && (
                  <Form.Group className="mb-4">
                    <Form.Label>
                      <Users size={16} className="me-2" />
                      Allowed Users
                    </Form.Label>
                    <Select
                      isMulti
                      options={userOptions}
                      value={(formData.allowedUserIds || [])
                        .map((id) => {
                          const user =
                            availableUsers.find((u) => u.id === id) ||
                            template.allowedUsers?.find(
                              (au) => au.user.id === id
                            )?.user;
                          return user
                            ? {
                                value: user.id,
                                label: `${user.name} (${user.email})`,
                              }
                            : null;
                        })
                        .filter(Boolean)}
                      onChange={handleUserChange}
                      onInputChange={setUserSearchQuery}
                      placeholder="Search and select users..."
                      noOptionsMessage={() => "Type to search users..."}
                    />
                  </Form.Group>
                )}
              </Card.Body>
            </Card>

            {/* Submit Button */}
            <div className="d-grid">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={16} className="me-2" />
                    Update Template
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
