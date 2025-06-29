import { create } from "zustand";
import { Form, SubmitFormData } from "../types/index";
import {
  getMyForms,
  getForm,
  checkFormSubmission,
  submitForm,
  updateForm,
  deleteForm,
} from "../services/api";

interface FormsState {
  forms: Form[];
  currentForm: Form | null;
  isLoading: boolean;

  // Actions
  fetchMyForms: () => Promise<void>;
  fetchForm: (id: string) => Promise<void>;
  checkFormSubmission: (
    templateId: string
  ) => Promise<{ hasFilled: boolean; form: Form | null }>;
  submitForm: (templateId: string, data: SubmitFormData) => Promise<Form>;
  updateForm: (id: string, data: SubmitFormData) => Promise<Form>;
  deleteForm: (id: string) => Promise<void>;
  clearCurrentForm: () => void;
}

export const useFormsStore = create<FormsState>((set, get) => ({
  forms: [],
  currentForm: null,
  isLoading: false,

  fetchMyForms: async () => {
    set({ isLoading: true });
    const response = await getMyForms();
    set({ forms: response.forms, isLoading: false });
  },

  fetchForm: async (id: string) => {
    set({ isLoading: true });
    const response = await getForm(id);
    set({ currentForm: response.form, isLoading: false });
  },

  checkFormSubmission: async (templateId: string) => {
    const response = await checkFormSubmission(templateId);
    return response;
  },

  submitForm: async (templateId: string, data: SubmitFormData) => {
    set({ isLoading: true });
    const response = await submitForm(templateId, data);
    set({ isLoading: false });

    // Refresh my forms
    get().fetchMyForms();

    return response.form;
  },

  updateForm: async (id: string, data: SubmitFormData) => {
    set({ isLoading: true });
    const response = await updateForm(id, data);

    // Update current form if it's the same
    const { currentForm } = get();
    if (currentForm?.id === id) {
      set({ currentForm: response.form });
    }

    set({ isLoading: false });

    // Refresh my forms
    get().fetchMyForms();

    return response.form;
  },

  deleteForm: async (id: string) => {
    set({ isLoading: true });
    await deleteForm(id);

    // Remove from current form if it's the same
    const { currentForm } = get();
    if (currentForm?.id === id) {
      set({ currentForm: null });
    }

    set({ isLoading: false });

    // Refresh my forms
    get().fetchMyForms();
  },

  clearCurrentForm: () => set({ currentForm: null }),
}));
