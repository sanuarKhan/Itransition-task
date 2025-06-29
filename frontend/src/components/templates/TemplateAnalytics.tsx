import React from "react";
import { Card, Row, Col, Alert, Badge, ProgressBar } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, Hash, CheckSquare } from "lucide-react";
import { getTemplateAnalytics } from "../../services/api";
import { LoadingSpinner } from "../UI/LoadingSpinner";
import { QuestionAnalytics } from "../../types/index";

interface TemplateAnalyticsProps {
  templateId: string;
}

// Backend response structure (different from frontend expectation)
interface BackendAnalyticsResponse {
  totalResponses: number;
  responsesByDate: Record<string, number>;
  questionAnalytics: Record<
    string,
    {
      question: string;
      type: string;
      totalAnswers: number;
      answers: Array<{
        value: any;
        createdAt: string;
      }>;
      // Additional fields for specific question types
      average?: number;
      min?: number;
      max?: number;
      truePercentage?: number;
      [key: string]: any;
    }
  >;
}

export const TemplateAnalytics: React.FC<TemplateAnalyticsProps> = ({
  templateId,
}) => {
  const { t } = useTranslation();

  const {
    data: analyticsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["templateAnalytics", templateId],
    queryFn: () => getTemplateAnalytics(templateId),
  });

  // Debug log to see the actual structure
  console.log("Raw analytics data:", analyticsData);

  // Convert backend response to frontend format
  const convertBackendToFrontend = (backendData: any): QuestionAnalytics[] => {
    if (!backendData) return [];

    // Handle different possible response structures
    let questionAnalytics: Record<string, any> = {};

    // Case 1: Direct questionAnalytics object
    if (backendData.questionAnalytics) {
      questionAnalytics = backendData.questionAnalytics;
    }
    // Case 2: Already in the expected format (analytics array)
    else if (backendData.analytics && Array.isArray(backendData.analytics)) {
      return backendData.analytics;
    }
    // Case 3: The data itself is the questionAnalytics object
    else if (typeof backendData === "object" && !Array.isArray(backendData)) {
      questionAnalytics = backendData;
    }

    // Convert object to array format
    return Object.entries(questionAnalytics).map(
      ([questionId, data]: [string, any]) => {
        const questionData = data as any;

        // Calculate stats based on question type
        let stats: any = {
          total: questionData.totalAnswers || 0,
          count: questionData.totalAnswers || 0,
        };

        if (questionData.type === "INTEGER") {
          stats = {
            ...stats,
            average: questionData.average,
            min: questionData.min,
            max: questionData.max,
          };
        } else if (questionData.type === "CHECKBOX") {
          const total = questionData.totalAnswers || 0;
          const truePercentage = questionData.truePercentage || 0;
          const trueCount = Math.round((truePercentage / 100) * total);
          stats = {
            ...stats,
            total,
            trueCount,
            falseCount: total - trueCount,
          };
        } else {
          // For text questions, calculate frequency
          const frequency: Record<string, number> = {};
          if (questionData.answers && Array.isArray(questionData.answers)) {
            questionData.answers.forEach((answer: any) => {
              const value = String(answer.value || "").trim();
              if (value) {
                frequency[value] = (frequency[value] || 0) + 1;
              }
            });
          }
          stats = {
            ...stats,
            frequency,
          };
        }

        return {
          questionId,
          questionTitle: questionData.question || `Question ${questionId}`,
          questionType: questionData.type || "SINGLE_LINE",
          stats,
        };
      }
    );
  };

  const analytics = convertBackendToFrontend(analyticsData);
  console.log("Converted analytics:", analytics);

  if (isLoading) {
    return <LoadingSpinner center text="Loading analytics..." />;
  }

  if (error) {
    return (
      <Alert variant="danger">
        Failed to load analytics. Please try again later.
      </Alert>
    );
  }

  if (analytics.length === 0) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <BarChart3 size={48} className="text-muted mb-3" />
          <h5 className="text-muted mb-3">No analytics available</h5>
          <p className="text-muted">
            Analytics will appear here once people start filling out your form.
          </p>
        </Card.Body>
      </Card>
    );
  }

  const renderQuestionAnalytics = (question: QuestionAnalytics) => {
    const { stats, questionType } = question;

    switch (questionType) {
      case "INTEGER":
        return (
          <Card className="mb-4">
            <Card.Header className="d-flex align-items-center">
              <Hash size={20} className="me-2 text-primary" />
              <span className="fw-bold">{question.questionTitle}</span>
              <Badge bg="primary" className="ms-auto">
                Number
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="text-center">
                    <div className="h4 text-primary mb-0">
                      {stats.average?.toFixed(1) || 0}
                    </div>
                    <small className="text-muted">Average</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="h4 text-success mb-0">{stats.min || 0}</div>
                    <small className="text-muted">Minimum</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="h4 text-warning mb-0">{stats.max || 0}</div>
                    <small className="text-muted">Maximum</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="h4 text-info mb-0">{stats.count || 0}</div>
                    <small className="text-muted">Responses</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );

      case "CHECKBOX":
        const truePercentage = stats.total
          ? (stats.trueCount! / stats.total!) * 100
          : 0;
        const falsePercentage = 100 - truePercentage;

        return (
          <Card className="mb-4">
            <Card.Header className="d-flex align-items-center">
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
                    <div className="d-flex justify-content-between mb-1">
                      <span>Yes</span>
                      <span>
                        {stats.trueCount || 0} ({truePercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <ProgressBar
                      variant="success"
                      now={truePercentage}
                      className="mb-2"
                    />
                  </div>
                  <div>
                    <div className="d-flex justify-content-between mb-1">
                      <span>No</span>
                      <span>
                        {stats.falseCount || 0} ({falsePercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <ProgressBar variant="secondary" now={falsePercentage} />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="text-center">
                    <div className="h4 text-primary mb-0">
                      {stats.total || 0}
                    </div>
                    <small className="text-muted">Total Responses</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );

      default: // SINGLE_LINE, MULTI_LINE
        const frequency = stats.frequency || {};
        const sortedEntries = Object.entries(frequency)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10); // Top 10 most frequent answers

        return (
          <Card className="mb-4">
            <Card.Header className="d-flex align-items-center">
              <TrendingUp size={20} className="me-2 text-info" />
              <span className="fw-bold">{question.questionTitle}</span>
              <Badge bg="info" className="ms-auto">
                {questionType === "SINGLE_LINE" ? "Text" : "Long Text"}
              </Badge>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="text-center">
                  <div className="h4 text-primary mb-0">{stats.total || 0}</div>
                  <small className="text-muted">Total Responses</small>
                </div>
              </div>

              {sortedEntries.length > 0 && (
                <div>
                  <h6 className="mb-3">Most Common Answers</h6>
                  {sortedEntries.map(([answer, count], index) => {
                    const percentage = stats.total
                      ? (count / stats.total!) * 100
                      : 0;
                    return (
                      <div key={index} className="mb-2">
                        <div className="d-flex justify-content-between mb-1">
                          <span
                            className="text-truncate me-2"
                            style={{ maxWidth: "70%" }}
                          >
                            {answer}
                          </span>
                          <span>
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <ProgressBar
                          variant="info"
                          now={percentage}
                          style={{ height: "6px" }}
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
  };

  return (
    <div>
      <div className="mb-4">
        <h4 className="d-flex align-items-center">
          <BarChart3 size={24} className="me-2" />
          Analytics Overview
        </h4>
        <p className="text-muted">
          Statistical analysis of responses to help you understand your data
          better.
        </p>
      </div>

      {analytics.map((question) => (
        <div key={question.questionId}>{renderQuestionAnalytics(question)}</div>
      ))}
    </div>
  );
};
