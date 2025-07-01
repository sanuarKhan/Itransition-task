import React from "react";
import { Card, Badge, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"; // FIXED: Added useNavigate
import { useTranslation } from "react-i18next";
import {
  Eye,
  Heart,
  MessageSquare,
  FileText,
  User,
  Calendar,
} from "lucide-react";
import { Template } from "../../types/index"; // FIXED: Corrected import path
import { formatSafeDate } from "../../utils/dateUtils"; // FIXED: Use safe date formatting
import { getSafeTags } from "../../utils/tagUtils"; // FIXED: Use tag utilities

interface TemplateCardProps {
  template: Template;
  showAuthor?: boolean;
  showStats?: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  showAuthor = true,
  showStats = true,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // FIXED: Added navigate hook

  const getTopicVariant = (topic: string) => {
    const variants: Record<string, string> = {
      EDUCATION: "primary",
      BUSINESS: "success",
      QUIZ: "warning",
      SURVEY: "info",
      RESEARCH: "secondary",
      POLL: "dark",
      OTHER: "light",
    };
    return variants[topic] || "secondary";
  };

  // FIXED: Use tag utility function
  const safeTags = getSafeTags(template.tags || [], 3);
  const totalTagsCount = template.tags?.length || 0;

  // FIXED: Safe navigation function
  const handleViewClick = () => {
    navigate(`/templates/${template.id}`);
  };

  return (
    <Card className="h-100 shadow-sm border-0 hover-lift template-card">
      {/* Template Image */}
      {template.image && (
        <Card.Img
          variant="top"
          src={template.image}
          style={{ height: "200px", objectFit: "cover" }}
          alt={template.title}
          loading="lazy"
        />
      )}

      <Card.Body className="d-flex flex-column">
        {/* Topic Badge */}
        <div className="mb-2">
          <Badge bg={getTopicVariant(template.topic)} className="mb-2">
            {t(`topics.${template.topic}`)}
          </Badge>
        </div>

        {/* Template Title */}
        <Card.Title className="h5 mb-2">
          <Link
            to={`/templates/${template.id}`}
            className="text-decoration-none text-dark template-title-link"
          >
            {template.title}
          </Link>
        </Card.Title>

        {/* Template Description */}
        <Card.Text className="text-muted flex-grow-1">
          {template.description && template.description.length > 120
            ? `${template.description.substring(0, 120)}...`
            : template.description || "No description available"}
        </Card.Text>

        {/* Tags - FIXED with safe handling */}
        {safeTags.length > 0 && (
          <div className="mb-3">
            {safeTags.map((tag) => (
              <Badge
                key={tag.id}
                bg="light"
                text="dark"
                className="me-1 mb-1 template-tag"
              >
                {tag.name}
              </Badge>
            ))}
            {totalTagsCount > 3 && (
              <Badge bg="light" text="muted" className="template-tag-more">
                +{totalTagsCount - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Template Footer */}
        <div className="mt-auto">
          {/* Author Info */}
          {showAuthor && template.owner && (
            <div className="d-flex align-items-center mb-2 text-muted small">
              <User size={14} className="me-1" />
              <span className="me-3">{template.owner.name}</span>
              <Calendar size={14} className="me-1" />
              <span>{formatSafeDate(template.createdAt, "Unknown date")}</span>
            </div>
          )}

          {/* Template Stats */}
          {showStats && template._count && (
            <Row className="text-muted small mb-3">
              <Col xs={4} className="d-flex align-items-center">
                <FileText size={14} className="me-1" />
                <span>{template._count.forms || 0}</span>
              </Col>
              <Col xs={4} className="d-flex align-items-center">
                <Heart size={14} className="me-1" />
                <span>{template._count.likes || 0}</span>
              </Col>
              <Col xs={4} className="d-flex align-items-center">
                <MessageSquare size={14} className="me-1" />
                <span>{template._count.comments || 0}</span>
              </Col>
            </Row>
          )}

          {/* Action Buttons */}
          <div className="d-flex gap-2">
            {/* FIXED: Use onClick instead of as={Link as any} */}
            <Button
              onClick={handleViewClick}
              variant="outline-primary"
              size="sm"
              className="flex-grow-1"
            >
              <Eye size={14} className="me-1" />
              {t("common.view")}
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
