import { useCallback } from "react";
import { useFormBuilderStore } from "../store/formBuilderStore";
import type { QuestionType } from "../types/question.types";

import { toast } from "react-toastify";

export const useFormBuilder = () => {
  const store = useFormBuilderStore();

  const addQuestion = useCallback(
    (type: QuestionType) => {
      try {
        store.addQuestion(type);
        toast.success("Question added successfully!");
      } catch (error) {
        toast.error("Failed to add question");
      }
    },
    [store]
  );

  const updateQuestion = useCallback(
    (id: string, updates: any) => {
      try {
        store.updateQuestion(id, updates);
      } catch (error) {
        toast.error("Failed to update question");
      }
    },
    [store]
  );

  const deleteQuestion = useCallback(
    (id: string) => {
      try {
        store.deleteQuestion(id);
        toast.success("Question deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete question");
      }
    },
    [store]
  );

  const duplicateQuestion = useCallback(
    (id: string) => {
      try {
        store.duplicateQuestion(id);
        toast.success("Question duplicated successfully!");
      } catch (error) {
        toast.error("Failed to duplicate question");
      }
    },
    [store]
  );

  const saveForm = useCallback(async () => {
    try {
      store.setIsLoading(true);
      // Here you would call the API to save the form
      // await formService.createForm(store.template);
      toast.success("Form saved successfully!");
    } catch (error) {
      toast.error("Failed to save form");
      throw error; // Re-throw to allow the component to handle it
    } finally {
      store.setIsLoading(false);
    }
  }, [store]);

  const addTag = useCallback(
    (tag: string) => {
      try {
        store.addTag(tag);
      } catch (error) {
        toast.error("Failed to add tag");
      }
    },
    [store]
  );

  const removeTag = useCallback(
    (tag: string) => {
      try {
        store.removeTag(tag);
      } catch (error) {
        toast.error("Failed to remove tag");
      }
    },
    [store]
  );

  return {
    ...store,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    duplicateQuestion,
    saveForm,
    addTag,
    removeTag,
  };
};
