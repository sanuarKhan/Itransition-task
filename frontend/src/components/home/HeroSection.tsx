import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Play } from "lucide-react";
import { useAuthStore } from "../../store/index";
// path issue fixing
export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuthStore();

  return (
    <section
      className="bg-gradient py-5"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Container>
        <Row className="align-items-center min-vh-50">
          <Col lg={6} className="text-white">
            <h1 className="display-4 fw-bold mb-4">{t("home.hero.title")}</h1>
            <p className="lead mb-4">{t("home.hero.subtitle")}</p>
            <div className="d-flex gap-3">
              <Button
                onClick={() => navigate(user ? "/dashboard" : "/register")}
                variant="light"
                size="lg"
                className="px-4"
              >
                {t("home.hero.getStarted")}{" "}
                <ArrowRight size={20} className="ms-2" />
              </Button>
              <Button
                onClick={() => navigate("/templates")}
                variant="outline-light"
                size="lg"
                className="px-4"
              >
                <Play size={20} className="me-2" />
                {t("home.hero.learnMore")}
              </Button>
            </div>
          </Col>
          <Col lg={6} className="text-center">
            <div className="position-relative">
              <div
                className="bg-white rounded-3 shadow-lg p-4 mx-auto"
                style={{ maxWidth: "400px" }}
              >
                <div className="bg-light rounded-2 p-3 mb-3">
                  <div
                    className="bg-primary rounded-1 mb-2"
                    style={{ height: "8px", width: "60%" }}
                  ></div>
                  <div
                    className="bg-secondary rounded-1 mb-2"
                    style={{ height: "6px", width: "80%" }}
                  ></div>
                  <div
                    className="bg-secondary rounded-1"
                    style={{ height: "6px", width: "40%" }}
                  ></div>
                </div>
                <div className="d-flex gap-2 mb-3">
                  <div
                    className="bg-light rounded-1 flex-grow-1"
                    style={{ height: "32px" }}
                  ></div>
                  <div
                    className="bg-light rounded-1 flex-grow-1"
                    style={{ height: "32px" }}
                  ></div>
                </div>
                <div className="bg-primary text-white rounded-2 py-2 text-center">
                  <small className="fw-bold">Create Beautiful Forms</small>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
