import { useState, useRef } from "react";

import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Alert,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
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
import { useAuthStore, useUIStore, useTemplateStore } from "@/stores"; //TODO:
import { apiService } from "@/services/apiService"; //TODO:
import { CreateTemplateData, Topic, User } from "@/types"; //TODO:
import { LoadingSpinner } from "@/components/LoadingSpinner"; //TODO:
import ReactMarkdown from "react-markdown";
import { set } from "react-hook-form";
import { fi } from "zod/v4/locales";

export const TemplateCreatePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const { createTemplate } = useTemplateStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [templateData, setTemplateData] = useState<CreateTemplateData>({
    title: "",
    description: "",
    topic: "OTHER" as Topic,
    thumbnail: "",
    isPublic: true,
    tags: [],
    allowedUserIds: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [step, setStep] = useState(1);

  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: () => apiService.getTags(), //TODO:
  });

  const availableTags = tagsData?.tags || [];

  const [userSearchQuery, setUserSearchQuery] = useState("");
  const { data: usersData } = useQuery({
    queryKey: ["searchUsers", userSearchQuery],
    queryFn: () => apiService.searchUsers(userSearchQuery), //TODO:
    enabled: userSearchQuery.length >= 2,
  });

  const availableUsers = usersData?.users || [];

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          <h4>You must be logged in to create a template</h4>
          <p>Please log in to create a template</p>
          <Button variant="primary" onClick={() => navigate("/login")}>
            Login
          </Button>
        </Alert>
      </Container>
    );
  }
  const validateStep = (stepNumber: number): boolean => {
    const errors: Record<string, string> = {};
    if (stepNumber === 1) {
      if (!templateData.title.trim()) {
        errors.title = "Title is required";
      }
      if (!templateData.description.trim()) {
        errors.description = "Description is required";
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof CreateTemplateData, value: any) => {
    setFormData({ ...prev, [field]: value }); //TODO:

    if (validationErrors[field]) {
      setValidationErrors({ ...prev, [field]: "" }); //TODO:
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

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addNotification({
        type: "error",
        message: "Please select an image file",
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      addNotification({
        type: "error",
        message: "File size must be less than 10MB",
      });
      return;
    }

    setUploadingImage(true);

    try {
      const res = await apiService.uploadFile(file); //TODO:
      handleChange("thumbnail", res.url);
      addNotification({
        type: "success",
        message: "Image uploaded successfully",
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: error.res?.data.error || "Error uploading image",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) {
      setStep(1);
      return;
    }
    setIsSubmitting(true);
    try {
      const template = await createTemplate(templateData); //TODO:
      addNotification({
        type: "success",
        title: "Template created successfully",
        message: "you can now add questions to your template",
      });
      navigate(`/templates/${template.id}`);
    } catch (error) {
      addNotification({
        type: "error",
        title: error.response?.data.error || "Error creating template",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const topics: { value: Topic; label: string }[] = [
    { value: "EDUCATION", label: "Education" },
    { value: "BUDGETS", label: "Budgets" },
    { value: "QUIZZ", label: "Quiz" },
    { value: "REPORTS", label: "Reports" },
    { value: "RESEARCH", label: "Research" },
    { value: "SURVEY", label: "Survey" },
    { value: "PULL", label: "Poll" },
    { value: "OTHERS", label: "Others" },
  ];
  const tagOptions = availableTags.map((tag) => ({
    value: tag,
    label: tag,
  }));

  const userOptions = availableUsers.map((user) => ({
    value: user.id,
    label: `${user} ${user.email}`,
  }));
  const progress = (step / 3) * 100;

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="d-flex align-items-center mb-4">
            <Button
              variant="link"
              className="p-0 me-3"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-grow-1">
              <h1> {t("templates.create.title")}</h1>
              <p>Create a new form template to collect data</p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
