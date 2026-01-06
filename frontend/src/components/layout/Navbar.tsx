import React, { useState } from "react";
import {
  Navbar as BSNavbar,
  Nav,
  NavDropdown,
  Container,
  Button,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Search,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Globe,
  DoorClosed,
  X,
} from "lucide-react";
import { useAuthStore, useUIStore } from "../../store/index";
import { SearchBar } from "../ui/SearchBar";
import type { Language, Theme } from "../../types/index";
// path issue fixing
export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, language, setTheme, setLanguage } = useUIStore();
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleThemeToggle = () => {
    const newTheme: Theme = theme === "LIGHT" ? "DARK" : "LIGHT";
    setTheme(newTheme);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage.toLowerCase());
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <BSNavbar
      expand="lg"
      className="navbar-modern d-flex flex-column"
      style={{
        background:
          theme === "DARK"
            ? "rgba(15, 23, 42, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      }}
      sticky="top"
    >
      <Container>
        {/* eslint-disable-next-line */}
        <BSNavbar.Brand as={Link as any} to="/" className="fw-bold">
          Doogle Torm{" "}
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* eslint-disable-next-line */}
            <Nav.Link as={Link as any} to="/" active={isActive("/")}>
              {t("nav.home")}
            </Nav.Link>

            {user && (
              <>
                <Nav.Link
                  as={Link}
                  to="/dashboard"
                  active={isActive("/dashboard")}
                >
                  {t("nav.dashboard")}
                </Nav.Link>
                <Nav.Link
                  // eslint-disable-next-line
                  as={Link as any}
                  to="/templates"
                  active={isActive("/templates")}
                >
                  {t("nav.templates")}
                </Nav.Link>
                <Nav.Link
                  // eslint-disable-next-line
                  as={Link as any}
                  to="/forms"
                  active={isActive("/forms")}
                >
                  {t("nav.forms")}
                </Nav.Link>
                {user.role === "ADMIN" && (
                  <Nav.Link
                    as={Link}
                    to="/admin"
                    className="me-2"
                    active={isActive("/admin")}
                  >
                    {t("nav.admin")}
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>

          <Nav className="d-flex align-items-center">
            {/* Search */}
            <Button
              variant="outline-secondary"
              size="sm"
              className="me-2"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search size={16} />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="outline-secondary"
              size="sm"
              className="me-2"
              onClick={handleThemeToggle}
            >
              {theme === "LIGHT" ? <Moon size={16} /> : <Sun size={16} />}
            </Button>

            {/* Language Selector */}
            <NavDropdown
              title={<Globe size={16} />}
              id="language-dropdown"
              className="me-2 no-caret-dropdown"
            >
              <NavDropdown.Item
                onClick={() => handleLanguageChange("EN")}
                active={language === "EN"}
              >
                {t("languages.EN")}
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => handleLanguageChange("RU")}
                active={language === "RU"}
              >
                {t("languages.RU")}
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => handleLanguageChange("BN")}
                active={language === "BN"}
              >
                {t("languages.BN")}
              </NavDropdown.Item>
            </NavDropdown>

            {/* User Menu */}
            {user ? (
              <NavDropdown
                title={
                  <div className="d-flex align-items-center">
                    <User size={16} className="me-1" />
                    {user.name}
                  </div>
                }
                className="no-caret-dropdown"
                id="user-dropdown"
              >
                {/* eslint-disable-next-line */}
                <NavDropdown.Item as={Link as any} to="/profile">
                  <Settings size={16} className="me-2" />
                  {t("nav.profile")}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <LogOut size={16} className="me-2" />
                  {t("nav.logout")}
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  {t("nav.login")}
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  {t("nav.register")}
                </Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>

      {/* Search Bar */}
      {showSearch && (
        <Container className="py-2 border-top w-100 ">
          <SearchBar onSearch={() => setShowSearch(false)} />
          <X
            className="mx-5 bg-danger-subtle text-black text-2xl cursor-pointer"
            onClick={() => setShowSearch(false)}
          />
        </Container>
      )}
    </BSNavbar>
  );
};
