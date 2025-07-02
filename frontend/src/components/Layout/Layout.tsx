import React from "react";
import { Container } from "react-bootstrap";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  fluid?: boolean;
}
// path issue fixing
export const Layout: React.FC<LayoutProps> = ({
  children,
  showNavbar = true,
  showFooter = true,
  fluid = false,
}) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {showNavbar && <Navbar />}
      <main className="flex-grow-1">
        {fluid ? (
          <Container fluid className="py-3">
            {children}
          </Container>
        ) : (
          <Container className="py-3">{children}</Container>
        )}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};
