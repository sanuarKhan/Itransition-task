import { create } from "zustand";
import { produce } from "immer";
import type { FormTemplateType } from "../schemas/formSchemas";

const initialTemplateState: FormTemplateType = {
  title: "Untitled Form",
  description: "",
  topic: "OTHERS",
  thumbnail: null,
  isPublic: true,
  tags: [],
  questions: [],
};

const useFormStore = create((set) => ({
  template: initialTemplateState,
  activeTab: "settings",
  draggedItem: null, // Index of the question being dragged
  newTag: "",
  showTagSuggestions: false,

  setTemplate: (newTemplate: FormTemplateType) =>
    set({ template: newTemplate }),
  setActiveTab: (tab: string) => set({ activeTab: tab }),
  setDraggedItem: (item: number) => set({ draggedItem: item }),
  setNewTag: (tag: string) => set({ newTag: tag }),
  setShowTagSuggestions: (show: boolean) => set({ showTagSuggestions: show }),

  // Template actions
  updateFormSetting: (key, value) =>
    set(
      produce((state) => {
        state.template[key] = value;
      })
    ),

  addTag: (tagName) =>
    set(
      produce((state) => {
        if (tagName && !state.template.tags.includes(tagName)) {
          state.template.tags.push(tagName);
        }
        state.newTag = "";
        state.showTagSuggestions = false;
      })
    ),

  removeTag: (tagToRemove) =>
    set(
      produce((state) => {
        state.template.tags = state.template.tags.filter(
          (tag) => tag !== tagToRemove
        );
      })
    ),

  // Question actions
  addQuestion: (type, questionTypesConfig) =>
    set(
      produce((state) => {
        const typeCount = state.template.questions.filter(
          (q) => q.type === type
        ).length;
        const typeLimit =
          questionTypesConfig.find((qt) => qt.type === type)?.limit || 4;

        if (typeCount >= typeLimit) {
          alert(`Maximum ${typeLimit} questions of this type allowed`);
          return;
        }

        const newQuestion = {
          id: Date.now().toString(),
          type,
          title: `Question ${state.template.questions.length + 1}`,
          description: "",
          isRequired: false,
          showInTable: false,
          order: state.template.questions.length,
        };
        state.template.questions.push(newQuestion);
      })
    ),

  updateQuestion: (id, updates) =>
    set(
      produce((state) => {
        const questionIndex = state.template.questions.findIndex(
          (q) => q.id === id
        );
        if (questionIndex > -1) {
          state.template.questions[questionIndex] = {
            ...state.template.questions[questionIndex],
            ...updates,
          };
        }
      })
    ),

  deleteQuestion: (id) =>
    set(
      produce((state) => {
        state.template.questions = state.template.questions
          .filter((q) => q.id !== id)
          .map((q, index) => ({ ...q, order: index })); // Reorder
      })
    ),

  duplicateQuestion: (id) =>
    set(
      produce((state) => {
        const question = state.template.questions.find((q) => q.id === id);
        if (question) {
          const newQuestion = {
            ...question,
            id: Date.now().toString(), // New unique ID
            title: `${question.title} (Copy)`,
            order: state.template.questions.length,
          };
          state.template.questions.push(newQuestion);
        }
      })
    ),

  reorderQuestions: (draggedIndex, dropIndex) =>
    set(
      produce((state) => {
        const [draggedQuestion] = state.template.questions.splice(
          draggedIndex,
          1
        );
        state.template.questions.splice(dropIndex, 0, draggedQuestion);
        // Update order
        state.template.questions = state.template.questions.map((q, index) => ({
          ...q,
          order: index,
        }));
      })
    ),
}));

export default useFormStore;
