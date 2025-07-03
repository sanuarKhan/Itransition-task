// frontend/src/services/api.ts - COMPLETE FIXED VERSION
import axios from "axios";
import type {
  User,
  Template,
  Form,
  Comment,
  Tag,
  AuthResponse,
  SearchResponse,
  TemplateAnalytics,
  DashboardStats,
  AdminStats,
  CreateTemplateData,
  UpdateTemplateData,
  SubmitFormData,
  RegisterData,
  LoginData,
  UpdateProfileData,
  CreateQuestionData,
  Question,
} from "../types/index";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Export the main api instance (for apiService usage)
export const apiService = api;

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/api/auth/register", data);
  return res.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/api/auth/login", data);
  return res.data;
};

export const getMe = async (): Promise<{ user: User }> => {
  const res = await api.get<{ user: User }>("/api/auth/me");
  return res.data;
};

export const updateProfile = async (
  data: UpdateProfileData
): Promise<{ user: User; message: string }> => {
  const res = await api.put<{ user: User; message: string }>(
    "/api/auth/profile",
    data
  );
  return res.data;
};

export const updateAvatar = async (
  avatar: string
): Promise<{ user: User; message: string }> => {
  const res = await api.put<{ user: User; message: string }>(
    "/api/auth/avatar",
    {
      avatar,
    }
  );
  return res.data;
};

// Template APIs - FIXED routes
export const getTemplates = async (params?: {
  page?: number;
  limit?: number;
  topic?: string;
  tags?: string;
  q?: string;
}): Promise<SearchResponse> => {
  const res = await api.get("/api/search/templates", { params });
  return res.data;
};

export const getLatestTemplates = async (): Promise<{
  templates: Template[];
}> => {
  const res = await api.get("/api/templates/latest");
  return res.data;
};

export const getPopularTemplates = async (): Promise<{
  templates: Template[];
}> => {
  const res = await api.get("/api/templates/popular");
  return res.data;
};

export const getMyTemplates = async (params?: {
  page?: number;
  limit?: number;
  topic?: string;
  tags?: string;
  q?: string;
}): Promise<{ templates: Template[] }> => {
  const res = await api.get("/api/templates/my", { params });
  return res.data;
};

export const getTemplate = async (
  id: string
): Promise<{ template: Template }> => {
  const res = await api.get(`/api/templates/${id}`);
  return res.data;
};

export const createTemplate = async (
  data: CreateTemplateData
): Promise<{ template: Template; message: string }> => {
  const res = await api.post("/api/templates/create", data);
  return res.data;
};

export const updateTemplate = async (
  id: string,
  data: UpdateTemplateData
): Promise<{ template: Template; message: string }> => {
  const res = await api.put(`/api/templates/${id}`, data);
  return res.data;
};

export const deleteTemplate = async (
  id: string
): Promise<{ message: string }> => {
  const res = await api.delete(`/api/templates/${id}`);
  return res.data;
};

export const updateTemplateQuestions = async (
  id: string,
  questions: CreateQuestionData[]
): Promise<{ questions: Question[]; message: string }> => {
  const res = await api.put(`/api/templates/${id}/questions`, { questions });
  return res.data;
};

export const getTemplateResults = async (
  id: string
): Promise<{ forms: Form[] }> => {
  const res = await api.get(`/api/templates/${id}/results`);
  return res.data;
};

export const getTemplateAnalytics = async (
  id: string
): Promise<TemplateAnalytics> => {
  const res = await api.get(`/api/templates/${id}/analytics`);
  return res.data;
};

export const toggleLike = async (
  id: string
): Promise<{ message: string; liked: boolean }> => {
  const res = await api.post(`/api/templates/${id}/like`);
  return res.data;
};
// question APIs
export const addQuestion = async (
  templateId: string,
  questionData: CreateQuestionData
): Promise<{ question: Question }> => {
  const res = await api.post<{ question: Question }>(
    `/api/templates/${templateId}/questions`,
    questionData
  );
  return res.data;
};

export const updateQuestion = async (
  templateId: string,
  questionId: string,
  questionData: Partial<CreateQuestionData>
): Promise<{ question: Question }> => {
  const res = await api.put<{ question: Question }>(
    `/api/templates/${templateId}/questions/${questionId}`,
    questionData
  );
  return res.data;
};

export const deleteQuestion = async (
  templateId: string,
  questionId: string
): Promise<void> => {
  await api.delete(`/api/templates/${templateId}/questions/${questionId}`);
};


// Comments APIs
export const getComments = async (
  templateId: string
): Promise<{ comments: Comment[] }> => {
  const res = await api.get(`/api/templates/${templateId}/comments`);
  return res.data;
};

export const addComment = async (
  templateId: string,
  content: string
): Promise<{ comment: Comment; message: string }> => {
  const res = await api.post(`/api/templates/${templateId}/comments`, {
    content,
  });
  return res.data;
};

// Form APIs - FIXED routes
export const getMyForms = async (): Promise<{ forms: Form[] }> => {
  const res = await api.get("/api/forms/my");
  return res.data;
};

export const getForm = async (id: string): Promise<{ form: Form }> => {
  const res = await api.get(`/api/forms/${id}`);
  return res.data;
};

export const checkFormSubmission = async (
  templateId: string
): Promise<{ hasFilled: boolean; form: Form | null }> => {
  const res = await api.get(`/api/forms/check/${templateId}`);
  return res.data;
};

export const submitForm = async (
  templateId: string,
  data: SubmitFormData
): Promise<{ form: Form; message: string }> => {
  const res = await api.post(`/api/forms/submit/${templateId}`, data);
  return res.data;
};

export const updateForm = async (
  id: string,
  data: SubmitFormData
): Promise<{ form: Form; message: string }> => {
  const res = await api.put(`/api/forms/${id}`, data);
  return res.data;
};

export const deleteForm = async (id: string): Promise<{ message: string }> => {
  const res = await api.delete(`/api/forms/${id}`);
  return res.data;
};

// User Management APIs - FIXED routes
export const getUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  //eslint-disable-next-line
}): Promise<{ users: User[]; pagination: any }> => {
  const res = await api.get("/api/users", { params });
  return res.data;
};

export const searchUsers = async (q: string): Promise<{ users: User[] }> => {
  const res = await api.get("/api/users/search", { params: { q } });
  return res.data;
};

export const getUser = async (id: string): Promise<{ user: User }> => {
  const res = await api.get(`/api/users/${id}`);
  return res.data;
};

export const blockUser = async (
  id: string,
  isBlocked: boolean
): Promise<{ user: User; message: string }> => {
  const res = await api.put(`/api/users/${id}/block`, { isBlocked });
  return res.data;
};

export const updateUserRole = async (
  id: string,
  role: string
): Promise<{ user: User; message: string }> => {
  const res = await api.put(`/api/users/${id}/role`, { role });
  return res.data;
};

export const deleteUser = async (id: string): Promise<{ message: string }> => {
  const res = await api.delete(`/api/users/${id}`);
  return res.data;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get("/api/users/dashboard/stats");
  return res.data;
};

// // FIXED: Ensure this function exists and matches the component usage
// export const getMyTemplates = async (): Promise<{ templates: Template[] }> => {
//   const res = await api.get("/api/templates/my");
//   return res.data;
// };

export const getAdminStats = async (): Promise<AdminStats> => {
  const res = await api.get("/api/users/stats/overview");
  return res.data;
};

// Search APIs - FIXED routes
export const searchTemplates = async (params: {
  q: string;
  page?: number;
  limit?: number;
  topic?: string;
  tags?: string;
}): Promise<SearchResponse> => {
  const res = await api.get("/api/search/templates", { params });
  return res.data;
};

export const getTags = async (q?: string): Promise<{ tags: Tag[] }> => {
  const res = await api.get("/api/search/tags", { params: q ? { q } : {} });
  return res.data;
};

export const getTagCloud = async (): Promise<{ tags: Tag[] }> => {
  const res = await api.get("/api/search/tag-cloud");
  return res.data;
};

export const getSearchSuggestions = async (
  q: string
): Promise<{ suggestions: Array<{ type: string; value: string }> }> => {
  const res = await api.get("/api/search/suggestions", { params: { q } });
  return res.data;
};

// Upload APIs - FIXED routes
export const uploadImage = async (
  file: File
): Promise<{ url: string; publicId: string; message: string }> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post("/api/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const UploadAvatar = async (
  file: File
): Promise<{ url: string; publicId: string; message: string }> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await api.post("/api/upload/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const UploadThumbnail = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("thumbnail", file);

  const res = await api.post<{ url: string }>(
    "/api/upload/thumbnail",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

export const DeleteImage = async (
  publicId: string
): Promise<{ message: string }> => {
  const res = await api.delete(`/api/upload/image/${publicId}`);
  return res.data;
};

// Health Check API - FIXED route
export const healthCheck = async (): Promise<{
  status: string;
  timestamp: string;
}> => {
  const res = await api.get("/api/health");
  return res.data;
};

// Legacy API functions (commented out - use new ones above)
// export const registerApi = async (fromData: any) => {
//   const res = await api.post("/api/user/register", fromData);
//   return res.data;
// };

// export const loginApi = async (fromData: any) => {
//   const res = await api.post("/api/user/login", fromData);
//   return res.data;
// };

// export const createForm = async (data: CreateTemplateData) => {
//   return api.post<Template>("/api/template/create", data);
// };

export default api;
