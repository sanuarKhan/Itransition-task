// import React from "react";
// import { Container, Row, Col, Button, Card } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { useQuery } from "@tanstack/react-query";

// import {
//   getLatestTemplates,
//   getPopularTemplates,
//   getTagCloud,
// } from "../services/api";
// import { useAuthStore } from "../store/index";
// import { LoadingSpinner } from "../components/ui/LoadingSpinner";
// import { TemplateCard } from "../components/templates/TemplateCard";
// import { TagCloud } from "../components/ui/TagCloud";
import { ModernHero } from "../components/home/HeroSection";
import {
  FeatureCard,
  ModernTemplateCard,
  StatsCard,
} from "../components/home/FeaturesSection";
import {
  PlusCircle,
  Heart,
  TrendingUp,
  Users,
  BarChart3,
  Eye,
  MessageSquare,
  Calendar,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Globe,
  Menu,
  X,
  Search,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Share2,
} from "lucide-react";
import { mockTemplates } from "@/mockdata";
import { colors } from "@/constants";

// Modern Color Palette
// const colors = {
//   primary: "#6366f1",
//   secondary: "#8b5cf6",
//   accent: "#ec4899",
//   success: "#10b981",
//   warning: "#f59e0b",
//   dark: "#1e293b",
//   light: "#f8fafc",
//   gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
// };

export const HomePage: React.FC = () => {
  // const { t } = useTranslation();
  // const { user } = useAuthStore();
  // const navigate = useNavigate();

  // const { data: latestTemplates, isLoading: loadingLatest } = useQuery({
  //   queryKey: ["latestTemplates"],
  //   queryFn: getLatestTemplates,
  //   staleTime: 5 * 60 * 1000,
  // });

  // const { data: popularTemplates, isLoading: loadingPopular } = useQuery({
  //   queryKey: ["popularTemplates"],
  //   queryFn: getPopularTemplates,
  //   staleTime: 5 * 60 * 1000,
  // });

  // // Fetch tag cloud
  // const { data: tagCloudData, isLoading: loadingTags } = useQuery({
  //   queryKey: ["tagCloud"],
  //   queryFn: getTagCloud,
  //   staleTime: 10 * 60 * 1000,
  // });

  return (
    <div>
      <ModernHero />
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "6rem 2rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              marginBottom: "1rem",
              color: colors.dark,
            }}
          >
            Powerful Features
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#64748b",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Everything you need to create, share, and analyze forms efficiently
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          <FeatureCard
            icon={Zap}
            title="Easy Creation"
            description="Drag and drop interface to build forms quickly with intuitive controls"
            color={colors.primary}
          />
          <FeatureCard
            icon={BarChart3}
            title="Smart Analytics"
            description="Get insights from responses with built-in analytics and visualizations"
            color={colors.accent}
          />
          <FeatureCard
            icon={Shield}
            title="Secure & Private"
            description="Advanced privacy controls and secure data handling for peace of mind"
            color={colors.success}
          />
          <FeatureCard
            icon={Globe}
            title="Multi-language"
            description="Support for multiple languages and international users worldwide"
            color={colors.warning}
          />
        </div>
      </div>

      {/* Stats Section */}
      <div
        style={{
          background: "white",
          padding: "4rem 2rem",
          borderTop: "1px solid #e2e8f0",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "2rem",
            }}
          >
            <StatsCard
              icon={Users}
              label="Active Users"
              value="12,543"
              trend={12.5}
              color={colors.primary}
            />
            <StatsCard
              icon={BarChart3}
              label="Templates Created"
              value="3,892"
              trend={8.3}
              color={colors.accent}
            />
            <StatsCard
              icon={TrendingUp}
              label="Forms Submitted"
              value="45,231"
              trend={15.7}
              color={colors.success}
            />
            <StatsCard
              icon={MessageSquare}
              label="Comments"
              value="8,743"
              trend={-2.1}
              color={colors.warning}
            />
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "6rem 2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "3rem",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "800",
                marginBottom: "0.5rem",
                color: colors.dark,
              }}
            >
              Popular Templates
            </h2>
            <p style={{ color: "#64748b" }}>
              Explore our most-used form templates
            </p>
          </div>
          <button
            style={{
              background: colors.primary,
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 20px rgba(99, 102, 241, 0.3)",
            }}
          >
            View All <ArrowRight size={20} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
          }}
        >
          {mockTemplates.map((template, i) => (
            <ModernTemplateCard key={i} template={template} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div
        style={{
          background: colors.gradient,
          padding: "6rem 2rem",
          textAlign: "center",
          color: "white",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              marginBottom: "1.5rem",
            }}
          >
            Ready to Create Your First Form?
          </h2>
          <p
            style={{
              fontSize: "1.25rem",
              marginBottom: "2rem",
              opacity: 0.95,
            }}
          >
            Join thousands of users creating beautiful forms and gathering
            valuable insights
          </p>
          <button
            style={{
              background: "white",
              color: colors.primary,
              border: "none",
              padding: "1rem 2.5rem",
              borderRadius: "12px",
              fontSize: "1.125rem",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
            }}
          >
            Get Started Free{" "}
            <ArrowRight
              size={20}
              style={{ marginLeft: "0.5rem", display: "inline" }}
            />
          </button>
        </div>
      </div>

      {/* <Container className="py-5">
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">{t("home.latest.title")}</h2>
            <Button
              onClick={() => navigate("/templates")}
              variant="outline-primary"
            >
              {t("home.latest.viewAll")}{" "}
              <ArrowRight size={16} className="ms-1" />
            </Button>
          </div>

          {loadingLatest ? (
            <LoadingSpinner center />
          ) : (
            <Row>
              {latestTemplates?.templates.map((template) => (
                <Col key={template.id} md={6} lg={4} className="mb-4">
                  <TemplateCard template={template} />
                </Col>
              ))}
            </Row>
          )}
        </section>

        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold d-flex align-items-center">
              <TrendingUp size={24} className="me-2 text-primary" />
              {t("home.popular.title")}
            </h2>
          </div>

          {loadingPopular ? (
            <LoadingSpinner center />
          ) : (
            <Row>
              {popularTemplates?.templates
                .slice(0, 5)
                .map((template, index) => (
                  <Col key={template.id} lg={12} className="mb-3">
                    <Card className="shadow-sm">
                      <Card.Body className="d-flex align-items-center">
                        <div
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <span className="fw-bold">#{index + 1}</span>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-1">
                            <Link
                              to={`/templates/${template.id}`}
                              className="text-decoration-none"
                            >
                              {template.title}
                            </Link>
                          </h5>
                          <small className="text-muted">
                            {t("home.popular.responses", {
                              count: template._count.forms,
                            })}{" "}
                            • {template.owner.name}
                          </small>
                        </div>
                        <div className="text-end">
                          <div className="text-primary fw-bold">
                            {template._count.forms}
                          </div>
                          <small className="text-muted">responses</small>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
            </Row>
          )}
        </section>

        <section className="mb-5">
          <h2 className="fw-bold mb-4">{t("home.tagCloud.title")}</h2>
          {loadingTags ? (
            <LoadingSpinner center />
          ) : (
            <TagCloud tags={tagCloudData?.tags || []} />
          )}
        </section>

        {user && (
          <section className="text-center py-5">
            <Card className="bg-primary text-white">
              <Card.Body className="py-5">
                <h3 className="fw-bold mb-3">
                  Ready to create your first form?
                </h3>
                <p className="mb-4">
                  Start building beautiful, responsive forms in minutes.
                </p>
                <Button
                  onClick={() => navigate("/templates/create")}
                  variant="light"
                  size="lg"
                >
                  <PlusCircle size={20} className="me-2" />
                  Create Your First Template
                </Button>
              </Card.Body>
            </Card>
          </section>
        )}
      </Container> */}
    </div>
  );
};
