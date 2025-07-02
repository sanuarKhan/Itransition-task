import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  PlusCircle,
  FileText,
  Heart,
  MessageSquare,
  BarChart3,
  ArrowRight,
  Calendar,
  User,
} from "lucide-react";
import { useAuthStore } from "../store/index";
import { getDashboardStats, getMyTemplates } from "../services/api";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { formatSafeDate } from "../utils/dateUtils";

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: statsData, isLoading: loadingStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
    enabled: !!user,
  });

  // Fetch my templates
  const { isLoading: loadingTemplates } = useQuery({
    queryKey: ["myTemplates"],
    queryFn: getMyTemplates,
    enabled: !!user,
  });

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <h4>Please login to access your dashboard</h4>
      </Container>
    );
  }

  const stats = statsData?.stats;
  const recentTemplates = statsData?.recentTemplates || [];
  const recentForms = statsData?.recentForms || [];
  // const myTemplates = templatesData?.templates || [];

  const handleCreateTemplate = () => navigate("/templates/create");
  const handleViewTemplates = () => navigate("/templates");
  const handleViewForms = () => navigate("/forms");
  const handleViewTemplate = (id: string) => navigate(`/templates/${id}`);
  const handleViewForm = (id: string) => navigate(`/forms/${id}`);

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h1 className="h3 mb-1">
          {t("dashboard.welcome", { name: user.name })}
        </h1>
        <p className="text-muted">
          Here's what's happening with your forms and templates
        </p>
      </div>

      {loadingStats ? (
        <LoadingSpinner center />
      ) : (
        <Row className="mb-4">
          <Col md={6} lg={3} className="mb-3">
            <Card className="text-center h-100 border-primary">
              <Card.Body>
                <FileText size={32} className="text-primary mb-2" />
                <h4 className="mb-1">{stats?.templatesCount || 0}</h4>
                <small className="text-muted">
                  {t("dashboard.stats.templates")}
                </small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3} className="mb-3">
            <Card className="text-center h-100 border-success">
              <Card.Body>
                <BarChart3 size={32} className="text-success mb-2" />
                <h4 className="mb-1">{stats?.formsCount || 0}</h4>
                <small className="text-muted">
                  {t("dashboard.stats.forms")}
                </small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3} className="mb-3">
            <Card className="text-center h-100 border-info">
              <Card.Body>
                <MessageSquare size={32} className="text-info mb-2" />
                <h4 className="mb-1">{stats?.commentsCount || 0}</h4>
                <small className="text-muted">
                  {t("dashboard.stats.comments")}
                </small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3} className="mb-3">
            <Card className="text-center h-100 border-danger">
              <Card.Body>
                <Heart size={32} className="text-danger mb-2" />
                <h4 className="mb-1">{stats?.likesCount || 0}</h4>
                <small className="text-muted">
                  {t("dashboard.stats.likes")}
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row>
        {/* Quick Actions */}
        <Col lg={4} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-3">
                <Button
                  onClick={handleCreateTemplate}
                  variant="primary"
                  size="lg"
                >
                  <PlusCircle size={20} className="me-2" />
                  {t("dashboard.quick.createTemplate")}
                </Button>

                <Button onClick={handleViewTemplates} variant="outline-primary">
                  <FileText size={16} className="me-2" />
                  {t("dashboard.quick.viewTemplates")}
                </Button>

                <Button onClick={handleViewForms} variant="outline-secondary">
                  <BarChart3 size={16} className="me-2" />
                  {t("dashboard.quick.viewForms")}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Templates */}
        <Col lg={8} className="mb-4">
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{t("dashboard.recent.templates")}</h5>
              {/* FIXED: Use Button with onClick instead of as={Link as any} */}
              <Button
                onClick={handleViewTemplates}
                variant="outline-primary"
                size="sm"
              >
                View All <ArrowRight size={14} className="ms-1" />
              </Button>
            </Card.Header>
            <Card.Body>
              {loadingTemplates ? (
                <LoadingSpinner center />
              ) : recentTemplates.length === 0 ? (
                <div className="text-center py-4">
                  <FileText size={48} className="text-muted mb-3" />
                  <p className="text-muted">No templates created yet</p>
                  <Button onClick={handleCreateTemplate} variant="primary">
                    Create Your First Template
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="mb-0">
                    <thead>
                      <tr>
                        <th>Template</th>
                        <th>Responses</th>
                        <th>Updated</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTemplates.slice(0, 5).map((template) => (
                        <tr key={template.id}>
                          <td>
                            <div>
                              {/* FIXED: Use Link component directly for text links */}
                              <Link
                                to={`/templates/${template.id}`}
                                className="text-decoration-none fw-medium"
                              >
                                {template.title}
                              </Link>
                              <br />
                              <Badge bg="secondary" className="small">
                                {t(`topics.${template.topic}`)}
                              </Badge>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <BarChart3
                                size={16}
                                className="me-2 text-muted"
                              />
                              {template._count?.forms || 0}
                            </div>
                          </td>
                          <td>
                            <small className="text-muted">
                              {formatSafeDate(
                                template.updatedAt,
                                "Never updated"
                              )}
                            </small>
                          </td>
                          <td>
                            {/* FIXED: Use Button with onClick */}
                            <Button
                              onClick={() => handleViewTemplate(template.id)}
                              variant="outline-primary"
                              size="sm"
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{t("dashboard.recent.forms")}</h5>
              {/* FIXED: Use Button with onClick */}
              <Button
                onClick={handleViewForms}
                variant="outline-primary"
                size="sm"
              >
                View All <ArrowRight size={14} className="ms-1" />
              </Button>
            </Card.Header>
            <Card.Body>
              {recentForms.length === 0 ? (
                <div className="text-center py-4">
                  <BarChart3 size={48} className="text-muted mb-3" />
                  <p className="text-muted">No form submissions yet</p>
                  <Button
                    onClick={handleViewTemplates}
                    variant="outline-primary"
                  >
                    Browse Templates to Fill
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="mb-0">
                    <thead>
                      <tr>
                        <th>Template</th>
                        <th>Created by</th>
                        <th>Submitted</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentForms.slice(0, 5).map((form) => (
                        <tr key={form.id}>
                          <td>
                            {/* FIXED: Use Link component directly */}
                            <Link
                              to={`/templates/${form.template.id}`}
                              className="text-decoration-none fw-medium"
                            >
                              {form.template.title}
                            </Link>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <User size={16} className="me-2 text-muted" />
                              {form.template.owner.name}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Calendar size={16} className="me-2 text-muted" />
                              <small className="text-muted">
                                {formatSafeDate(form.createdAt, "No date")}
                              </small>
                            </div>
                          </td>
                          <td>
                            {/* FIXED: Use Button with onClick */}
                            <Button
                              onClick={() => handleViewForm(form.id)}
                              variant="outline-primary"
                              size="sm"
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
