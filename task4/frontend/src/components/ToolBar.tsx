import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "bootstrap-icons/font/bootstrap-icons.css";
import { blockUser, deleteUser, unBlockUser } from "../utils/axios";

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
      if (res.success === false) {
        toast(res.message);
      }
      if (res.success) {
        toast(res.message);

        onSuccess();
      }
      if (res.redirectToLogin) {
        navigate("/login");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message);
    }
  };
  const handleUnblock = async () => {
    try {
      const res = await unBlockUser(selectedUsers);
      if (res.success) {
        toast(res.message);
        onSuccess();
      }
      if (res.redirectToLogin) {
        navigate("/login");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message);
    }
  };
  const handleBlock = async () => {
    try {
      const res = await blockUser(selectedUsers);
      if (res.success) {
        toast(res.message);

        onSuccess();
      }
      if (res.redirectToLogin) {
        navigate("/login");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-md-between bg-light p-2 border gap-2">
      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={handleBlock}
          disabled={!selectedUsers.length}
          title="Block selected users"
        >
          <i className="bi bi-lock-fill me-1"></i>
          Block
        </button>
        <button
          type="button"
          className="btn btn-success btn-sm"
          onClick={handleUnblock}
          disabled={!selectedUsers.length}
          title="Unblock selected users"
        >
          <i className="bi bi-unlock-fill me-1"></i>
          Unblock
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
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
          className="form-control form-control-sm"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value.toLowerCase());
          }}
        />
      </div>
    </div>
  );
}
