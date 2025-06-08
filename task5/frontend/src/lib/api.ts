import axios from "axios";
import type { Book } from "./types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const fetchBooks = async (
  seed: number,
  page: number,
  langCode: string,
  likesAvg: number,
  reviewsAvg: number
) => {
  const res = await api.get<{ data: Book[] }>("/", {
    params: { seed, page, langCode, likesAvg, reviewsAvg },
  });
  return res.data.data;
};
