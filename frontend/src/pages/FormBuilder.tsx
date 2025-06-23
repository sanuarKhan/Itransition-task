import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useFormBuilder } from "../hooks/useFormBuilder";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import Layout from "../components/Layout";
import { FormBuilderTabs } from "../components/form-builder/FormBuilderTabs";
import { SettingsTab } from "../components/form-builder/SettingsTab";
import { QuestionsTab } from "../components/form-builder/QuestionsTab";
import { PreviewTab } from "../components/form-builder/PreviewTab";
import { Button } from "../components/ui/Button";
import { Save, Eye } from "lucide-react";
import { toast } from "react-toastify";

export const FormBuilder: React.FC = () => {
  const {
    template,
    activeTab,
    setActiveTab,
    updateTemplate,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    duplicateQuestion,
    addTag,
    removeTag,
    saveForm,
    isLoading,
  } = useFormBuilder();

  const { moveQuestion } = useDragAndDrop(template.questions, updateTemplate);

  const handleSave = async () => {
    try {
      await saveForm();
      toast.success("Form saved successfully!");
    } catch (error) {
      toast.error("Failed to save form");
    }
  };

  const handlePreview = () => {
    setActiveTab("preview");
  };

  return (
    <Layout>
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            {/* Form Header */}
            <div className="bg-white rounded-3 shadow-sm border mb-4">
              <div className="p-4 border-bottom">
                <input
                  type="text"
                  value={template.title}
                  onChange={(e) => updateTemplate({ title: e.target.value })}
                  className="form-control form-control-lg border-0 p-2 fw-bold"
                  placeholder="Form title"
                  style={{ fontSize: "1.5rem" }}
                />
                <textarea
                  value={template.description}
                  onChange={(e) =>
                    updateTemplate({ description: e.target.value })
                  }
                  className="form-control border-0 p-2 mt-2"
                  placeholder="Form description"
                  rows={2}
                  style={{ resize: "none" }}
                />
              </div>

              <FormBuilderTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            {/* Content Area */}
            <div className="mb-4">
              {activeTab === "settings" && (
                <SettingsTab
                  template={template}
                  onUpdate={updateTemplate}
                  onAddTag={addTag}
                  onRemoveTag={removeTag}
                />
              )}

              {activeTab === "questions" && (
                <QuestionsTab
                  template={template}
                  onAddQuestion={addQuestion}
                  onUpdateQuestion={updateQuestion}
                  onDeleteQuestion={deleteQuestion}
                  onDuplicateQuestion={duplicateQuestion}
                  onMoveQuestion={moveQuestion}
                />
              )}

              {activeTab === "preview" && <PreviewTab template={template} />}
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-3">
              <Button
                variant="secondary"
                onClick={handlePreview}
                disabled={isLoading}
              >
                <Eye size={16} className="me-2" />
                Preview
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isLoading}
              >
                <Save size={16} className="me-2" />
                {isLoading ? "Saving..." : "Save Form"}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};
