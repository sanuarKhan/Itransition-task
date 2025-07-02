import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../store/index";
// path issue fixing
const schema = yup.object({
  name: yup.string().required("Name is required").min(2, "Name too short"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { user, register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  if (user) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      toast.success("Account created successfully!");
      navigate("/dashboard");
      //eslint-disable-next-line
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage =
        error?.response?.data?.error || error?.message || "Registration failed";
      toast.error(errorMessage);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">{t("auth.register.title")}</h2>
                <p className="text-muted">{t("auth.register.subtitle")}</p>
              </div>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>{t("auth.register.name")}</Form.Label>
                  <Form.Control
                    {...register("name")}
                    type="text"
                    isInvalid={!!errors.name}
                    disabled={isSubmitting || isLoading}
                    placeholder="Enter your full name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t("auth.register.email")}</Form.Label>
                  <Form.Control
                    {...register("email")}
                    type="email"
                    isInvalid={!!errors.email}
                    disabled={isSubmitting || isLoading}
                    placeholder="Enter your email"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t("auth.register.password")}</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      isInvalid={!!errors.password}
                      disabled={isSubmitting || isLoading}
                      className="pe-5"
                      placeholder="Enter your password"
                    />
                    <Button
                      variant="link"
                      className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                      disabled={isSubmitting || isLoading}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errors.password?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t("auth.register.confirmPassword")}</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      isInvalid={!!errors.confirmPassword}
                      disabled={isSubmitting || isLoading}
                      className="pe-5"
                      placeholder="Confirm your password"
                    />
                    <Button
                      variant="link"
                      className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      type="button"
                      disabled={isSubmitting || isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </Button>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100 mb-3"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading
                    ? "Creating account..."
                    : t("auth.register.submit")}
                </Button>
              </Form>

              <div className="text-center">
                <p className="mb-0">
                  {t("auth.register.hasAccount")}{" "}
                  <Link to="/login" className="text-decoration-none">
                    {t("auth.register.signIn")}
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
