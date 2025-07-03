import React, { useEffect, useRef, useState } from "react";
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
import CreatableSelect from "react-select/creatable";
import { useForm, Controller } from "react-hook-form";
import {
  Save,
  ArrowLeft,
  Upload,
  X,
  Users,
  Globe,
  Lock,
  Tag as TagIcon,
  Image as ImageIcon,
} from "lucide-react";
import { useAuthStore, useTemplatesStore } from "../../store/index";
import {
  getTags,
  getTemplate,
  searchUsers,
  uploadImage,
} from "../../services/api";
import type { UpdateTemplateData, Topic } from "../../types/index";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import { QuestionEditor } from "../../components/templates/QuestionEditor";

export const TemplateEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { updateTemplate } = useTemplatesStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const template = templateData?.template;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateTemplateData>({
    // No resolver
    defaultValues: {
      title: "",
      description: "",
      topic: "OTHER",
      image: "",
      tags: [],
      questions: [],
      isPublic: false,
      allowedUserIds: [],
    },
  });

  const watchedValues = watch();
  const [uploadingImage, setUploadingImage] = useState(false);

  // Initialize form data when template loads
  useEffect(() => {
    if (template) {
      reset({
        title: template.title || "",
        description: template.description || "",
        topic: template.topic,
        image: template.thumbnail || "",
        tags: template.tags.map((t) => t.tag.name),
        questions:
          template.questions?.map((q) => ({
            id: q.id,
            title: q.title,
            description: q.description || "",
            type: q.type,
            isRequired: q.isRequired,
            showInTable: q.showInTable,
            order: q.order,
          })) || [],
        isPublic: template.isPublic ?? false,
        allowedUserIds: template.allowedUsers?.map((au) => au.user.id) || [],
      });
    }
  }, [template, reset]);

  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
  });

  const [userSearchQuery, setUserSearchQuery] = useState("");
  const { data: usersData } = useQuery({
    queryKey: ["searchUsers", userSearchQuery],
    queryFn: () => searchUsers(userSearchQuery),
    enabled: userSearchQuery.length >= 2,
  });

  const availableTags = tagsData?.tags || [];
  const availableUsers = usersData?.users || [];

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      const response = await uploadImage(file);
      setValue("image", response.url);
      toast.success("Image uploaded successfully");
      //eslint-disable-next-line
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: UpdateTemplateData) => {
    try {
      const questionsWithOrder = (data.questions || []).map((q, index) => ({
        ...q,
        order: index + 1,
      }));

      await updateTemplate(template.id, {
        ...data,
        questions: questionsWithOrder,
      });
      toast.success("Template updated successfully!");
      navigate(`/templates/${template.id}`);
      //eslint-disable-next-line
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update template");
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

          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Basic Information */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Basic Information</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-4">
                  <Form.Label>Template Name *</Form.Label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="text"
                        placeholder="Enter template name..."
                        isInvalid={!!errors.title}
                      />
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Description *</Form.Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        as="textarea"
                        rows={6}
                        placeholder="Describe your template..."
                        isInvalid={!!errors.description}
                      />
                    )}
                  />
                  <Form.Text className="text-muted">
                    Markdown formatting supported
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.description?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                {watchedValues.description && (
                  <Card className="mb-4 bg-light">
                    <Card.Header className="py-2">
                      <small className="text-muted">Preview</small>
                    </Card.Header>
                    <Card.Body className="py-3">
                      <div className="prose small">
                        <ReactMarkdown>
                          {watchedValues.description}
                        </ReactMarkdown>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                <Form.Group className="mb-4">
                  <Form.Label>Topic *</Form.Label>
                  <Controller
                    name="topic"
                    control={control}
                    render={({ field }) => (
                      <Form.Select {...field}>
                        {topics.map((topic) => (
                          <option key={topic.value} value={topic.value}>
                            {topic.label}
                          </option>
                        ))}
                      </Form.Select>
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.topic?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Questions */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Questions *</h5>
              </Card.Header>
              <Card.Body>
                <QuestionEditor
                  control={control}
                  name="questions"
                  templateTitle={watchedValues.title || template?.title}
                />
                {errors.questions && (
                  <div className="text-danger small mt-2">
                    {errors.questions.message}
                  </div>
                )}
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
                    <TagIcon size={16} className="me-2" />
                    Tags
                  </Form.Label>
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <CreatableSelect
                        {...field}
                        isMulti
                        options={tagOptions}
                        value={field.value?.map((tag) => ({
                          value: tag,
                          label: tag,
                        }))}
                        onChange={(selected) =>
                          field.onChange(
                            selected?.filter(Boolean).map((s) => s.value) || []
                          )
                        }
                        placeholder="Select or create tags..."
                        className="react-select-container"
                        classNamePrefix="react-select"
                      />
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.tags?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <ImageIcon size={16} className="me-2" />
                    Cover Image
                  </Form.Label>

                  {watchedValues.image ? (
                    <div className="position-relative d-inline-block">
                      <Image
                        src={watchedValues.image}
                        alt="Template cover"
                        className="rounded border"
                        style={{ maxWidth: "300px", maxHeight: "200px" }}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0 rounded-circle"
                        style={{ transform: "translate(50%, -50%)" }}
                        onClick={() => setValue("image", "")}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border border-dashed rounded p-4 text-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {uploadingImage ? (
                        <LoadingSpinner text="Uploading..." />
                      ) : (
                        <>
                          <Upload size={32} className="text-muted mb-2" />
                          <p className="text-muted mb-0">
                            Click to upload cover image
                          </p>
                          <small className="text-muted">
                            PNG, JPG up to 5MB
                          </small>
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
                  <Form.Control.Feedback type="invalid">
                    {errors.image?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Access Control */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Access Control</h5>
              </Card.Header>
              <Card.Body>
                <Controller
                  name="isPublic"
                  control={control}
                  render={({ field }) => (
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
                        checked={field.value}
                        onChange={() => field.onChange(true)}
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
                                Only specific users can view and fill this
                                template
                              </small>
                            </div>
                          </div>
                        }
                        checked={!field.value}
                        onChange={() => field.onChange(false)}
                      />
                    </div>
                  )}
                />

                {!watchedValues.isPublic && (
                  <Form.Group className="mb-4">
                    <Form.Label>
                      <Users size={16} className="me-2" />
                      Allowed Users
                    </Form.Label>
                    <Controller
                      name="allowedUserIds"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isMulti
                          options={userOptions}
                          value={field.value
                            ?.map((id) => {
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
                            .filter(
                              (s): s is { value: string; label: string } =>
                                s !== null
                            )}
                          onChange={(selected) =>
                            field.onChange(
                              selected?.filter(Boolean).map((s) => s.value) ||
                                []
                            )
                          }
                          onInputChange={setUserSearchQuery}
                          placeholder="Search and select users..."
                          noOptionsMessage={() => "Type to search users..."}
                        />
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.allowedUserIds?.message}
                    </Form.Control.Feedback>
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
