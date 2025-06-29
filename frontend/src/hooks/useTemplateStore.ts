import { create } from "zustand";
import { Template, CreateTemplateData, UpdateTemplateData } from "@/types";
import { createTemplate } from "./../services/api";

interface TemplatesState {
  templates: Template[];
  myTemplates: Template[];
  currentTemplate: Template | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  //   fetchTemplates: (params?: any) => Promise<void>;
  //   fetchMyTemplates: () => Promise<void>;
  //   fetchTemplate: (id: string) => Promise<void>;
  createTemplate: (data: CreateTemplateData) => Promise<Template>;
  //   updateTemplate: (id: string, data: UpdateTemplateData) => Promise<Template>;
  //   deleteTemplate: (id: string) => Promise<void>;
  //   clearCurrentTemplate: () => void;
  //   clearError: () => void;
}

export const useTemplatesStore = create<TemplatesState>((set, get) => ({
  templates: [],
  myTemplates: [],
  currentTemplate: null,
  isLoading: false,
  error: null,

  //   fetchTemplates: async (params = {}) => {
  //     set({ isLoading: true, error: null });
  //     try {
  //       const response = await apiService.getTemplates(params);
  //       set({
  //         templates: response.templates,
  //         isLoading: false,
  //       });
  //     } catch (error: any) {
  //       set({
  //         error: error.response?.data?.error || "Failed to fetch templates",
  //         isLoading: false,
  //       });
  //     }
  //   },

  //   fetchMyTemplates: async () => {
  //     set({ isLoading: true, error: null });
  //     try {
  //       const response = await apiService.getMyTemplates();
  //       set({
  //         myTemplates: response.templates,
  //         isLoading: false,
  //       });
  //     } catch (error: any) {
  //       set({
  //         error: error.response?.data?.error || "Failed to fetch your templates",
  //         isLoading: false,
  //       });
  //     }
  //   },

  //   fetchTemplate: async (id: string) => {
  //     set({ isLoading: true, error: null });
  //     try {
  //       const response = await apiService.getTemplate(id);
  //       set({
  //         currentTemplate: response.template,
  //         isLoading: false,
  //       });
  //     } catch (error: any) {
  //       set({
  //         error: error.response?.data?.error || "Failed to fetch template",
  //         isLoading: false,
  //       });
  //     }
  //   },

  createTemplate: async (data: CreateTemplateData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await createTemplate(data);
      set({ isLoading: false });

      return res;
      console.log(res);
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to create template",
        isLoading: false,
      });
      throw error;
    }
  },

  //   updateTemplate: async (id: string, data: UpdateTemplateData) => {
  //     set({ isLoading: true, error: null });
  //     try {
  //       const response = await apiService.updateTemplate(id, data);

  //       // Update current template if it's the same
  //       const { currentTemplate } = get();
  //       if (currentTemplate?.id === id) {
  //         set({ currentTemplate: response.template });
  //       }

  //       set({ isLoading: false });

  //       // Refresh my templates
  //       get().fetchMyTemplates();

  //       return response.template;
  //     } catch (error: any) {
  //       set({
  //         error: error.response?.data?.error || "Failed to update template",
  //         isLoading: false,
  //       });
  //       throw error;
  //     }
  //   },

  //   deleteTemplate: async (id: string) => {
  //     set({ isLoading: true, error: null });
  //     try {
  //       await apiService.deleteTemplate(id);

  //       // Remove from current template if it's the same
  //       const { currentTemplate } = get();
  //       if (currentTemplate?.id === id) {
  //         set({ currentTemplate: null });
  //       }

  //       set({ isLoading: false });

  //       // Refresh my templates
  //       get().fetchMyTemplates();
  //     } catch (error: any) {
  //       set({
  //         error: error.response?.data?.error || "Failed to delete template",
  //         isLoading: false,
  //       });
  //       throw error;
  //     }
  //   },

  //   clearCurrentTemplate: () => set({ currentTemplate: null }),
  //   clearError: () => set({ error: null }),
}));
