import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formTemplateSchema, FormTemplateInput } from "../schemas/formSchema";

export const useFormValidation = (
  defaultValues?: Partial<FormTemplateInput>
) => {
  const form = useForm<FormTemplateInput>({
    resolver: zodResolver(formTemplateSchema),
    defaultValues: {
      title: "Untitled Form",
      description: "",
      topic: "OTHERS",
      thumbnail: null,
      isPublic: true,
      tags: [],
      questions: [],
      ...defaultValues,
    },
  });

  return form;
};
