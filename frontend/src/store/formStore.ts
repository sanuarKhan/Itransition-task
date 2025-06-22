// import { create } from "zustand";
// import { devtools, persist } from "zustand/middleware";
// import { FormTemplate, Question, ActtiveTab, QuestionType } from "../types";
// import { act } from "react";

// interface FormBuilderState {
//   form: FormTemplate;

//   activeTab: ActtiveTab;
//   selectedUsers: string[];
//   draggedItem: number | null;
//   newTag: string;
//   showTagSuggestions: boolean;
//   isLoading: boolean;
//   error: string | null;

//   setTemplate: (template: FormTemplate) => void;
//   updateTemplate: (update: Partial<FormTemplate>) => void;
//   setActiveTab: (tab: ActtiveTab) => void;
//   setSelectedUsers: (users: string[]) => void;
//   setDraggedItem: (index: number | null) => void;
//   setNewTag: (tag: string) => void;
//   setShowTagSuggestions: (show: boolean) => void;
//   setLoading: (loading: boolean) => void;
//   setError: (error: string | null) => void;

//   addQuestion: (question: Question) => void;
//   updateQuestion: (id: string, updates: Partial<Question>) => void;
//   deleteQuestion: (id: string) => void;
//   duplicateQuestion: (id: string) => void;
//   reorderQuestions: (dragIndex: number, dropIndex: number) => void;

//   addTag: (tag: string) => void;
//   removeTag: (tag: string) => void;

//   resetForm: () => void;
//   loadForm: (form: FormTemplate) => void;
// }

// const createDefaultForm = (): FormTemplate => ({
//   title: " Untitled Form",
//   description: "",
//   topic: "OTHERS",
//   thumbnail: null,
//   isPublic: true,
//   tags: [],
//   questions: [],
// });

// const questionTypeLimits: Record<QuestionType, number> = {
//   SINGLE_LINE: 4,
//   MULTI_LINE: 4,
//   INTEGER: 4,
//   CHECKBOX: 4,
// };

// export const useFormStore = create<FormBuilderState>()(
//   devtools(
//     persist(
//       (set, get) => ({
//         template: createDefaultForm(),
//         activeTab: 'settings',
//         selectedUsers: [],
//         draggedItem: null,
//         newTag: "",
//         showTagSuggestions: false,
//         isLoading: false,
//         error: null,

//         setTemplate: (template) => set({ template }),

//         updateTemplate: (update) => set((state) => ({ template: { ...state.template, ...update } })),

//         setActiveTab: (activeTab) => set({ activeTab }),

//         setSelectedUsers: (selectedUsers) => set({ selectedUsers }),

//         setDraggedItem: (draggedItem) => set({ draggedItem }),

//         setNewTag: (newTag) => set({ newTag }),

//         setShowTagSuggestions: (show) => set({ showTagSuggestions: show }),

//         setLoading: (isLoading) => set({ isLoading }),

//         setError: (error) => set({ error }),

//         addQuestion: (type) => {
//             const  state = get();
//             const typeCount = state.template.questions.filter(q => q.type === type).length;
//             const typeLimit = questionTypeLimits[type]

//             if (typeCount >= typeLimit) {
//                 set({ error: `Maximum ${typeLimit} questions of type ${type} allowed.` });
//                 return;
//             }

//             const newQuestion: Question = {

//                 type,
//                 title: `Qoestion ${state.template.questions.length + 1}`,
//                 description: "",
//                 isRequired: false,
//                 showInTable: false,
//                 order: state.template.questions.length,
//             }

//             set((state) => ({
//                 template: {
//                     ...state.template,
//                     questions: [...state.template.questions]
//                 },
//                 error: null,
//             }));

//     },
//         updateQuestion: (id, updates) => {
//             set((state) => ({
//                 template: {
//                     ...state.template,
//                     questions: state.template.questions.map((q) =>
//                         q.id === id ? { ...q, ...updates } : q
//                     ),
//                 },

//             })),

//         deleteQuestion: (id) => {
//             set((state) => ({
//                 template: {
//                     ...state.template,
//                     questions: state.template.questions.filter((q) => q.id !== id),
//                 }
//             })),

//         duplicateQuestion: (id) => {
//             const state = get();
//             const question = state.template.questions.find((q) => q.id === id);

//             if(question) {
//                 const typeCount = state.template.questions.filter(q => q.type === question.type).length;
//                 const typeLimit = questionTypeLimits[question.type];

//                 if (typeCount >= typeLimit) {
//                     set({ error: `Maximum ${typeLimit} questions of type ${question.type} allowed.` });
//                     return;
//                 }

//                 const newQuestion: Question = {
//                     ...question,

//                     title: `${question.title} (Copy)`,
//                     order: state.template.questions.length,
//                 };

//                 set((state) => ({
//                     template: {
//                         ...state.template,
//                         questions: [...state.template.questions, newQuestion],
//                     },
//                     error: null,
//                 }));
//             }
//         },
