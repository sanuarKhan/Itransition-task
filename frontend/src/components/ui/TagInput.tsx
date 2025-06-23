import React, { useState, useCallback } from "react";
import { Form, Badge, Dropdown } from "react-bootstrap";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  suggestions?: string[];
  label?: string;
  placeholder?: string;
  error?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onTagsChange,
  suggestions = [],
  label,
  placeholder = "Add tags...",
  error,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      setShowSuggestions(value.length > 0);
    },
    []
  );

  const addTag = useCallback(
    (tag: string) => {
      const trimmedTag = tag.trim();
      if (trimmedTag && !tags.includes(trimmedTag)) {
        onTagsChange([...tags, trimmedTag]);
      }
      setInputValue("");
      setShowSuggestions(false);
    },
    [tags, onTagsChange]
  );

  const removeTag = useCallback(
    (tagToRemove: string) => {
      onTagsChange(tags.filter((tag) => tag !== tagToRemove));
    },
    [tags, onTagsChange]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTag(inputValue);
      }
    },
    [addTag, inputValue]
  );

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(suggestion)
  );

  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}

      <div className="mb-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            bg="primary"
            className="me-2 mb-2 d-inline-flex align-items-center"
          >
            {tag}
            <button
              type="button"
              className="btn btn-sm p-0 ms-1 text-white"
              onClick={() => removeTag(tag)}
              style={{ background: "none", border: "none" }}
            >
              <X size={14} />
            </button>
          </Badge>
        ))}
      </div>

      <div className="position-relative">
        <Form.Control
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className={error ? "is-invalid" : ""}
        />

        {showSuggestions && filteredSuggestions.length > 0 && (
          <Dropdown.Menu show className="w-100 mt-1">
            {filteredSuggestions.map((suggestion) => (
              <Dropdown.Item
                key={suggestion}
                onClick={() => addTag(suggestion)}
              >
                {suggestion}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        )}
      </div>

      {error && <div className="text-danger small mt-1">{error}</div>}
    </Form.Group>
  );
};
