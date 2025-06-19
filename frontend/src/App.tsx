import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
// import Login from "./pages/Login";
import Register from "./pages/Register";

import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>{" "}
    </>
  );
}

export default App;
