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
import { Search, User, Settings, LogOut, Moon, Sun, Globe } from "lucide-react";
import { useAuthStore, useUIStore } from "../../store/index";
import { SearchBar } from "../UI/SearchBar";
import { Language, Theme } from "../../types/index";

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
      bg={theme === "DARK" ? "dark" : "light"}
      variant={theme === "DARK" ? "dark" : "light"}
      sticky="top"
    >
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="fw-bold">
          FormCraft
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active={isActive("/")}>
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
                  as={Link}
                  to="/templates"
                  active={isActive("/templates")}
                >
                  {t("nav.templates")}
                </Nav.Link>
                <Nav.Link as={Link} to="/forms" active={isActive("/forms")}>
                  {t("nav.forms")}
                </Nav.Link>
                {user.role === "ADMIN" && (
                  <Nav.Link as={Link} to="/admin" active={isActive("/admin")}>
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
              className="me-2"
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
                id="user-dropdown"
              >
                <NavDropdown.Item as={Link} to="/profile">
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
        <Container className="py-2 border-top">
          <SearchBar onSearch={() => setShowSearch(false)} />
        </Container>
      )}
    </BSNavbar>
  );
};
