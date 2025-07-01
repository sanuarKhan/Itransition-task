export type Role = "USER" | "ADMIN";
export type Language = "EN" | "RU" | "BN";
export type Theme = "LIGHT" | "DARK";
export type Topic =
  | "EDUCATION"
  | "BUSINESS"
  | "QUIZ"
  | "SURVEY"
  | "RESEARCH"
  | "POLL"
  | "OTHER";
export type QuestionType =
  | "SINGLE_LINE"
  | "MULTI_LINE"
  | "INTEGER"
  | "CHECKBOX";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isBlocked: boolean;
  language: Language;
  theme: Theme;
  avatar?: string;
  createdAt: string;
  _count?: {
    templates: number;
    forms: number;
    comments: number;
    likes: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  _count?: {
    templates: number;
  };
  weight?: number; // For tag cloud
}

export interface Question {
  id: string;
  templateId: string;
  title: string;
  description?: string;
  type: QuestionType;
  order: number;
  showInTable: boolean;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  topic: Topic;
  thumbnail?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner: {
    id: string;
    name: string;
    img?: string;
  };
  questions?: Question[];
  tags: {
    tag: Tag;
  }[];
  allowedUsers?: {
    user: {
      id: string;
      name: string;
      email: string;
    };
  }[];
  _count: {
    forms: number;
    likes: number;
    comments: number;
  };
}

export interface Answer {
  id: string;
  questionId: string;
  formId: string;
  valueText?: string;
  valueInt?: number;
  valueBool?: boolean;
  question: Question;
  createdAt: string;
  updatedAt: string;
}

export interface Form {
  id: string;
  templateId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  template: {
    id: string;
    title: string;
    description: string;
    topic: Topic;
    owner: {
      id: string;
      name: string;
    };
    questions?: Question[];
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  answers: Answer[];
}

export interface Comment {
  id: string;
  templateId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface Like {
  id: string;
  templateId: string;
  userId: string;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface SearchResponse {
  templates: Template[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  query: string;
}

// Form types
export interface CreateTemplateData {
  title: string;
  description: string;
  topic: Topic;
  image?: string;
  tags: string[];
  questions: CreateQuestionData[]; // ✅ ADDED - Missing questions field
  isPublic: boolean;
  allowedUserIds: string[];
}

export interface UpdateTemplateData extends Partial<CreateTemplateData> {}

export interface CreateQuestionData {
  title: string;
  description?: string;
  type: QuestionType;
  showInTable: boolean;
  isRequired: boolean;
}

export interface SubmitFormData {
  answers: {
    questionId: string;
    valueText?: string;
    valueInt?: number;
    valueBool?: boolean;
  }[];
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  language?: Language;
  theme?: Theme;
}

// Analytics types
export interface QuestionAnalytics {
  questionId: string;
  questionTitle: string;
  questionType: QuestionType;
  stats: {
    // For INTEGER questions
    average?: number;
    min?: number;
    max?: number;
    count?: number;
    // For CHECKBOX questions
    trueCount?: number;
    falseCount?: number;
    total?: number;
    // For text questions
    frequency?: Record<string, number>;
  };
}

export interface TemplateAnalytics {
  analytics: QuestionAnalytics[];
}

// Dashboard types
export interface DashboardStats {
  stats: {
    templatesCount: number;
    formsCount: number;
    commentsCount: number;
    likesCount: number;
  };
  recentTemplates: Template[];
  recentForms: Form[];
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  adminUsers: number;
  recentUsers: User[];
  usersByMonth: {
    month: string;
    count: number;
  }[];
}

// UI Component types
export interface DropdownOption {
  value: string;
  label: string;
}

export interface TagCloudTag extends Tag {
  weight: number;
}

// Error types
export interface ApiError {
  error: string;
  message?: string;
  status?: number;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}

// Utility types
export type RequestStatus = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  status: RequestStatus;
  error: string | null;
}

// Route params
export interface TemplateParams {
  id: string;
}

export interface FormParams {
  id: string;
}

export interface UserParams {
  id: string;
}
