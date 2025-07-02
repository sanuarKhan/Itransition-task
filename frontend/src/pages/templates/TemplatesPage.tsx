import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { Search, PlusCircle, FileText, Grid, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/index";
import { getTemplates, getMyTemplates } from "../../services/api";
import { LoadingSpinner } from "../../components/UI/LoadingSpinner";
import { TemplateCard } from "../../components/Templates/TemplateCard";
import type { Topic } from "../../types/index";

export const TemplatesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState("public");
  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch public templates
  const { data: publicTemplatesData, isLoading: loadingPublic } = useQuery({
    queryKey: ["publicTemplates", searchQuery, topicFilter],
    queryFn: () =>
      getTemplates({
        page: 1,
        limit: 20,
        ...(topicFilter && { topic: topicFilter }),
      }),
    enabled: activeTab === "public",
  });

  // Fetch my templates
  const { data: myTemplatesData, isLoading: loadingMy } = useQuery({
    queryKey: ["myTemplates"],
    queryFn: getMyTemplates,
    enabled: activeTab === "my" && !!user,
  });

  const publicTemplates = publicTemplatesData?.templates || [];
  const myTemplates = myTemplatesData?.templates || [];

  // Filter templates by search
  const filteredPublicTemplates = publicTemplates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMyTemplates = myTemplates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topics: Topic[] = [
    "EDUCATION",
    "BUSINESS",
    "QUIZ",
    "SURVEY",
    "RESEARCH",
    "POLL",
    "OTHER",
  ];

  const isLoading = activeTab === "public" ? loadingPublic : loadingMy;
  const templates =
    activeTab === "public" ? filteredPublicTemplates : filteredMyTemplates;

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">{t("templates.title")}</h1>
          <p className="text-muted mb-0">Browse and manage form templates</p>
        </div>
        {user && (
          <Button onClick={() => navigate("/templates/create")} variant="primary">
            <PlusCircle size={16} className="me-2" />
            {t("templates.createNew")}
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
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
            <Col md={3} className="d-flex gap-2">
              <Button
                variant={viewMode === "grid" ? "primary" : "outline-secondary"}
                onClick={() => setViewMode("grid")}
                className="flex-grow-1"
              >
                <Grid size={16} />
              </Button>
              <Button
                variant={viewMode === "list" ? "primary" : "outline-secondary"}
                onClick={() => setViewMode("list")}
                className="flex-grow-1"
              >
                <List size={16} />
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || "public")}
        className="mb-4"
      >
        <Tab eventKey="public" title="Public Templates">
          {isLoading ? (
            <LoadingSpinner center text="Loading templates..." />
          ) : templates.length === 0 ? (
            <Card>
              <Card.Body className="text-center py-5">
                <FileText size={48} className="text-muted mb-3" />
                <h5 className="text-muted mb-3">
                  {searchQuery || topicFilter
                    ? "No templates match your search"
                    : t("templates.noTemplates")}
                </h5>
                <p className="text-muted">
                  {searchQuery || topicFilter
                    ? "Try adjusting your search criteria"
                    : "Templates created by users will appear here"}
                </p>
              </Card.Body>
            </Card>
          ) : viewMode === "grid" ? (
            <Row>
              {templates.map((template) => (
                <Col key={template.id} md={6} lg={4} className="mb-4">
                  <TemplateCard template={template} />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  // Could add a horizontal layout prop here
                />
              ))}
            </div>
          )}
        </Tab>

        {user && (
          <Tab eventKey="my" title={t("templates.myTemplates")}>
            {isLoading ? (
              <LoadingSpinner center text="Loading your templates..." />
            ) : templates.length === 0 ? (
              <Card>
                <Card.Body className="text-center py-5">
                  <FileText size={48} className="text-muted mb-3" />
                  <h5 className="text-muted mb-3">
                    {searchQuery
                      ? "No templates match your search"
                      : "No templates created yet"}
                  </h5>
                  <p className="text-muted mb-4">
                    {searchQuery
                      ? "Try adjusting your search criteria"
                      : t("templates.createFirst")}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => navigate("/templates/create")} variant="primary">
                      <PlusCircle size={16} className="me-2" />
                      Create Your First Template
                    </Button>
                  )}
                </Card.Body>
              </Card>
            ) : viewMode === "grid" ? (
              <Row>
                {templates.map((template) => (
                  <Col key={template.id} md={6} lg={4} className="mb-4">
                    <TemplateCard template={template} showAuthor={false} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="space-y-3">
                {templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    showAuthor={false}
                  />
                ))}
              </div>
            )}
          </Tab>
        )}
      </Tabs>
    </Container>
  );
};
