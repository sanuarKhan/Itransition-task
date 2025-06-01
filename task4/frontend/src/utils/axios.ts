import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const api = axios.create({
  baseURL,
});
const getUsers = async () => {
  const res = await api.get("/api/v1/user/all", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
};
const register = async (name: string, email: string, password: string) => {
  const res = await api.post("/api/v1/user/register", {
    name,
    email,
    password,
  });
  return res.data;
};
const login = async (email: string, password: string) => {
  const res = await api.post("/api/v1/user/login", {
    email,
    password,
  });
  return res.data;
};
const blockUser = async (userIds: number[]) => {
  const res = await api.put(
    "/api/v1/user/block",
    { userIds },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return res.data;
};
const unBlockUser = async (userIds: number[]) => {
  const res = await api.put(
    "/api/v1/user/unblock",
    { userIds },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return res.data;
};

const deleteUser = async (userIds: number[]) => {
  const res = await api.delete("/api/v1/user/delete", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data: { userIds },
  });
  return res.data;
};

export { getUsers, register, login, deleteUser, blockUser, unBlockUser };
