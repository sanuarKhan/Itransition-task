import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Table from "../components/Table";

export default function Home() {
  return (
    <div className="d-flex">
      <div className="col-2">
        <Sidebar />
      </div>
      <div className="col-10">
        <Header />
        <Table />
      </div>
    </div>
  );
}
