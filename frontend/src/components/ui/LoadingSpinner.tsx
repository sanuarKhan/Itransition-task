import React from "react";
import { Spinner } from "react-bootstrap";

interface LoadingSpinnerProps {
  size?: "sm" | "lg";
  text?: string;
  center?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size,
  text,
  center = false,
}) => {
  const content = (
    <div className="d-flex align-items-center">
      <Spinner animation="border" size={size} role="status" />
      {text && <span className="ms-2">{text}</span>}
    </div>
  );

  if (center) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        {content}
      </div>
    );
  }

  return content;
};
