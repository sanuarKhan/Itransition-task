import React, { useState } from "react";
import { Container, Tab, Tabs, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Shield, Users, BarChart3, Activity } from "lucide-react";
import { useAuthStore } from "../../store/index";
import { Navigate } from "react-router-dom";
import { UserManagement } from "../../components/admin/UserManagement";
import { AdminAnalytics } from "../../components/admin/AdminAnalytics";
import { SystemActivity } from "../../components/admin/SystemActivity";
// path issue fixing
export const AdminPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("users");

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center mb-4">
        <Shield size={32} className="me-3 text-primary" />
        <div>
          <h1 className="h3 mb-0">{t("admin.title")}</h1>
          <p className="text-muted mb-0">
            System administration and user management
          </p>
        </div>
      </div>

      <Alert variant="warning" className="mb-4">
        <strong>Admin Access:</strong> You have administrative privileges.
        Please use these tools responsibly.
      </Alert>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || "users")}
        className="mb-4"
      >
        <Tab
          eventKey="users"
          title={
            <span>
              <Users size={16} className="me-2" />
              {t("admin.users.title")}
            </span>
          }
        >
          <UserManagement />
        </Tab>

        <Tab
          eventKey="analytics"
          title={
            <span>
              <BarChart3 size={16} className="me-2" />
              {t("admin.analytics.title")}
            </span>
          }
        >
          <AdminAnalytics />
        </Tab>

        <Tab
          eventKey="activity"
          title={
            <span>
              <Activity size={16} className="me-2" />
              System Activity
            </span>
          }
        >
          <SystemActivity />
        </Tab>
      </Tabs>
    </Container>
  );
};
