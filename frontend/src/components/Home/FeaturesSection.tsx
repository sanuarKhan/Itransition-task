import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  PlusCircle,
  Palette,
  BarChart3,
  Share2,
  Grab,
  Globe,
  Shield,
  Zap,
} from "lucide-react";
// path issue fixing
export const FeaturesSection: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <PlusCircle size={32} className="text-primary" />,
      title: t("home.features.create.title"),
      description: t("home.features.create.description"),
    },
    {
      icon: <Palette size={32} className="text-success" />,
      title: t("home.features.customize.title"),
      description: t("home.features.customize.description"),
    },
    {
      icon: <BarChart3 size={32} className="text-info" />,
      title: t("home.features.analyze.title"),
      description: t("home.features.analyze.description"),
    },
    {
      icon: <Share2 size={32} className="text-warning" />,
      title: t("home.features.share.title"),
      description: t("home.features.share.description"),
    },
    {
      icon: <Grab size={32} className="text-purple" />,
      title: "Drag & Drop",
      description: "Intuitive drag and drop interface for reordering questions",
    },
    {
      icon: <Globe size={32} className="text-primary" />,
      title: "Multi-language",
      description: "Support for multiple languages and international users",
    },
    {
      icon: <Shield size={32} className="text-success" />,
      title: "Secure & Private",
      description: "Advanced privacy controls and secure data handling",
    },
    {
      icon: <Zap size={32} className="text-warning" />,
      title: "Real-time Updates",
      description: "Live comments and instant form submissions",
    },
  ];

  return (
    <section className="py-5 bg-light">
      <Container>
        <Row className="text-center mb-5">
          <Col>
            <h2 className="fw-bold mb-3">{t("home.features.title")}</h2>
            <p className="lead text-muted">
              Powerful features to help you create, share, and analyze forms
              efficiently
            </p>
          </Col>
        </Row>
        <Row>
          {features.map((feature, index) => (
            <Col key={index} md={6} lg={3} className="mb-4">
              <Card className="h-100 border-0 shadow-sm hover-lift">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">{feature.icon}</div>
                  <h5 className="fw-bold mb-2">{feature.title}</h5>
                  <p className="text-muted small">{feature.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};
