import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
