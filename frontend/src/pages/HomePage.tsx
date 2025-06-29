import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, PlusCircle, TrendingUp } from "lucide-react";
import { getLatestTemplates, getPopularTemplates, getTagCloud } from "../services/api";
import { useAuthStore } from "../store/index";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { TemplateCard } from "../components/Templates/TemplateCard";
import { TagCloud } from "../components/UI/TagCloud";
import { HeroSection } from "../components/Home/HeroSection";
import { FeaturesSection } from "../components/Home/FeaturesSection";

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  // Fetch latest templates
  const { data: latestTemplates, isLoading: loadingLatest } = useQuery({
    queryKey: ["latestTemplates"],
    queryFn: getLatestTemplates,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch popular templates
  const { data: popularTemplates, isLoading: loadingPopular } = useQuery({
    queryKey: ["popularTemplates"],
    queryFn: getPopularTemplates,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch tag cloud
  const { data: tagCloudData, isLoading: loadingTags } = useQuery({
    queryKey: ["tagCloud"],
    queryFn: getTagCloud,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      <Container className="py-5">
        {/* Latest Templates */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">{t("home.latest.title")}</h2>
            <Button as={Link} to="/templates" variant="outline-primary">
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

        {/* Popular Templates */}
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

        {/* Tag Cloud */}
        <section className="mb-5">
          <h2 className="fw-bold mb-4">{t("home.tagCloud.title")}</h2>
          {loadingTags ? (
            <LoadingSpinner center />
          ) : (
            <TagCloud tags={tagCloudData?.tags || []} />
          )}
        </section>

        {/* Call to Action */}
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
                  as={Link}
                  to="/templates/create"
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
      </Container>
    </div>
  );
};
