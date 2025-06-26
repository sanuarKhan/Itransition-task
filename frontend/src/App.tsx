// import React { useEffect} from "react";
// import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";

import Layout from "./components/Layout";

//pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

//template pages
import { TemplateCreatePage } from "./pages/templates/TemplateCreatePage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/templates/create" element={<TemplateCreatePage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
