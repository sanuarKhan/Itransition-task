import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  Eye,
  Edit,
  Trash2,
  Calendar,
} from "lucide-react";
import { useFormsStore, useAuthStore } from "../../store/index";
import { LoadingSpinner } from "../../components/UI/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { ConfirmModal } from "../../components/UI/ConfirmModal";

export const FormsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { forms, fetchMyForms, deleteForm } = useFormsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [deleteFormId, setDeleteFormId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch forms
  const { isLoading } = useQuery({
    queryKey: ["myForms"],
    queryFn: fetchMyForms,
    enabled: !!user,
  });

  // Filter forms
  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      form.template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.template.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesTopic = !topicFilter || form.template.topic === topicFilter;
    return matchesSearch && matchesTopic;
  });

  const handleDeleteForm = async () => {
    if (!deleteFormId) return;

    setIsDeleting(true);
    try {
      await deleteForm(deleteFormId);
      toast.success("Form submission deleted successfully");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to delete form submission";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setDeleteFormId(null);
    }
  };

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

  const topics = Array.from(new Set(forms.map((form) => form.template.topic)));

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <h4>Please login to view your forms</h4>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">{t("forms.title")}</h1>
          <p className="text-muted mb-0">
            View and manage your form submissions
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search forms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
              >
                <option value="">All Topics</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {t(`topics.${topic}`)}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Forms List */}
      {isLoading ? (
        <LoadingSpinner center text="Loading your forms..." />
      ) : filteredForms.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <FileText size={48} className="text-muted mb-3" />
            <h5 className="text-muted mb-3">
              {forms.length === 0
                ? t("forms.noForms")
                : "No forms match your search"}
            </h5>
            <p className="text-muted">
              {forms.length === 0 ? (
                <>
                  {t("forms.fillFirst")}
                  <br />
                  <Link to="/templates" className="text-decoration-none">
                    Browse available templates
                  </Link>
                </>
              ) : (
                "Try adjusting your search criteria"
              )}
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0">Template</th>
                    <th className="border-0">Topic</th>
                    <th className="border-0">Submitted</th>
                    <th className="border-0">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredForms.map((form) => (
                    <tr key={form.id}>
                      <td>
                        <div>
                          <div className="fw-medium">
                            <Link
                              to={`/templates/${form.template.id}`}
                              className="text-decoration-none"
                            >
                              {form.template.title}
                            </Link>
                          </div>
                          <small className="text-muted">
                            by {form.template.owner.name}
                          </small>
                        </div>
                      </td>
                      <td>
                        <Badge bg={getTopicVariant(form.template.topic)}>
                          {t(`topics.${form.template.topic}`)}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={16} className="me-2 text-muted" />
                          <div>
                            <div>
                              {new Date(form.createdAt).toLocaleDateString()}
                            </div>
                            <small className="text-muted">
                              {formatDistanceToNow(new Date(form.createdAt), {
                                addSuffix: true,
                              })}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            onClick={() => navigate(`/forms/${form.id}`)}
                            variant="outline-primary"
                            size="sm"
                            title="View submission"
                          >
                            <Eye size={14} />
                          </Button>
                          <Button
                            onClick={() => navigate(`/templates/${form.template.id}/fill`)}
                            variant="outline-secondary"
                            size="sm"
                            title="Edit submission"
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => setDeleteFormId(form.id)}
                            title="Delete submission"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={!!deleteFormId}
        title="Delete Form Submission"
        message="Are you sure you want to delete this form submission? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteForm}
        onCancel={() => setDeleteFormId(null)}
        loading={isDeleting}
      />
    </Container>
  );
};