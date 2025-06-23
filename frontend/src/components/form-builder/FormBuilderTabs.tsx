import React from "react";
import { Nav } from "react-bootstrap";
import { Settings, Type, Eye } from "lucide-react";

interface FormBuilderTabsProps {
  activeTab: "settings" | "questions" | "preview";
  onTabChange: (tab: "settings" | "questions" | "preview") => void;
}

export const FormBuilderTabs: React.FC<FormBuilderTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "settings" as const, label: "Settings", icon: Settings },
    { id: "questions" as const, label: "Questions", icon: Type },
    { id: "preview" as const, label: "Preview", icon: Eye },
  ];

  return (
    <Nav variant="tabs" className="border-bottom">
      {tabs.map((tab) => (
        <Nav.Item key={tab.id}>
          <Nav.Link
            active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            className="d-flex align-items-center gap-2"
          >
            <tab.icon size={16} />
            {tab.label}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};
