import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ToolBar from "./ToolBar";

interface User {
  id: string;
  name: string;
  email: string;
  last_login: string;
  status: "active" | "blocked";
}

export default function Table() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get<User[]>("api/v1/user/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(res);
      setUsers(res.data);
      console.log(res.token);
      if (res.success) {
        toast(res.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.success === false) {
        navigate("/login");
        toast.error(error.response?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectedAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedUsers(e.target.checked ? users.map((u) => u.id) : []);
  };
  const handleSelectUser = (userId: string) => {
    selectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className=" mt-4">
      <ToolBar
        selectedUsers={selectedUsers}
        onSuccess={() => {
          fetchUsers();
          setSelectedUsers([]);
        }}
      />
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>
                <div className="form-check">
                  <input
                    type="checkbok"
                    className="form-check-input"
                    checked={selectedUsers.length === users.length}
                    onChange={handleSelectedAll}
                  />
                </div>
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Last Login</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </div>
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.last_login}</td>
                <td>
                  <span
                    className={`badge bg-${
                      user.status === "active" ? "success" : "danger"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
