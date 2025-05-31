import { Link } from "react-router-dom";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("api/v1/user/register", formData);

      if (res.data.success) {
        toast(res.data.message);
      }
      navigate("/login");
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.success === false
      ) {
        toast.error(error.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <div className="d-flex justify-content-center">
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : (
    <div className="d-flex min-vh-100">
      <div className="col-6 bg-white px-5">
        <div className="mx-auto d-flex flex-column min-vh-100">
          <header className="py-4">
            <h1 className="display-6 text-primary mb-4">THE APP</h1>
          </header>

          <main className="flex-grow-1 d-flex flex-column justify-content-center p-5 m-5">
            <div className="mb-4">
              <p className="text-muted small mb-2">Start your journey</p>
              <h2 className="h3 text-dark">Sign Up to The App</h2>
            </div>

            <form className="mb-4">
              <div className="mb-3">
                <label className="form-label text-muted small">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="sanuar khan"
                  className="form-control bg-light"
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="test@example.com"
                  className="form-control bg-light"
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
                />
              </div>

              <button
                onClick={handleSubmit}
                className="btn btn-primary w-100 py-2 my-3"
                type="submit"
              >
                Sign Up
              </button>
            </form>
          </main>

          <footer className="py-4">
            <div className="d-flex justify-content-between align-items-center small">
              <p className="text-muted mb-0">
                Already have an account?{" "}
                <Link to="/login" className="text-primary text-decoration-none">
                  Sign in
                </Link>
              </p>
              <Link
                to="/forgot-password"
                className="text-primary text-decoration-none"
              >
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
        <div className="h-100 d-flex align-items-center justify-content-center opacity-25">
          <div className="display-1">🚀</div>
        </div>
      </div>
    </div>
  );
}
