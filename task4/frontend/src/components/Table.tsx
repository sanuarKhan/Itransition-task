import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ToolBar from "./ToolBar";
import moment from "moment";
import { getUsers } from "../utils/axios";

interface User {
  id: string;
  name: string;
  email: string;
  last_login: string;
  status: "active" | "blocked";
}

export default function Table() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.data);

      if (res.success) {
        toast(res.message);
      }
    } catch (error) {
      console.error("Error in fetching users", error);
      navigate("/login");
      toast.error("Error in fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectedAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedUsers(e.target.checked ? users.map((u) => Number(u.id)) : []);
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <div className="mt-4 w-100 mx-auto ">
      <ToolBar
        selectedUsers={selectedUsers}
        onSuccess={() => {
          fetchUsers();
          setSelectedUsers([]);
        }}
      />
      <div className="table-responsive ">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={
                      selectedUsers.length === users.length && users.length > 0
                    }
                    onChange={handleSelectedAll}
                  />
                </div>
              </th>
              <th>Name</th>
              <th className="d-none d-md-block d-lg-block">Email</th>
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
                      checked={selectedUsers.includes(Number(user.id))}
                      onChange={() => handleSelectUser(Number(user.id))}
                    />
                  </div>
                </td>
                <td>{user.name}</td>
                <td className="d-none d-md-block d-lg-block">{user.email}</td>
                <td>{moment(user.last_login).fromNow()}</td>
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
