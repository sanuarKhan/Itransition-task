import { api } from "./api";

export const uploadService = {
  uploadThumbnail: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("thumbnail", file);

    const response = await api.post<{ url: string }>(
      "/upload/thumbnail",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.url;
  },
};
