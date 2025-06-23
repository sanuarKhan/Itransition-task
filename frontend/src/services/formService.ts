import { api } from "./api";
import type { FormTemplate } from "../types/form.types";

export const formService = {
  getAllForms: () => api.get<FormTemplate[]>("/forms"),

  getForm: (id: string) => api.get<FormTemplate>(`/forms/${id}`),

  createForm: (form: Omit<FormTemplate, "id">) =>
    api.post<FormTemplate>("/forms", form),

  updateForm: (id: string, form: Partial<FormTemplate>) =>
    api.put<FormTemplate>(`/forms/${id}`, form),

  deleteForm: (id: string) => api.delete(`/forms/${id}`),

  duplicateForm: (id: string) =>
    api.post<FormTemplate>(`/forms/${id}/duplicate`),
};
