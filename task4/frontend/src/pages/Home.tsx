import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Table from "../components/Table";

export default function Home() {
  return (
    <div className="d-flex">
      <div className="col-lg-2 d-none d-lg-block">
        <Sidebar />
      </div>
      <div className="col-lg-10 col-12">
        <Header />
        <Table />
      </div>
    </div>
  );
}
