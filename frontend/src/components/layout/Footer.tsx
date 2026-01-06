import React from "react";
// path issue fixing
import { Container, Row, Col } from "react-bootstrap";
import { useUIStore } from "../../store/index";
export const Footer: React.FC = () => {
  const { theme } = useUIStore();
  return (
    <footer
      expand="lg"
      className="navbar-modern d-flex flex-column"
      style={{
        background:
          theme === "DARK"
            ? "rgba(15, 23, 42, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Container>
        <Row>
          <Col md={6}>
            <h5 className="fw-bold">DoogleTorm</h5>
            <p className="text-muted">
              Create beautiful forms, surveys, and questionnaires with ease.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="text-muted mb-0">
              © {new Date().getFullYear()} DoogleTorm. Built with React &
              Express.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
