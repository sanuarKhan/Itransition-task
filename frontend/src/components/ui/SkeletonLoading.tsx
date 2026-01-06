import React from "react";

interface SkeletonProps {
  width?: string;
  height?: string;
  variant?: "text" | "circular" | "rectangular";
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "20px",
  variant = "rectangular",
  className = "",
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case "circular":
        return { borderRadius: "50%", width: height };
      case "text":
        return { borderRadius: "4px", height: "1em" };
      default:
        return { borderRadius: "8px" };
    }
  };

  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        ...getVariantStyle(),
      }}
    />
  );
};

export const TemplateCardSkeleton: React.FC = () => {
  return (
    <div className="card" style={{ padding: "1.5rem" }}>
      <Skeleton height="180px" className="mb-3" />
      <Skeleton width="70%" height="24px" className="mb-2" />
      <Skeleton width="100%" height="16px" className="mb-1" />
      <Skeleton width="90%" height="16px" className="mb-3" />
      <div className="d-flex gap-2 mb-3">
        <Skeleton width="60px" height="24px" variant="text" />
        <Skeleton width="60px" height="24px" variant="text" />
        <Skeleton width="60px" height="24px" variant="text" />
      </div>
      <div className="d-flex justify-content-between">
        <Skeleton width="100px" height="32px" />
        <Skeleton width="80px" height="32px" />
      </div>
    </div>
  );
};
