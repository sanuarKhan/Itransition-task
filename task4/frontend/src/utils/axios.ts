import axios from "axios";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL,
});

const getUsers = async () => {
  try {
    const res = await api.get("/api/v1/user/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.success === false) {
      toast.error(error.response?.data?.message);
    } else {
      toast.error("An error occurred while fetching users");
    }
  }
};

const register = async (name: string, email: string, password: string) => {
  try {
    const res = await api.post("/api/v1/user/register", {
      name,
      email,
      password,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.success === false) {
      toast.error(error.response?.data?.message);
    } else {
      toast.error("An error occurred during registration");
    }
  }
};
const login = async (email: string, password: string) => {
  try {
    const res = await api.post("/api/v1/user/login", {
      email,
      password,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.success === false) {
      toast.error(error.response?.data?.message);
    } else {
      toast.error("An error occurred during login");
    }
  }
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
