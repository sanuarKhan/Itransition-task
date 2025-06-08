export interface Book {
  index: number;
  isbn: string;
  title: string;
  authors: string[];
  publisher: string;
  reviews?: {
    text: string;
    author: string;
    date: string;
  }[];
  likes?: number;
  publishDate?: string;
  genre?: string;
}

export interface FetchBooksParams {
  seed: number;
  page: number;
  likesAvg: number;
  reviewsAvg: number;
  langCode: string;
}
