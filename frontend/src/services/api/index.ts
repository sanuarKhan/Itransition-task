import axios from "axios";
import { registerSchema, loginSchema } from "../../schemas/user";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerApi = async (fromData: any) => {
  const { name, email, pass } = registerSchema.parse(fromData);
  const res = await api.post("/api/user/register", { name, email, pass });
  return res.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const loginApi = async (fromData: any) => {
  const { email, pass } = loginSchema.parse(fromData);
  const res = await api.post("/api/user/login", { email, pass });
  return res.data;
};
