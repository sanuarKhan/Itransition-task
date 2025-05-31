import React from "react";
import ToolBar from "./ToolBar";

export default function Table() {
  return (
    <div>
      <ToolBar />
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">select</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>

            <td>@twitter</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
