import { Link } from "react-router-dom";
import { useState } from "react";
import type { FormEvent } from "react";
import image1 from "../assets/checking.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../utils/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.success) {
        toast("Login successful");
        localStorage.setItem("token", res.token);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          axiosError.response?.data?.message ||
            "An error occurred in login backend"
        );
      } else {
        toast.error("An unexpected error occurred in login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-info">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100">
      <div className="col-lg-6 bg-white px-3 px-md-4 px-lg-5">
        <div className="mx-auto d-flex flex-column min-vh-100 max-width-sm">
          <header className="py-3 py-md-4">
            <h1 className="h4 h-md-3 h-lg-2 text-primary mb-0 fw-bold">
              THE APP
            </h1>
          </header>

          <main className="flex-grow-1 d-flex flex-column justify-content-center  py-3 m-lg-5 p-lg-5">
            <div className="mb-3 mb-md-4">
              <p className="text-muted small mb-1 mb-md-2">
                Start your journey
              </p>
              <h2 className="h4 h-md-3 text-dark mb-0">Sign In to The App</h2>
            </div>

            <form className="mb-3 mb-md-4" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">
                  E-mail
                </label>
                <div className="position-relative">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="test@example.com"
                    className="form-control bg-light pe-5"
                    required
                  />
                  <i className="bi bi-envelope position-absolute end-0 top-50 translate-middle-y me-3 text-muted"></i>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small mb-1">
                  Password
                </label>
                <div className="position-relative">
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-control bg-light pe-5"
                    required
                  />
                  <i className="bi bi-eye-slash position-absolute end-0 top-50 translate-middle-y me-3 text-muted"></i>
                </div>
              </div>

              <div className="mb-3 mb-md-4 form-check">
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  className="form-check-input"
                />
                <label
                  htmlFor="rememberMe"
                  className="form-check-label text-muted small"
                >
                  Remember me
                </label>
              </div>

              <button
                className="btn btn-primary w-100 py-2 py-md-3 fw-medium"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </main>

          <footer className="py-3 py-md-4">
            <div className="d-flex flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 small">
              <p className="text-muted mb-0">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary text-decoration-none fw-medium"
                >
                  Sign Up
                </Link>
              </p>
              <Link
                to="#"
                className="text-primary text-decoration-none fw-medium"
              >
                Forgot password?
              </Link>
            </div>
          </footer>
        </div>
      </div>

      <div
        className="col-6 d-none d-md-block"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="h-100 d-flex align-items-center justify-content-center p-4">
          <img
            src={image1}
            alt="checking"
            className="img-fluid"
            style={{ maxHeight: "80vh" }}
          />
        </div>
      </div>
    </div>
  );
}
