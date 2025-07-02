import React, { useRef, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";
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
import { getTags, searchUsers, uploadImage } from "../../services/api";
import type { CreateTemplateData } from "../../types";
import { LoadingSpinner } from "../../components/UI/LoadingSpinner";
import ReactMarkdown from "react-markdown";
import { QuestionBuilder } from "../../components/templates/QuestionBuilder";

// Removed yup schema and resolver

export const TemplateCreatePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createTemplate } = useTemplatesStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateTemplateData>({
    defaultValues: {
      title: "",
      description: "",
      topic: "OTHER",
      image: "",
      tags: [],
      questions: [],
      isPublic: true,
      allowedUserIds: [],
    },
  });

  const watchedValues = watch();
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch data
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

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          <h4>Authentication Required</h4>
          <p>Please login to create templates.</p>
          <Button href="/login" variant="primary">
            Login
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

  const onSubmit = async (data: CreateTemplateData) => {
    try {
      const template = await createTemplate(data);
      toast.success("Template created successfully!");
      navigate(`/templates/${template.id}`);
      //eslint-disable-next-line
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create template");
    }
  };

  const topics = [
    { value: "EDUCATION", label: t("topics.EDUCATION") },
    { value: "BUSINESS", label: t("topics.BUSINESS") },
    { value: "QUIZ", label: t("topics.QUIZ") },
    { value: "SURVEY", label: t("topics.SURVEY") },
    { value: "RESEARCH", label: t("topics.RESEARCH") },
    { value: "POLL", label: t("topics.POLL") },
    { value: "OTHER", label: t("topics.OTHER") },
  ] as const;

  const tagOptions = (tagsData?.tags || []).map((tag) => ({
    value: tag.name,
    label: tag.name,
  }));

  const userOptions = (usersData?.users || []).map((user) => ({
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
              <h1 className="h3 mb-1">{t("templates.create.title")}</h1>
              <p className="text-muted mb-0">
                Create a new form template to collect responses
              </p>
            </div>
          </div>
          {/*eslint-disable-next-line */}
          <Form onSubmit={handleSubmit(onSubmit as any)}>
            {/* Basic Information */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Basic Information</h5>
              </Card.Header>
              <Card.Body>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Form.Group className="mb-3">
                      <Form.Label>Template Name *</Form.Label>
                      <Form.Control
                        {...field}
                        type="text"
                        placeholder="Enter template name..."
                        isInvalid={!!errors.title}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.title?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Form.Group className="mb-3">
                      <Form.Label>Description *</Form.Label>
                      <Form.Control
                        {...field}
                        as="textarea"
                        rows={6}
                        placeholder="Describe your template..."
                        isInvalid={!!errors.description}
                      />
                      <Form.Text className="text-muted">
                        Markdown formatting supported
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.description?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  )}
                />

                {watchedValues.description && (
                  <Card className="mb-3 bg-light">
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

                <Controller
                  name="topic"
                  control={control}
                  render={({ field }) => (
                    <Form.Group className="mb-3">
                      <Form.Label>Topic *</Form.Label>
                      <Form.Select {...field}>
                        {topics.map((topic) => (
                          <option key={topic.value} value={topic.value}>
                            {topic.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  )}
                />
              </Card.Body>
            </Card>

            {/* ✅ FIXED: Questions Section with proper component */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Questions *</h5>
              </Card.Header>
              <Card.Body>
                <Controller
                  name="questions"
                  control={control}
                  render={({ field }) => (
                    <>
                      <QuestionBuilder
                        questions={field.value}
                        onChange={field.onChange}
                      />
                      {errors.questions && (
                        <div className="text-danger small mt-2">
                          {errors.questions.message}
                        </div>
                      )}
                    </>
                  )}
                />
              </Card.Body>
            </Card>

            {/* Media & Tags */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Media & Tags</h5>
              </Card.Header>
              <Card.Body>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <TagIcon size={16} className="me-2" />
                        Tags
                      </Form.Label>
                      <CreatableSelect
                        {...field}
                        isMulti
                        options={tagOptions}
                        value={field.value?.map((tag: string) => ({
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
                    </Form.Group>
                  )}
                />

                <Form.Group className="mb-3">
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
                    <div className="mb-3">
                      <Form.Check
                        type="radio"
                        name="access"
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
                        name="access"
                        label={
                          <div className="d-flex align-items-center">
                            <Lock size={16} className="me-2 text-warning" />
                            <div>
                              <div>Restricted</div>
                              <small className="text-muted">
                                Only specific users can access
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
                  <Controller
                    name="allowedUserIds"
                    control={control}
                    render={({ field }) => (
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <Users size={16} className="me-2" />
                          Allowed Users
                        </Form.Label>
                        <Select
                          {...field}
                          isMulti
                          options={userOptions}
                          value={field.value
                            ?.map((id: string) =>
                              userOptions.find(
                                (u: { value: string }) => u.value === id
                              )
                            )
                            .filter(Boolean)}
                          onChange={(selected) =>
                            field.onChange(
                              selected?.filter(Boolean).map((s) => s?.value) ||
                                []
                            )
                          }
                          onInputChange={setUserSearchQuery}
                          placeholder="Search and select users..."
                          noOptionsMessage={() => "Type to search users..."}
                        />
                      </Form.Group>
                    )}
                  />
                )}

                <Alert variant="info" className="mb-3">
                  <strong>Note:</strong> You can change these settings later and
                  add questions after creation.
                </Alert>

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
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="me-2" />
                        Create Template
                      </>
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
