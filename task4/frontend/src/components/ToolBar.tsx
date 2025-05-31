import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function ToolBar() {
  const [filter, setFilter] = useState("");

  return (
    <div className="d-flex align-items-center justify-content-between  bg-light p-2 border ">
      <div className="d-flex gap-2">
        <button type="button" className="btn btn-danger">
          Block
        </button>
        <button type="button" className="btn btn-warning">
          <i className="bi bi-unlock-fill"></i>
        </button>
        <button type="button" className="btn btn-danger">
          <i className="bi bi-trash-fill"></i>
        </button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Filter"
          className="form-control"
          onChange={(e) => {
            setFilter(e.target.value.toLowerCase());
          }}
        />
      </div>
    </div>
  );
}
