import React, { useCallback } from "react";
import { Form, Card } from "react-bootstrap";
import { Upload, X } from "lucide-react";
import { validateFile } from "../../utils/validators";
import { toast } from "react-toastify";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile?: File | null;
  accept?: string;
  label?: string;
  helpText?: string;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  accept = "image/*",
  label,
  helpText,
  error,
}) => {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const validation = validateFile(file);
        if (!validation.isValid) {
          validation.errors.forEach((error) => toast.error(error));
          return;
        }
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleRemoveFile = useCallback(() => {
    onFileSelect(null);
  }, [onFileSelect]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) {
        const validation = validateFile(file);
        if (!validation.isValid) {
          validation.errors.forEach((error) => toast.error(error));
          return;
        }
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}

      {selectedFile ? (
        <Card className="p-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{selectedFile.name}</strong>
              <div className="text-muted small">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={handleRemoveFile}
            >
              <X size={16} />
            </button>
          </div>
        </Card>
      ) : (
        <Card
          className={`p-4 text-center border-dashed ${
            error ? "border-danger" : ""
          }`}
          style={{ cursor: "pointer" }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Upload size={32} className="mx-auto mb-2 text-muted" />
          <p className="mb-2">Click to upload or drag and drop</p>
          {helpText && <small className="text-muted">{helpText}</small>}
          <Form.Control
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="position-absolute w-100 h-100 opacity-0"
            style={{ cursor: "pointer" }}
          />
        </Card>
      )}

      {error && <div className="text-danger small mt-1">{error}</div>}
    </Form.Group>
  );
};
