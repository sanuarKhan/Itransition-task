import React, { useState, useCallback } from "react";
import { Form, InputGroup, Button, ListGroup } from "react-bootstrap";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getSearchSuggestions } from "../../services/api";
import { useUIStore } from "../../store/index";
import { debounce } from "lodash";

interface SearchBarProps {
  onSearch?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder,
  autoFocus = false,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useUIStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced search for suggestions
  const debouncedGetSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length >= 2) {
        return getSearchSuggestions(query);
      }
      return { suggestions: [] };
    }, 300),
    []
  );

  const { data: suggestions } = useQuery({
    queryKey: ["searchSuggestions", localQuery],
    queryFn: () => debouncedGetSuggestions(localQuery),
    enabled: localQuery.length >= 2 && showSuggestions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSearch = (query: string = localQuery) => {
    if (query.trim()) {
      setSearchQuery(query.trim());
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      onSearch?.();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearSearch = () => {
    setLocalQuery("");
    setSearchQuery("");
    setShowSuggestions(false);
  };

  return (
    <div className="position-relative">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder={placeholder || t("search.query")}
          value={localQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(localQuery.length >= 2)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          autoFocus={autoFocus}
        />
        {localQuery && (
          <Button
            variant="outline-secondary"
            onClick={clearSearch}
            className="border-start-0"
          >
            <X size={16} />
          </Button>
        )}
        <Button
          variant="primary"
          onClick={() => handleSearch()}
          disabled={!localQuery.trim()}
        >
          <Search size={16} />
        </Button>
      </InputGroup>

      {/* Search Suggestions */}
      {showSuggestions &&
        suggestions?.suggestions &&
        suggestions.suggestions.length > 0 && (
          <ListGroup
            className="position-absolute w-100 shadow-sm"
            style={{ zIndex: 1050 }}
          >
            {suggestions.suggestions.slice(0, 5).map((suggestion, index) => (
              <ListGroup.Item
                key={index}
                action
                onClick={() => handleSuggestionClick(suggestion.value)}
                className="d-flex align-items-center"
              >
                <Search size={14} className="me-2 text-muted" />
                <span>{suggestion.value}</span>
                <small className="ms-auto text-muted">{suggestion.type}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
    </div>
  );
};
