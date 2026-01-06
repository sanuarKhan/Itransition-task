// import React from "react";
// import { Container, Row, Col, Card } from "react-bootstrap";
// import { useTranslation } from "react-i18next";
// import {
//   PlusCircle,
//   Palette,
//   BarChart3,
//   Share2,
//   Grab,
//   Globe,
//   Shield,
//   Zap,
// } from "lucide-react";
// path issue fixing
import React, { useState } from "react";
import {
  Heart,
  TrendingUp,
  Users,
  BarChart3,
  Eye,
  MessageSquare,
  Calendar,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Globe,
  Menu,
  X,
  Search,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Share2,
} from "lucide-react";
import { colors } from "@/constants";

export const FeatureCard = ({ icon: Icon, title, description, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "2rem",
        boxShadow: isHovered
          ? "0 20px 60px rgba(0,0,0,0.15)"
          : "0 4px 20px rgba(0,0,0,0.08)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        cursor: "pointer",
        border: `2px solid ${isHovered ? color : "transparent"}`,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Gradient on Hover */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${color}15 0%, transparent 100%)`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: `${color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
            transition: "all 0.3s ease",
            transform: isHovered
              ? "scale(1.1) rotate(5deg)"
              : "scale(1) rotate(0deg)",
          }}
        >
          <Icon size={32} color={color} />
        </div>

        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "700",
            marginBottom: "0.75rem",
            color: colors.dark,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color: "#64748b",
            lineHeight: "1.6",
            fontSize: "0.875rem",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

// Modern Template Card
export const ModernTemplateCard = ({ template }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: isHovered
          ? "0 20px 60px rgba(0,0,0,0.15)"
          : "0 4px 20px rgba(0,0,0,0.08)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered
          ? "translateY(-8px) scale(1.02)"
          : "translateY(0) scale(1)",
        cursor: "pointer",
        border: "1px solid #e2e8f0",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image/Gradient Header */}
      <div
        style={{
          height: "180px",
          background: template.gradient,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            padding: "0.5rem 1rem",
            borderRadius: "50px",
            fontSize: "0.75rem",
            fontWeight: "600",
            color: colors.primary,
          }}
        >
          {template.topic}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: "700",
            marginBottom: "0.75rem",
            color: colors.dark,
          }}
        >
          {template.title}
        </h3>

        <p
          style={{
            color: "#64748b",
            fontSize: "0.875rem",
            lineHeight: "1.6",
            marginBottom: "1rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {template.description}
        </p>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          {template.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              style={{
                background: "#f1f5f9",
                color: "#475569",
                padding: "0.25rem 0.75rem",
                borderRadius: "50px",
                fontSize: "0.75rem",
                fontWeight: "500",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "1rem",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              fontSize: "0.875rem",
              color: "#64748b",
            }}
          >
            <span
              style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
            >
              <Eye size={16} /> {template.views}
            </span>
            <span
              style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
            >
              <Heart size={16} /> {template.likes}
            </span>
            <span
              style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
            >
              <MessageSquare size={16} /> {template.comments}
            </span>
          </div>

          <button
            style={{
              background: isHovered ? colors.primary : "transparent",
              color: isHovered ? "white" : colors.primary,
              border: `2px solid ${colors.primary}`,
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

// Modern Stats Card
export const StatsCard = ({ icon: Icon, label, value, trend, color }) => {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "1.5rem",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: `2px solid ${color}20`,
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: `${color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={24} color={color} />
        </div>
        {trend && (
          <span
            style={{
              background: trend > 0 ? "#10b98120" : "#ef444420",
              color: trend > 0 ? "#10b981" : "#ef4444",
              padding: "0.25rem 0.75rem",
              borderRadius: "50px",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>

      <div
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          color: colors.dark,
          marginBottom: "0.25rem",
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: "0.875rem",
          color: "#64748b",
          fontWeight: "500",
        }}
      >
        {label}
      </div>
    </div>
  );
};
