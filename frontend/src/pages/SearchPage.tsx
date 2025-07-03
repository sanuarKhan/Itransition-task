import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Badge,
} from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, X, Tag } from "lucide-react";
import { getTagCloud, searchTemplates } from "../services/api";
import type { Topic } from "../types";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { TemplateCard } from "../components/templates/TemplateCard";
import { TagCloud } from "../components/ui/TagCloud";
// path issue fixing
export const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  // const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [topicFilter, setTopicFilter] = useState(
    searchParams.get("topic") || ""
  );
  const [tagsFilter, setTagsFilter] = useState(searchParams.get("tags") || "");
  const [showFilters, setShowFilters] = useState(false);

  // Search templates
  const {
    data: searchData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["searchTemplates", query, topicFilter, tagsFilter],
    queryFn: () =>
      searchTemplates({
        q: query,
        topic: topicFilter,
        tags: tagsFilter,
        page: 1,
        limit: 20,
      }),
    enabled: !!query || !!topicFilter || !!tagsFilter,
  });

  // Get tag cloud for suggestions
  const { data: tagCloudData } = useQuery({
    queryKey: ["tagCloud"],
    queryFn: getTagCloud,
    staleTime: 10 * 60 * 1000,
  });

  const templates = searchData?.templates || [];
  const hasSearched = !!query || !!topicFilter || !!tagsFilter;

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (topicFilter) params.set("topic", topicFilter);
    if (tagsFilter) params.set("tags", tagsFilter);

    setSearchParams(params);
  }, [query, topicFilter, tagsFilter, setSearchParams]);

  // Initialize from URL on mount
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    const urlTopic = searchParams.get("topic") || "";
    const urlTags = searchParams.get("tags") || "";

    if (urlQuery !== query) setQuery(urlQuery);
    if (urlTopic !== topicFilter) setTopicFilter(urlTopic);
    if (urlTags !== tagsFilter) setTagsFilter(urlTags);
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Query will be updated through the form, triggering the effect
  };

  const clearFilters = () => {
    setQuery("");
    setTopicFilter("");
    setTagsFilter("");
    setSearchParams(new URLSearchParams());
  };

  const handleTagClick = (tagName: string) => {
    setTagsFilter(tagName);
  };

  const topics: Topic[] = [
    "EDUCATION",
    "BUSINESS",
    "QUIZ",
    "SURVEY",
    "RESEARCH",
    "POLL",
    "OTHER",
  ];

  const activeFiltersCount = [query, topicFilter, tagsFilter].filter(
    Boolean
  ).length;

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h1 className="h3 mb-3">{t("search.title")}</h1>

        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Form onSubmit={handleSearch}>
              <div className="position-relative">
                <Form.Control
                  type="text"
                  size="lg"
                  placeholder={t("search.query")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pe-5"
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="position-absolute end-0 top-0 h-100"
                  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                >
                  <Search size={20} />
                </Button>
              </div>
            </Form>
          </Col>
        </Row>

        {/* Filter Toggle */}
        <div className="mt-3">
          <Button
            variant="outline-secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="me-2"
          >
            <Filter size={16} className="me-2" />
            {t("search.filters")}
            {activeFiltersCount > 0 && (
              <Badge bg="primary" className="ms-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button variant="outline-danger" onClick={clearFilters}>
              <X size={16} className="me-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t("search.filters.topic")}</Form.Label>
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
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t("search.filters.tags")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter tag name..."
                    value={tagsFilter}
                    onChange={(e) => setTagsFilter(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="mb-4">
          <div className="d-flex align-items-center flex-wrap gap-2">
            <small className="text-muted me-2">Active filters:</small>
            {query && (
              <Badge bg="primary" className="d-flex align-items-center">
                Search: "{query}"
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 ms-2 text-white"
                  onClick={() => setQuery("")}
                >
                  <X size={14} />
                </Button>
              </Badge>
            )}
            {topicFilter && (
              <Badge bg="success" className="d-flex align-items-center">
                Topic: {t(`topics.${topicFilter}`)}
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 ms-2 text-white"
                  onClick={() => setTopicFilter("")}
                >
                  <X size={14} />
                </Button>
              </Badge>
            )}
            {tagsFilter && (
              <Badge bg="info" className="d-flex align-items-center">
                Tag: {tagsFilter}
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 ms-2 text-white"
                  onClick={() => setTagsFilter("")}
                >
                  <X size={14} />
                </Button>
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Search Results */}
      {isLoading ? (
        <LoadingSpinner center text="Searching templates..." />
      ) : error ? (
        <Alert variant="danger">
          <h5>Search Error</h5>
          <p>Failed to search templates. Please try again later.</p>
        </Alert>
      ) : hasSearched ? (
        <>
          {/* Results Header */}
          <div className="mb-4">
            <h4>
              {t("search.results", {
                count: templates.length,
                query: query || "filtered templates",
              })}
            </h4>
          </div>

          {/* Results Grid */}
          {templates.length === 0 ? (
            <Card>
              <Card.Body className="text-center py-5">
                <Search size={48} className="text-muted mb-3" />
                <h5 className="text-muted mb-3">{t("search.noResults")}</h5>
                <p className="text-muted mb-4">{t("search.tryDifferent")}</p>
                <Button variant="outline-primary" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {templates.map((template) => (
                <Col key={template.id} md={6} lg={4} className="mb-4">
                  <TemplateCard template={template} />
                </Col>
              ))}
            </Row>
          )}
        </>
      ) : (
        /* No Search State */
        <div>
          {/* Tag Cloud */}
          <Card className="mb-4">
            <Card.Header className="d-flex align-items-center">
              <Tag size={20} className="me-2" />
              <h5 className="mb-0">Popular Tags</h5>
            </Card.Header>
            <Card.Body>
              <TagCloud
                tags={tagCloudData?.tags || []}
                onTagClick={handleTagClick}
              />
            </Card.Body>
          </Card>

          {/* Search Tips */}
          <Card>
            <Card.Body>
              <h5 className="mb-3">Search Tips</h5>
              <Row>
                <Col md={6}>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <strong>Keywords:</strong> Search in template titles and
                      descriptions
                    </li>
                    <li className="mb-2">
                      <strong>Topics:</strong> Filter by category like
                      Education, Quiz, etc.
                    </li>
                  </ul>
                </Col>
                <Col md={6}>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <strong>Tags:</strong> Find templates with specific tags
                    </li>
                    <li className="mb-2">
                      <strong>Combine:</strong> Use multiple filters together
                    </li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      )}
    </Container>
  );
};
