import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-light py-4 mt-auto border-top">
      <Container>
        <Row>
          <Col md={6}>
            <h5 className="fw-bold">FormCraft</h5>
            <p className="text-muted">
              Create beautiful forms, surveys, and questionnaires with ease.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="text-muted mb-0">
              © {new Date().getFullYear()} FormCraft. Built with React &
              Express.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
