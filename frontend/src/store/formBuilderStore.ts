import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { FormTemplate } from "../types/form.types";
import type { Question, QuestionType } from "../types/question.types";

interface FormBuilderState {
  template: FormTemplate;
  activeTab: "settings" | "questions" | "preview";
  selectedUsers: string[];
  draggedItem: number | null;
  newTag: string;
  showTagSuggestions: boolean;
  isLoading: boolean;
  error: string | null;
}

interface FormBuilderActions {
  setTemplate: (template: Partial<FormTemplate>) => void;
  setActiveTab: (tab: "settings" | "questions" | "preview") => void;
  setSelectedUsers: (users: string[]) => void;
  setDraggedItem: (index: number | null) => void;
  setNewTag: (tag: string) => void;
  setShowTagSuggestions: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Form actions
  updateFormField: (field: keyof FormTemplate, value: any) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;

  // Question actions
  addQuestion: (type: QuestionType) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  duplicateQuestion: (id: string) => void;
  reorderQuestions: (dragIndex: number, dropIndex: number) => void;

  // Reset
  resetForm: () => void;
}

const initialTemplate: FormTemplate = {
  title: "Untitled Form",
  description: "",
  topic: "OTHERS",
  thumbnail: null,
  isPublic: true,
  tags: [],
  questions: [],
};

export const useFormBuilderStore = create<
  FormBuilderState & FormBuilderActions
>()(
  devtools(
    (set, get) => ({
      // State
      template: initialTemplate,
      activeTab: "settings",
      selectedUsers: [],
      draggedItem: null,
      newTag: "",
      showTagSuggestions: false,
      isLoading: false,
      error: null,

      // Basic setters
      setTemplate: (template) =>
        set((state) => ({
          template: { ...state.template, ...template },
        })),
      setActiveTab: (activeTab) => set({ activeTab }),
      setSelectedUsers: (selectedUsers) => set({ selectedUsers }),
      setDraggedItem: (draggedItem) => set({ draggedItem }),
      setNewTag: (newTag) => set({ newTag }),
      setShowTagSuggestions: (showTagSuggestions) =>
        set({ showTagSuggestions }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Form actions
      updateFormField: (field, value) =>
        set((state) => ({
          template: { ...state.template, [field]: value },
        })),

      addTag: (tag) =>
        set((state) => {
          if (tag && !state.template.tags.includes(tag)) {
            return {
              template: {
                ...state.template,
                tags: [...state.template.tags, tag],
              },
              newTag: "",
              showTagSuggestions: false,
            };
          }
          return state;
        }),

      removeTag: (tagToRemove) =>
        set((state) => ({
          template: {
            ...state.template,
            tags: state.template.tags.filter((tag) => tag !== tagToRemove),
          },
        })),

      // Question actions
      addQuestion: (type) => {
        const state = get();
        const typeCount = state.template.questions.filter(
          (q) => q.type === type
        ).length;
        const typeLimit = getQuestionTypeLimit(type);

        if (typeCount >= typeLimit) {
          set({ error: `Maximum ${typeLimit} questions of this type allowed` });
          return;
        }

        const newQuestion: Question = {
          id: Date.now().toString(),
          type,
          title: `Question ${state.template.questions.length + 1}`,
          description: "",
          isRequired: false,
          showInTable: false,
          order: state.template.questions.length,
        };

        set((state) => ({
          template: {
            ...state.template,
            questions: [...state.template.questions, newQuestion],
          },
          error: null,
        }));
      },

      updateQuestion: (id, updates) =>
        set((state) => ({
          template: {
            ...state.template,
            questions: state.template.questions.map((q) =>
              q.id === id ? { ...q, ...updates } : q
            ),
          },
        })),

      deleteQuestion: (id) =>
        set((state) => ({
          template: {
            ...state.template,
            questions: state.template.questions
              .filter((q) => q.id !== id)
              .map((q, index) => ({ ...q, order: index })),
          },
        })),

      duplicateQuestion: (id) => {
        const state = get();
        const question = state.template.questions.find((q) => q.id === id);
        if (question) {
          const newQuestion: Question = {
            ...question,
            id: Date.now().toString(),
            title: `${question.title} (Copy)`,
            order: state.template.questions.length,
          };

          set((state) => ({
            template: {
              ...state.template,
              questions: [...state.template.questions, newQuestion],
            },
          }));
        }
      },

      reorderQuestions: (dragIndex, dropIndex) => {
        const state = get();
        const draggedQuestion = state.template.questions[dragIndex];
        const newQuestions = [...state.template.questions];
        newQuestions.splice(dragIndex, 1);
        newQuestions.splice(dropIndex, 0, draggedQuestion);

        const reorderedQuestions = newQuestions.map((q, index) => ({
          ...q,
          order: index,
        }));

        set((state) => ({
          template: {
            ...state.template,
            questions: reorderedQuestions,
          },
          draggedItem: null,
        }));
      },

      resetForm: () =>
        set({
          template: initialTemplate,
          activeTab: "settings",
          selectedUsers: [],
          draggedItem: null,
          newTag: "",
          showTagSuggestions: false,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: "form-builder-store",
    }
  )
);

function getQuestionTypeLimit(type: QuestionType): number {
  const limits = {
    SINGLE_LINE: 4,
    MULTI_LINE: 4,
    INTEGER: 4,
    CHECKBOX: 4,
  };
  return limits[type] || 4;
}
