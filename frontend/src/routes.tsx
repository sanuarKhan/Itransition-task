import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { FormBuilder } from "./pages/FormBuilder";
import { FormList } from "./pages/FormList";
import { FormPreview } from "./pages/FormPreview";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Default redirect to forms list */}
      <Route path="/" element={<Navigate to="/forms" replace />} />

      {/* Forms routes */}
      <Route path="/forms" element={<FormList />} />
      <Route path="/forms/new" element={<FormBuilder />} />
      <Route path="/forms/:formId/edit" element={<FormBuilder />} />
      <Route path="/forms/:formId/preview" element={<FormPreview />} />

      {/* Catch all route - redirect to forms */}
      <Route path="*" element={<Navigate to="/forms" replace />} />
    </Routes>
  );
};
