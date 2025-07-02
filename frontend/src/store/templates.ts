import { create } from "zustand";
import type { Template,
  CreateTemplateData,
  UpdateTemplateData,
  Question,
  CreateQuestionData, } from "../types/index";
import {
  getTemplates,
  getMyTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "../services/api";

interface TemplatesState {
  templates: Template[];
  myTemplates: Template[];
  currentTemplate: Template | null;
  isLoading: boolean;

  // Template Actions
  //eslint-disable-next-line
  fetchTemplates: (params?: any) => Promise<void>;
  fetchMyTemplates: () => Promise<void>;
  fetchTemplate: (id: string) => Promise<void>;
  createTemplate: (data: CreateTemplateData) => Promise<Template>;
  updateTemplate: (id: string, data: UpdateTemplateData) => Promise<Template>;
  deleteTemplate: (id: string) => Promise<void>;
  clearCurrentTemplate: () => void;

  // Question Actions
  addQuestion: (
    templateId: string,
    questionData: CreateQuestionData
  ) => Promise<Question>;
  updateQuestion: (
    templateId: string,
    questionId: string,
    questionData: Partial<CreateQuestionData>
  ) => Promise<Question>;
  deleteQuestion: (templateId: string, questionId: string) => Promise<void>;
  updateTemplateQuestions: (
    templateId: string,
    questions: CreateQuestionData[]
  ) => Promise<{ questions: Question[]; message: string }>;
}

export const useTemplatesStore = create<TemplatesState>((set, get) => ({
  templates: [],
  myTemplates: [],
  currentTemplate: null,
  isLoading: false,

  fetchTemplates: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await getTemplates(params);
      set({ templates: response.templates, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchMyTemplates: async () => {
    set({ isLoading: true });
    try {
      const response = await getMyTemplates();
      set({ myTemplates: response.templates, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchTemplate: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await getTemplate(id);
      set({ currentTemplate: response.template, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createTemplate: async (data: CreateTemplateData) => {
    set({ isLoading: true });
    try {
      const response = await createTemplate(data);
      set({ isLoading: false });

      // Refresh my templates
      get().fetchMyTemplates();

      return response.template;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateTemplate: async (id: string, data: UpdateTemplateData) => {
    set({ isLoading: true });
    try {
      const response = await updateTemplate(id, data);

      // Update current template if it's the same
      const { currentTemplate } = get();
      if (currentTemplate?.id === id) {
        set({ currentTemplate: response.template });
      }

      set({ isLoading: false });

      // Refresh my templates
      get().fetchMyTemplates();

      return response.template;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteTemplate: async (id: string) => {
    set({ isLoading: true });
    try {
      await deleteTemplate(id);

      // Remove from current template if it's the same
      const { currentTemplate } = get();
      if (currentTemplate?.id === id) {
        set({ currentTemplate: null });
      }

      set({ isLoading: false });

      // Refresh my templates
      get().fetchMyTemplates();
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  clearCurrentTemplate: () => set({ currentTemplate: null }),

  // Question management methods
  addQuestion: async (templateId: string, questionData: CreateQuestionData) => {
    const response = await addQuestion(templateId, questionData);

    // Refresh current template if it's the same
    const { currentTemplate } = get();
    if (currentTemplate?.id === templateId) {
      get().fetchTemplate(templateId);
    }

    return response.question;
  },

  updateQuestion: async (
    templateId: string,
    questionId: string,
    questionData: Partial<CreateQuestionData>
  ) => {
    const response = await updateQuestion(templateId, questionId, questionData);

    // Refresh current template if it's the same
    const { currentTemplate } = get();
    if (currentTemplate?.id === templateId) {
      get().fetchTemplate(templateId);
    }

    return response.question;
  },

  deleteQuestion: async (templateId: string, questionId: string) => {
    await deleteQuestion(templateId, questionId);

    // Refresh current template if it's the same
    const { currentTemplate } = get();
    if (currentTemplate?.id === templateId) {
      get().fetchTemplate(templateId);
    }
  },

  
}));
