import React from "react";
import type { Template } from "../../types";

interface QuestionEditorProps {
  template: Template;
  onSave: () => void;
  onCancel: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  template,
  onSave,
  onCancel,
}) => {
  return (
    <div>
      <h3>Editing Questions for {template.title}</h3>
      <p>This is where the question editing UI will go.</p>
      <button onClick={onSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};