import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore, useUIStore } from "./store/index";
import { Layout } from "./components/layout/Layout";

// Pages
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ProfilePage } from "./pages/auth/ProfilePage";
import { DashboardPage } from "./pages/DashBoardPage";
import { SearchPage } from "./pages/SearchPage";

// Template Pages
import { TemplatesPage } from "./pages/templates/TemplatesPage";
import { TemplateViewPage } from "./pages/templates/TemplateViewPage";
import { TemplateCreatePage } from "./pages/templates/TemplateCreatePage";
import { TemplateEditPage } from "./pages/templates/TemplateEditPage";

// Form Pages
import { FormsPage } from "./pages/forms/FormsPage";
import { FormViewPage } from "./pages/forms/FormViewPage";
import { FormFillPage } from "./pages/forms/FormFillPage";

// Admin Pages
import { AdminPage } from "./pages/admin/AdminPage";

// Route Guards
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";

function App() {
  const { i18n } = useTranslation();
  const { user, refreshUser } = useAuthStore();
  const { theme, language } = useUIStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme.toLowerCase());

    i18n.changeLanguage(language.toLowerCase());

    const token = localStorage.getItem("token");
    if (token && !user) {
      refreshUser();
    }
  }, [theme, language, i18n, user, refreshUser]);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme.toLowerCase());
  }, [theme]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/templates/:id" element={<TemplateViewPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/templates/create"
          element={
            <ProtectedRoute>
              <TemplateCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/templates/:id/edit"
          element={
            <ProtectedRoute>
              <TemplateEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/templates/:id/fill"
          element={
            <ProtectedRoute>
              <FormFillPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forms"
          element={
            <ProtectedRoute>
              <FormsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forms/:id"
          element={
            <ProtectedRoute>
              <FormViewPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
