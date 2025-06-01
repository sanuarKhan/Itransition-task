import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "bootstrap-icons/font/bootstrap-icons.css";
import { deleteUser } from "../utils/axios";

interface ToolBarProps {
  selectedUsers: number[];
  onSuccess: () => void;
}

export default function ToolBar({ selectedUsers, onSuccess }: ToolBarProps) {
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      const res = await deleteUser(selectedUsers);
      if (res.success) {
        toast(res.message);

        onSuccess();
      }
      if (res.redirectToLogin) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete users");
    }
  };
  const handleUnblock = async () => {
    console.log("unblock");
  };
  const handleBlock = async () => {
    console.log("block");
  };

  return (
    <div className="d-flex align-items-center justify-content-between bg-light p-2 border">
      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleBlock}
          disabled={!selectedUsers.length}
          title="Block selected users"
        >
          <i className="bi bi-lock-fill me-1"></i>
          Block
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={handleUnblock}
          disabled={!selectedUsers.length}
          title="Unblock selected users"
        >
          <i className="bi bi-unlock-fill me-1"></i>
          Unblock
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDelete}
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
