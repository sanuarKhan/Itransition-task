import React from "react";
import { useTranslation } from "react-i18next";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  ProgressBar,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Send, ArrowLeft, Clock, User } from "lucide-react";
import { useAuthStore, useFormsStore } from "../../store/index";
import { checkFormSubmission, getTemplate } from "../../services/api";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import type { Question } from "../../types/index";
import { formatDistanceToNow } from "date-fns";

const createValidationSchema = (
  questions: Question[],
  t: (key: string) => string
) => {
  // eslint-disable-next-line
  const schemaFields: any = {};

  questions.forEach((question) => {
    if (question.isRequired) {
      switch (question.type) {
        case "SINGLE_LINE":
        case "MULTI_LINE":
          schemaFields[question.id] = yup
            .string()
            .required(t("formFill.required"));
          break;
        case "INTEGER":
          schemaFields[question.id] = yup
            .number()
            .required(t("formFill.required"))
            .min(0, t("formFill.nonNegative"));
          break;
        case "CHECKBOX":
          schemaFields[question.id] = yup
            .boolean()
            .required(t("formFill.required"));
          break;
      }
    } else {
      switch (question.type) {
        case "INTEGER":
          schemaFields[question.id] = yup
            .number()
            .min(0, t("formFill.nonNegative"))
            .nullable();
          break;
        default:
          schemaFields[question.id] = yup.mixed().nullable();
      }
    }
  });

  return yup.object(schemaFields);
};

export const FormFillPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { submitForm } = useFormsStore();

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

  // Check existing form
  const { data: formCheckData } = useQuery({
    queryKey: ["formCheck", id],
    queryFn: () => checkFormSubmission(id!),
    enabled: !!id && !!user,
  });

  const template = templateData?.template;
  const existingForm = formCheckData?.form;
  const hasFilled = formCheckData?.hasFilled;
  const questions = React.useMemo(
    () => template?.questions?.slice().sort((a, b) => a.order - b.order) || [],
    [template]
  );

  // Create dynamic form with validation
  const validationSchema = React.useMemo(
    () =>
      questions.length > 0
        ? createValidationSchema(questions, t)
        : yup.object(),
    [questions, t]
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: React.useMemo(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const defaults: any = {};
      if (existingForm?.answers) {
        existingForm.answers.forEach((answer) => {
          if (answer.valueText) defaults[answer.questionId] = answer.valueText;
          if (answer.valueInt !== null)
            defaults[answer.questionId] = answer.valueInt;
          if (answer.valueBool !== null)
            defaults[answer.questionId] = answer.valueBool;
        });
      }
      return defaults;
    }, [existingForm]),
  });

  const watchedValues = watch();

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          <h4>{t("formFill.authRequiredTitle")}</h4>
          <p>{t("formFill.authRequiredText")}</p>
          <Button href="/login" variant="primary">
            {t("formFill.login")}
          </Button>
        </Alert>
      </Container>
    );
  }

  if (isLoading) return <LoadingSpinner center text={t("formFill.loading")} />;

  if (error || !template) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">
          <h4>{t("formFill.notFoundTitle")}</h4>
          <p>{t("formFill.notFoundText")}</p>
          <Button onClick={() => navigate(-1)} variant="primary">
            {t("formFill.goBack")}
          </Button>
        </Alert>
      </Container>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      const formData = {
        answers: questions.map((question) => ({
          questionId: question.id,
          valueText:
            question.type === "SINGLE_LINE" || question.type === "MULTI_LINE"
              ? data[question.id] || null
              : null,
          valueInt:
            question.type === "INTEGER"
              ? data[question.id] !== undefined && data[question.id] !== ""
                ? Number(data[question.id])
                : null
              : null,
          valueBool:
            question.type === "CHECKBOX"
              ? data[question.id] !== undefined
                ? Boolean(data[question.id])
                : null
              : null,
        })),
      };

      await submitForm(template.id, formData);
      toast.success(
        hasFilled ? t("formFill.updateSuccess") : t("formFill.submitSuccess")
      );
      navigate("/forms");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.error || t("formFill.submitFail"));
    }
  };

  const renderQuestion = (question: Question) => (
    <Card key={question.id} className="mb-4">
      <Card.Body>
        <div className="mb-3">
          <Form.Label className="h6">
            {question.title}
            {question.isRequired && <span className="text-danger ms-1">*</span>}
          </Form.Label>
          {question.description && (
            <Form.Text className="text-muted d-block mb-2">
              {question.description}
            </Form.Text>
          )}
        </div>

        <Controller
          name={question.id}
          control={control}
          render={({ field }): React.ReactElement => {
            switch (question.type) {
              case "SINGLE_LINE":
                return (
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder={t("formFill.singleLinePlaceholder")}
                    isInvalid={!!errors[question.id]}
                    disabled={isSubmitting}
                  />
                );
              case "MULTI_LINE":
                return (
                  <Form.Control
                    {...field}
                    as="textarea"
                    rows={4}
                    placeholder={t("formFill.multiLinePlaceholder")}
                    isInvalid={!!errors[question.id]}
                    disabled={isSubmitting}
                  />
                );
              case "INTEGER":
                return (
                  <Form.Control
                    {...field}
                    type="number"
                    min="0"
                    placeholder={t("formFill.integerPlaceholder")}
                    isInvalid={!!errors[question.id]}
                    disabled={isSubmitting}
                    value={field.value || ""}
                  />
                );
              case "CHECKBOX":
                return (
                  <Form.Check
                    {...field}
                    type="checkbox"
                    label={t("formFill.checkboxLabel")}
                    checked={field.value || false}
                    isInvalid={!!errors[question.id]}
                    disabled={isSubmitting}
                  />
                );
              default:
                return <></>;
            }
          }}
        />

        {errors[question.id] && (
          <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
            {errors[question.id]?.message as string}
          </Form.Control.Feedback>
        )}
      </Card.Body>
    </Card>
  );

  const filledQuestions = questions.filter((q) => {
    const value = watchedValues[q.id];
    return value !== undefined && value !== null && value !== "";
  }).length;

  const progress =
    questions.length > 0 ? (filledQuestions / questions.length) * 100 : 0;

  return (
    <Container className="py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="d-flex align-items-center mb-4">
            <Button
              variant="link"
              className="p-0 me-3"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-grow-1">
              <h1 className="h3 mb-1">{template.title}</h1>
              <div className="d-flex align-items-center text-muted">
                <User size={16} className="me-1" />
                <span className="me-3">
                  {t("formFill.by")} {template.owner.name}
                </span>
                <Clock size={16} className="me-1" />
                <span>
                  {t("formFill.created")}{" "}
                  {formatDistanceToNow(new Date(template.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>

          {hasFilled && (
            <Alert variant="info" className="mb-4">
              <strong>{t("formFill.note")}</strong>{" "}
              {t("formFill.alreadySubmitted")}
            </Alert>
          )}

          <Card className="mb-4">
            <Card.Body>
              <div className="prose">{template.description}</div>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body className="py-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-medium">{t("formFill.progress")}</span>
                <span className="text-muted">
                  {t("formFill.progressCount", {
                    filled: filledQuestions,
                    total: questions.length,
                  })}
                </span>
              </div>
              <ProgressBar
                now={progress}
                variant={progress === 100 ? "success" : "primary"}
                style={{ height: "8px" }}
              />
            </Card.Body>
          </Card>

          <Form onSubmit={handleSubmit(onSubmit)}>
            {questions.map(renderQuestion)}

            <div className="d-grid gap-2 mt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting || questions.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    {hasFilled
                      ? t("formFill.updating")
                      : t("formFill.submitting")}
                  </>
                ) : (
                  <>
                    <Send size={20} className="me-2" />
                    {hasFilled
                      ? t("formFill.updateForm")
                      : t("formFill.submitForm")}
                  </>
                )}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
};
