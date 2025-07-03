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
import type { LoginData } from "../../types/index";
// path issue fixing
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // FIXED: Use lowercase method name
  const { user, login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: yupResolver(schema),
  });

  if (user) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (data: LoginData) => {
    try {
      console.log("Login attempt with:", data.email); // Debug log
      await login(data);
      toast.success("Login successful!");
      navigate("/dashboard");
      //eslint-disable-next-line
    } catch (error: any) {
      console.error("Login error:", error); // Debug log
      const errorMessage =
        error?.response?.data?.error || error?.message || "Login failed";
      toast.error(errorMessage);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">{t("auth.login.title")}</h2>
                <p className="text-muted">{t("auth.login.subtitle")}</p>
              </div>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>{t("auth.login.email")}</Form.Label>
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
                  <Form.Label>{t("auth.login.password")}</Form.Label>
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

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100 mb-3"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading
                    ? "Signing in..."
                    : t("auth.login.submit")}
                </Button>
              </Form>

              <div className="text-center">
                <p className="mb-0">
                  {t("auth.login.noAccount")}{" "}
                  <Link to="/register" className="text-decoration-none">
                    {t("auth.login.signUp")}
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
