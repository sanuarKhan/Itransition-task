import React from "react";
import { Card, Row, Col, Alert, Badge, ProgressBar } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, Hash, CheckSquare } from "lucide-react";
import { getTemplateAnalytics } from "../../services/api";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import type { QuestionAnalytics } from "../../types";

interface TemplateAnalyticsProps {
  templateId: string;
}

export const TemplateAnalytics: React.FC<TemplateAnalyticsProps> = ({
  templateId,
}) => {
  const {
    data: analyticsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["templateAnalytics", templateId],
    queryFn: () => getTemplateAnalytics(templateId),
    retry: 2,
  });

  // FIXED: Better data conversion
  const convertAnalytics = (data: any): QuestionAnalytics[] => {
    if (!data) return [];

    // Handle different response structures
    const rawAnalytics = data.analytics || data.questionAnalytics || data;

    if (Array.isArray(rawAnalytics)) {
      return rawAnalytics;
    }

    // Convert object to array
    return Object.entries(rawAnalytics).map(
      ([questionId, questionData]: [string, any]) => ({
        questionId,
        questionTitle:
          questionData.question ||
          questionData.title ||
          `Question ${questionId}`,
        questionType: questionData.type || "SINGLE_LINE",
        stats: {
          total: questionData.totalAnswers || questionData.count || 0,
          count: questionData.totalAnswers || questionData.count || 0,
          average: questionData.average,
          min: questionData.min,
          max: questionData.max,
          trueCount: questionData.trueCount,
          falseCount: questionData.falseCount,
          frequency: questionData.frequency || {},
        },
      })
    );
  };

  const analytics = convertAnalytics(analyticsData);

  if (isLoading) {
    return (
      <div className="fade-in">
        <LoadingSpinner center text="Loading analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="fade-in">
        <strong>Error loading analytics</strong>
        <p className="mb-0 mt-2">Please try again later.</p>
      </Alert>
    );
  }

  if (analytics.length === 0) {
    return (
      <Card className="text-center fade-in" style={{ padding: "3rem" }}>
        <BarChart3 size={64} className="mx-auto mb-3 text-muted" />
        <h5 className="text-muted mb-2">No Analytics Available</h5>
        <p className="text-muted mb-0">
          Analytics will appear once people start filling out your form.
        </p>
      </Card>
    );
  }

  const renderQuestionAnalytics = (question: QuestionAnalytics) => {
    const { stats, questionType } = question;

    switch (questionType) {
      case "INTEGER":
        return (
          <Card className="mb-4 hover-lift fade-in">
            <Card.Header className="d-flex align-items-center bg-light">
              <Hash size={20} className="me-2 text-primary" />
              <span className="fw-bold">{question.questionTitle}</span>
              <Badge bg="primary" className="ms-auto">
                Number
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col md={3}>
                  <div className="stat-box">
                    <div className="h3 text-primary mb-1">
                      {stats.average?.toFixed(1) || 0}
                    </div>
                    <small className="text-muted">Average</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stat-box">
                    <div className="h3 text-success mb-1">{stats.min || 0}</div>
                    <small className="text-muted">Minimum</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stat-box">
                    <div className="h3 text-warning mb-1">{stats.max || 0}</div>
                    <small className="text-muted">Maximum</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stat-box">
                    <div className="h3 text-info mb-1">{stats.count || 0}</div>
                    <small className="text-muted">Responses</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );

      case "CHECKBOX": {
        const total = stats.total || 0;
        const trueCount = stats.trueCount || 0;
        const falseCount = stats.falseCount || 0;
        const truePercentage = total ? (trueCount / total) * 100 : 0;
        const falsePercentage = 100 - truePercentage;

        return (
          <Card className="mb-4 hover-lift fade-in">
            <Card.Header className="d-flex align-items-center bg-light">
              <CheckSquare size={20} className="me-2 text-success" />
              <span className="fw-bold">{question.questionTitle}</span>
              <Badge bg="success" className="ms-auto">
                Checkbox
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-semibold">Yes</span>
                      <span className="text-muted">
                        {trueCount} ({truePercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <ProgressBar
                      variant="success"
                      now={truePercentage}
                      animated
                      style={{ height: "12px" }}
                    />
                  </div>
                  <div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-semibold">No</span>
                      <span className="text-muted">
                        {falseCount} ({falsePercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <ProgressBar
                      variant="secondary"
                      now={falsePercentage}
                      animated
                      style={{ height: "12px" }}
                    />
                  </div>
                </Col>
                <Col
                  md={6}
                  className="d-flex align-items-center justify-content-center"
                >
                  <div className="text-center">
                    <div className="h2 text-primary mb-1">{total}</div>
                    <small className="text-muted">Total Responses</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
      }

      default: {
        const frequency = stats.frequency || {};
        const sortedEntries = Object.entries(frequency)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10);

        return (
          <Card className="mb-4 hover-lift fade-in">
            <Card.Header className="d-flex align-items-center bg-light">
              <TrendingUp size={20} className="me-2 text-info" />
              <span className="fw-bold">{question.questionTitle}</span>
              <Badge bg="info" className="ms-auto">
                {questionType === "SINGLE_LINE" ? "Text" : "Long Text"}
              </Badge>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-4">
                <div className="h3 text-primary mb-1">{stats.total || 0}</div>
                <small className="text-muted">Total Responses</small>
              </div>

              {sortedEntries.length > 0 && (
                <div>
                  <h6 className="mb-3 text-muted">Most Common Answers</h6>
                  {sortedEntries.map(([answer, count], index) => {
                    const percentage = stats.total
                      ? (count / stats.total!) * 100
                      : 0;
                    return (
                      <div key={index} className="mb-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span
                            className="text-truncate me-2"
                            style={{ maxWidth: "70%" }}
                          >
                            {answer}
                          </span>
                          <span className="text-muted fw-semibold">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <ProgressBar
                          variant="info"
                          now={percentage}
                          animated
                          style={{ height: "8px" }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </Card.Body>
          </Card>
        );
      }
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h4 className="d-flex align-items-center">
          <BarChart3 size={28} className="me-2 text-primary" />
          Analytics Overview
        </h4>
        <p className="text-muted">
          Statistical analysis of responses to help you understand your data
          better.
        </p>
      </div>

      {analytics.map((question, index) => (
        <div
          key={question.questionId}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {renderQuestionAnalytics(question)}
        </div>
      ))}
    </div>
  );
};
