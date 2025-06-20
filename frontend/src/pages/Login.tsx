import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../services/api/index";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/user";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import type { z } from "zod";
import useAuthStore from "../hooks/useAuthStore";

type LoginFormData = z.infer<typeof loginSchema>;
export default function Login() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      toast.success(data.message);
      login(data.data);
      localStorage.setItem("token", data.data.token);
      console.log(data.data, "from login mutation");
      navigate("/");
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const onSubmit = (data: LoginFormData) => mutation.mutate(data);

  return (
    <div className="container shadow-lg rounded-4 overflow-hidden w-100 vh-100 d-flex align-items-center justify-content-center">
      <Row className="vh-100 w-100 g-0">
        <Col
          xs={12}
          md={6}
          className="col-md-6 d-none d-md-flex align-items-center justify-content-center text-white p-5"
          style={{
            background:
              "linear-gradient(135deg,rgba(12, 8, 12, 0.81),rgba(37, 10, 14, 0.78))",
          }}
        >
          <div className="text-center">
            <h2 className="fw-bold">Welcome Back</h2>
            <p className="mb-0">Sign in to continue your journey</p>
          </div>
        </Col>

        <Col
          xs={12}
          md={6}
          className="col-md-6 d-flex flex-column p-5 align-items-center justify-content-center"
          style={{
            background:
              "linear-gradient(135deg,rgba(248, 136, 248, 0.45),rgba(240, 54, 82, 0.69))",
          }}
        >
          <div className="text-center mb-4">
            <h1 className="fw-bold text-gradient">Sign In</h1>
            <p className="text-muted">
              Enter your credentials to access your account
            </p>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  {...register("email")}
                  type="email"
                  className={`form-control border-start-0 ${
                    errors.email ? "is-invalid" : ""
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  {...register("pass")}
                  type="password"
                  className={`form-control border-start-0 ${
                    errors.pass ? "is-invalid" : ""
                  }`}
                  placeholder="Enter your password"
                />
                {errors.pass && (
                  <div className="invalid-feedback">{errors.pass?.message}</div>
                )}
              </div>
            </div>

            <div className="d-flex justify-content-end mb-3">
              <Link
                to="/forgot-password"
                className="text-decoration-none text-primary"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              {mutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </Form>

          <div className="text-center mt-4 border-top pt-3">
            <p className="mb-0 text-muted">
              Don't have an account?
              <Link to="/register" className="text-primary fw-semibold ms-1">
                Create Account
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
}
