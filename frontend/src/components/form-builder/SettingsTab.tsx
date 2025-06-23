import React from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { Globe, Lock } from "lucide-react";
import type { FormTemplate } from "../../types/form.types";
import { Select } from "../ui/Select";
import { FileUpload } from "../ui/FileUpload";
import { TagInput } from "../ui/TagInput";
import { TOPICS, SUGGESTED_TAGS } from "../../utils/constants";

interface SettingsTabProps {
  template: FormTemplate;
  onUpdate: (field: keyof FormTemplate, value: any) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  template,
  onUpdate,
}) => {
  return (
    <Card>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Select
              label="Topic"
              value={template.topic}
              onChange={(e) => onUpdate("topic", e.target.value)}
              options={TOPICS}
            />
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Access</Form.Label>
              <div className="d-flex gap-3">
                <Form.Check
                  type="radio"
                  name="access"
                  id="public"
                  label={
                    <span className="d-flex align-items-center gap-1">
                      <Globe size={16} />
                      Public
                    </span>
                  }
                  checked={template.isPublic}
                  onChange={() => onUpdate("isPublic", true)}
                />
                <Form.Check
                  type="radio"
                  name="access"
                  id="restricted"
                  label={
                    <span className="d-flex align-items-center gap-1">
                      <Lock size={16} />
                      Restricted
                    </span>
                  }
                  checked={!template.isPublic}
                  onChange={() => onUpdate("isPublic", false)}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        <TagInput
          label="Tags"
          tags={template.tags}
          onTagsChange={(tags) => onUpdate("tags", tags)}
          suggestions={SUGGESTED_TAGS}
          placeholder="Add tags..."
        />

        <FileUpload
          label="Thumbnail"
          selectedFile={template.thumbnail}
          onFileSelect={(file) => onUpdate("thumbnail", file)}
          helpText="PNG, JPG up to 10MB"
        />
      </Card.Body>
    </Card>
  );
};
