import React, { useState } from "react";
import { Card, Table, Button, Alert, Badge, Pagination } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Eye, Download, User, Calendar, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { getTemplateResults } from "../../services/api";
import { LoadingSpinner } from "../UI/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";

interface TemplateResultsProps {
  templateId: string;
}

export const TemplateResults: React.FC<TemplateResultsProps> = ({
  templateId,
}) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: resultsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["templateResults", templateId],
    queryFn: () => getTemplateResults(templateId),
  });

  const forms = resultsData?.forms || [];

  // Pagination
  const totalPages = Math.ceil(forms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentForms = forms.slice(startIndex, endIndex);

  // Get questions that should be shown in table
  const tableQuestions =
    forms[0]?.answers
      ?.filter((answer) => answer.question.showInTable)
      ?.map((answer) => answer.question) || [];

  const getAnswerValue = (formAnswers: any[], questionId: string) => {
    const answer = formAnswers.find((a) => a.questionId === questionId);
    if (!answer) return "-";

    if (answer.valueText) return answer.valueText;
    if (answer.valueInt !== null) return answer.valueInt.toString();
    if (answer.valueBool !== null) return answer.valueBool ? "Yes" : "No";
    return "-";
  };

  const exportToCSV = () => {
    if (forms.length === 0) return;

    const headers = [
      "Submitted By",
      "Submitted On",
      ...tableQuestions.map((q) => q.title),
    ];

    const rows = forms.map((form) => [
      form.user.name,
      new Date(form.createdAt).toLocaleDateString(),
      ...tableQuestions.map((q) => getAnswerValue(form.answers, q.id)),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `template-results-${templateId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <LoadingSpinner center text="Loading results..." />;
  }

  if (error) {
    return (
      <Alert variant="danger">
        Failed to load results. Please try again later.
      </Alert>
    );
  }

  if (forms.length === 0) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <h5 className="text-muted mb-3">No responses yet</h5>
          <p className="text-muted">
            When people fill out your form, their responses will appear here.
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          Form Responses
          <Badge bg="primary" className="ms-2">
            {forms.length}
          </Badge>
        </h4>
        <Button
          variant="outline-success"
          onClick={exportToCSV}
          disabled={forms.length === 0}
        >
          <Download size={16} className="me-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0">User</th>
                  <th className="border-0">Submitted</th>
                  {tableQuestions.map((question) => (
                    <th key={question.id} className="border-0">
                      {question.title}
                    </th>
                  ))}
                  <th className="border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentForms.map((form) => (
                  <tr key={form.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <User size={16} className="me-2 text-muted" />
                        <div>
                          <div className="fw-medium">{form.user.name}</div>
                          <small className="text-muted">
                            {form.user.email}
                          </small>
                        </div>
                      </div>
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
                    {tableQuestions.map((question) => (
                      <td key={question.id}>
                        <span
                          className="text-truncate d-inline-block"
                          style={{ maxWidth: "200px" }}
                        >
                          {getAnswerValue(form.answers, question.id)}
                        </span>
                      </td>
                    ))}
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          as={Link as any}
                          to={`/forms/${form.id}`}
                          variant="outline-primary"
                          size="sm"
                        >
                          <Eye size={14} className="me-1" />
                          View
                        </Button>
                        <Button
                          as={Link as any}
                          to={`/forms/${form.id}/edit`}
                          variant="outline-secondary"
                          size="sm"
                        >
                          <Edit size={14} className="me-1" />
                          Edit
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};
