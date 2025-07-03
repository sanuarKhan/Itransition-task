import React from "react";
import { Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { Tag } from "../../types/index";
// path issue fixing
interface TagCloudProps {
  tags: Tag[];
  onTagClick?: (tagName: string) => void;
}

export const TagCloud: React.FC<TagCloudProps> = ({ tags, onTagClick }) => {
  const navigate = useNavigate();

  const handleTagClick = (tagName: string) => {
    if (onTagClick) {
      onTagClick(tagName);
    } else {
      navigate(`/search?tags=${encodeURIComponent(tagName)}`);
    }
  };

  const getTagSize = (weight: number) => {
    switch (weight) {
      case 1:
        return { fontSize: "0.75rem", padding: "0.25rem 0.5rem" };
      case 2:
        return { fontSize: "0.875rem", padding: "0.375rem 0.75rem" };
      case 3:
        return { fontSize: "1rem", padding: "0.5rem 1rem" };
      case 4:
        return { fontSize: "1.125rem", padding: "0.625rem 1.25rem" };
      case 5:
        return { fontSize: "1.25rem", padding: "0.75rem 1.5rem" };
      default:
        return { fontSize: "1rem", padding: "0.5rem 1rem" };
    }
  };

  const getTagVariant = (weight: number) => {
    if (weight >= 4) return "primary";
    if (weight >= 3) return "info";
    if (weight >= 2) return "secondary";
    return "light";
  };

  if (!tags || tags.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        <p>No tags available</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-wrap gap-2">
      {tags.map((tag) => {
        const weight = tag.weight || 1;
        const style = getTagSize(weight);
        const variant = getTagVariant(weight);

        return (
          <Badge
            key={tag.id}
            bg={variant}
            className="cursor-pointer user-select-none"
            style={{
              ...style,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onClick={() => handleTagClick(tag.name)}
            title={`${tag._count?.templates || 0} templates`}
          >
            {tag.name}
            {tag._count?.templates && (
              <span className="ms-1 opacity-75">({tag._count.templates})</span>
            )}
          </Badge>
        );
      })}
    </div>
  );
};
