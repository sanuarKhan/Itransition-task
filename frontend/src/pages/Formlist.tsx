import React, { useState } from "react";
import { Container, Row, Col, Card, Badge, Dropdown } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import  Layout  from "../components/Layout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { formService } from "../services/formService";
import { FormTemplate } from "../types/form.types";
import { TOPICS } from "../utils/constants";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Copy,
  Trash2,
  MoreVertical,
  Calendar,
  Users,
  Globe,
  Lock,
} from "lucide-react";
import { toast } from "react-toastify";

export const FormList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [topicFilter, setTopicFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("updated");

  const {
    data: forms = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["forms", searchTerm, topicFilter, sortBy],
    queryFn: () =>
      formService.getForms({
        search: searchTerm,
        topic: topicFilter,
        sortBy,
      }),
  });

  const handleCreateForm = () => {
    navigate("/forms/new");
  };

  const handleEditForm = (formId: string) => {
    navigate(`/forms/${formId}/edit`);
  };

  const handlePreviewForm = (formId: string) => {
    navigate(`/forms/${formId}/preview`);
  };

  const handleDuplicateForm = async (formId: string) => {
    try {
      await formService.duplicateForm(formId);
      toast.success("Form duplicated successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to duplicate form");
    }
  };

  const handleDeleteForm = async (formId: string) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      try {
        await formService.deleteForm(formId);
        toast.success("Form deleted successfully!");
        refetch();
      } catch (error) {
        toast.error("Failed to delete form");
      }
    }
  };

  const FormCard: React.FC<{ form: FormTemplate }> = ({ form }) => (
    <Card className="h-100 shadow-sm border-0 rounded-3 overflow-hidden hover-shadow-lg transition-all">
      {form.thumbnail && (
        <Card.Img
          variant="top"
          src={form.thumbnail}
          style={{ height: "160px", objectFit: "cover" }}
        />
      )}
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge
            bg={form.isPublic ? "success" : "warning"}
            className="d-flex align-items-center gap-1"
          >
            {form.isPublic ? <Globe size={12} /> : <Lock size={12} />}
            {form.isPublic ? "Public" : "Private"}
          </Badge>
          <Dropdown>
            <Dropdown.Toggle
              variant="link"
              className="border-0 text-muted p-1"
              style={{ boxShadow: "none" }}
            >
              <MoreVertical size={16} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleEditForm(form.id)}>
                <Edit size={14} className="me-2" />
                Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handlePreviewForm(form.id)}>
                <Eye size={14} className="me-2" />
                Preview
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleDuplicateForm(form.id)}>
                <Copy size={14} className="me-2" />
                Duplicate
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                className="text-danger"
                onClick={() => handleDeleteForm(form.id)}
              >
                <Trash2 size={14} className="me-2" />
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Card.Title className="h5 mb-2 text-truncate">{form.title}</Card.Title>

        {form.description && (
          <Card.Text
            className="text-muted small mb-3"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {form.description}
          </Card.Text>
        )}

        <div className="mb-3">
          <Badge bg="light" text="dark" className="me-1">
            {TOPICS.find((t) => t.value === form.topic)?.label || form.topic}
          </Badge>
          {form.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} bg="primary" className="me-1">
              {tag}
            </Badge>
          ))}
          {form.tags.length > 2 && (
            <Badge bg="secondary">+{form.tags.length - 2} more</Badge>
          )}
        </div>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center text-muted small mb-3">
            <span className="d-flex align-items-center gap-1">
              <Calendar size={12} />
              {new Date(form.updatedAt).toLocaleDateString()}
            </span>
            <span className="d-flex align-items-center gap-1">
              <Users size={12} />
              {form.responseCount || 0} responses
            </span>
          </div>

          <div className="d-grid">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleEditForm(form.id)}
            >
              <Edit size={14} className="me-1" />
              Edit Form
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  if (error) {
    return (
      <Layout>
        <Container className="py-5 text-center">
          <h4 className="text-danger">Error loading forms</h4>
          <p className="text-muted">Please try again later</p>
          <Button variant="primary" onClick={() => refetch()}>
            Retry
          </Button>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1">My Forms</h2>
                <p className="text-muted mb-0">Create and manage your forms</p>
              </div>
              <Button variant="primary" onClick={handleCreateForm}>
                <Plus size={16} className="me-2" />
                Create Form
              </Button>
            </div>
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mb-4">
          <Col md={6} lg={4}>
            <div className="position-relative">
              <Search
                size={16}
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
              />
              <Input
                type="text"
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ps-5"
              />
            </div>
          </Col>
          <Col md={3} lg={2}>
            <Select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="w-100"
            >
              <option value="">All Topics</option>
              {TOPICS.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </Select>
          </Col>
          <Col md={3} lg={2}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-100"
            >
              <option value="updated">Last Updated</option>
              <option value="created">Date Created</option>
              <option value="title">Title</option>
              <option value="responses">Responses</option>
            </Select>
          </Col>
        </Row>

        {/* Forms Grid */}
        {isLoading ? (
          <Row>
            {[...Array(6)].map((_, index) => (
              <Col key={index} md={6} lg={4} className="mb-4">
                <Card className="h-100">
                  <Card.Body>
                    <div className="placeholder-glow">
                      <div className="placeholder col-6 mb-2"></div>
                      <div className="placeholder col-4 mb-3"></div>
                      <div className="placeholder col-12 mb-2"></div>
                      <div className="placeholder col-8"></div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : forms.length === 0 ? (
          <Row>
            <Col className="text-center py-5">
              <div className="text-muted mb-4">
                <Plus size={48} className="opacity-25" />
              </div>
              <h4 className="text-muted">No forms found</h4>
              <p className="text-muted mb-4">
                {searchTerm || topicFilter
                  ? "Try adjusting your search criteria"
                  : "Get started by creating your first form"}
              </p>
              <Button variant="primary" onClick={handleCreateForm}>
                <Plus size={16} className="me-2" />
                Create Your First Form
              </Button>
            </Col>
          </Row>
        ) : (
          <Row>
            {forms.map((form) => (
              <Col key={form.id} md={6} lg={4} className="mb-4">
                <FormCard form={form} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </Layout>
  );
};
