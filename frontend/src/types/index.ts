export type Role = "ADMIN" | "USER";
export type Language = "EN" | "RU" | "BN";
export type Theme = "LIGHT" | "DARK";
export type Topic =
  | "EDUCATION"
  | "BUDGETS"
  | "QUIZZ"
  | "REPORTS"
  | "RESEARCH"
  | "SURVEY"
  | "PULL"
  | "OTHERS";
export type QuestionType =
  | "SINGLE_LINE"
  | "MULTI_LINE"
  | "INTEGER"
  | "CHECKBOX";

export interface User {
  id: string;
  email: string;
  pass: string;
  name: string;
  isBlocked: boolean;
  img?: string;
  role: Role;
  lang: Language;
  theme: Theme;
  _count?: {
    templates: number;
    forms: number;
    comments: number;
    likes: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  _count?: {
    templates: number;
  };
  weight?: number;
}

export interface Question {
  id: string;
  templateId: string;
  title: string;
  description?: string;
  type: QuestionType;
  isRequired: boolean;
  showInTable: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface template {
  id: string;
  title: string;
  description: string;
  topic: Topic;
  thumbnail?: string;
  isPublic: boolean;
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
  _count?: {
    forms: number;
    comments: number;
    likes: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
