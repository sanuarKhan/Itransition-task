import { Link } from "react-router-dom";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import image1 from "../assets/checking.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("api/v1/user/login", formData);
      if (res.data.success) {
        toast.success(res.data.message);
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.success === false
      ) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("An error occurred during login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100">
      <div className="col-6 bg-white px-5">
        <div className="mx-auto d-flex flex-column min-vh-100">
          <header className="py-4">
            <h1 className="display-6 text-primary mb-4">THE APP</h1>
          </header>

          <main className="flex-grow-1 d-flex flex-column justify-content-center p-5 m-5">
            <div className="mb-4">
              <p className="text-muted small mb-2">Start your journey</p>
              <h2 className="h3 text-dark">Sign In to The App</h2>
            </div>

            <form className="mb-4" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="test@example.com"
                  className="form-control bg-light"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-control bg-light"
                  required
                />
              </div>

              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
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
                className="btn btn-primary w-100 py-2"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </main>

          <footer className="py-4">
            <div className="d-flex justify-content-between align-items-center small">
              <p className="text-muted mb-0">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary text-decoration-none"
                >
                  Sign Up
                </Link>
              </p>
              <Link to="#" className="text-primary text-decoration-none">
                Forgot password?
              </Link>
            </div>
          </footer>
        </div>
      </div>

      <div
        className="col-6"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="h-100 d-flex align-items-center justify-content-center">
          <div className="display-1">
            <img src={image1} alt="checking" className="img-fluid w-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
