import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap-icons/font/bootstrap-icons.css";

interface ToolBarProps {
  selectedUsers: string[];
  onSuccess: () => void;
}

export default function ToolBar({ selectedUsers, onSuccess }: ToolBarProps) {
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();
  const handleAction = async (action: "block" | "unblock" | "delete") => {
    if (!selectedUsers.length) {
      toast.warning("Please select users first");
      return;
    }
    try {
      await axios.put(
        `/api/v1/user/${action}`,
        {
          userIds: selectedUsers,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(`Users ${action}ed successfully`);
      onSuccess();
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.success === false
      ) {
        navigate("/login");
      }
      toast.error(`Failed to ${action} users`);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-between bg-light p-2 border">
      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => handleAction("block")}
          disabled={!selectedUsers.length}
          title="Block selected users"
        >
          <i className="bi bi-lock-fill me-1"></i>
          Block
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={() => handleAction("unblock")}
          disabled={!selectedUsers.length}
          title="Unblock selected users"
        >
          <i className="bi bi-unlock-fill me-1"></i>
          Unblock
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => handleAction("delete")}
          disabled={!selectedUsers.length}
          title="Delete selected users"
        >
          <i className="bi bi-trash-fill me-1"></i>
          Delete
        </button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Filter"
          className="form-control"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value.toLowerCase());
          }}
        />
      </div>
    </div>
  );
}
