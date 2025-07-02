import React from 'react';
import { Card, Badge, Row, Col, Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { 
  Calendar, 
  User, 
  Eye, 
  Heart, 
  MessageSquare, 
  FileText,
  Globe,
  Lock
} from 'lucide-react';
import type { Template } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface TemplateInfoProps {
  template: Template;
}

export const TemplateInfo: React.FC<TemplateInfoProps> = ({ template }) => {
  const { t } = useTranslation();

  const getTopicVariant = (topic: string) => {
    const variants: Record<string, string> = {
      EDUCATION: 'primary',
      BUSINESS: 'success',
      QUIZ: 'warning',
      SURVEY: 'info',
      RESEARCH: 'secondary',
      POLL: 'dark',
      OTHER: 'light'
    };
    return variants[topic] || 'secondary';
  };

  return (
    <Row>
      <Col lg={8}>
        <Card className="mb-4">
          <Card.Body>
            <h4 className="mb-3">Description</h4>
            <div className="prose">
              <ReactMarkdown>{template.description}</ReactMarkdown>
            </div>
          </Card.Body>
        </Card>

        {template.tags && template.tags.length > 0 && (
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-3">{t('templates.view.info.tags')}</h5>
              <div className="d-flex flex-wrap gap-2">
                {template.tags.map(({ tag }) => (
                  <Badge key={tag.id} bg="secondary" className="px-3 py-2">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}
      </Col>

      <Col lg={4}>
        {template.thumbnail && (
          <Card className="mb-4">
            <Image
              src={template.thumbnail}
              alt={template.title}
              className="card-img-top"
              style={{ height: '200px', objectFit: 'cover' }}
            />
          </Card>
        )}

        <Card className="mb-4">
          <Card.Body>
            <h5 className="mb-3">Template Details</h5>
            
            <div className="mb-3">
              <small className="text-muted d-block">Topic</small>
              <Badge bg={getTopicVariant(template.topic)}>
                {t(`topics.${template.topic}`)}
              </Badge>
            </div>

            <div className="mb-3">
              <small className="text-muted d-block">Access</small>
              <div className="d-flex align-items-center">
                {template.isPublic ? (
                  <>
                    <Globe size={16} className="me-2 text-success" />
                    <span className="text-success">Public</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} className="me-2 text-warning" />
                    <span className="text-warning">Restricted</span>
                  </>
                )}
              </div>
            </div>

            <div className="mb-3">
              <small className="text-muted d-block">Created by</small>
              <div className="d-flex align-items-center">
                <User size={16} className="me-2" />
                {template.owner.name}
              </div>
            </div>

            <div className="mb-3">
              <small className="text-muted d-block">Created</small>
              <div className="d-flex align-items-center">
                <Calendar size={16} className="me-2" />
                {formatDistanceToNow(new Date(template.createdAt), { addSuffix: true })}
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <h5 className="mb-3">Statistics</h5>
            
            <Row className="text-center">
              <Col xs={6} className="mb-3">
                <div className="d-flex flex-column align-items-center">
                  <FileText size={24} className="text-primary mb-1" />
                  <div className="fw-bold">{template._count.forms}</div>
                  <small className="text-muted">Responses</small>
                </div>
              </Col>
              <Col xs={6} className="mb-3">
                <div className="d-flex flex-column align-items-center">
                  <Heart size={24} className="text-danger mb-1" />
                  <div className="fw-bold">{template._count.likes}</div>
                  <small className="text-muted">Likes</small>
                </div>
              </Col>
              <Col xs={6}>
                <div className="d-flex flex-column align-items-center">
                  <MessageSquare size={24} className="text-info mb-1" />
                  <div className="fw-bold">{template._count.comments}</div>
                  <small className="text-muted">Comments</small>
                </div>
              </Col>
              <Col xs={6}>
                <div className="d-flex flex-column align-items-center">
                  <Eye size={24} className="text-success mb-1" />
                  <div className="fw-bold">
                    {template.questions?.length || 0}
                  </div>
                  <small className="text-muted">Questions</small>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};