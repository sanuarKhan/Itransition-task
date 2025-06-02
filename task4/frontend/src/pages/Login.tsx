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
      toast.error(error.response?.data?.message);
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
      <div className="col-lg-6 col-12 bg-white px-5">
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
                <div className="position-relative">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="test@example.com"
                    className="form-control bg-light "
                    required
                  />
                  <i className="bi bi-envelope position-absolute end-0 top-0 py-2 me-2"></i>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Password</label>
                <div className="position-relative">
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-control bg-light relative"
                    required
                  />
                  <i className="bi bi-eye-slash position-absolute end-0 top-0 py-2 me-2"></i>
                </div>
              </div>

              <div className="mb-3 form-check">
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
