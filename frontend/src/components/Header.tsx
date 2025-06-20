import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import useAuthStore from "../hooks/useAuthStore";
import { NavDropdown } from "react-bootstrap";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  console.log(user, "from header");
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container className="">
        <div className="d-flex justify-content-between w-100">
          <Navbar.Brand href="#home">Doogle Torm</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {isAuthenticated ? (
                <>
                  <Nav.Link onClick={logout} href="/">
                    <i className="bi bi-box-arrow-right"></i>
                    Logout
                  </Nav.Link>
                  <Nav.Link href="/profile">
                    {user?.name}
                    <img
                      src={user?.img}
                      className="rounded-circle"
                      width="30"
                      height="30"
                    />
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link href="/login">Login</Nav.Link>
              )}
              <Nav.Link>
                <i className="bi bi-brightness-high-fill"></i>
              </Nav.Link>
              <NavDropdown
                title="EN"
                id="basic-nav-dropdown"
                align="end"
                className=""
              >
                <NavDropdown.Item
                  href="#action/3.1"
                  className="overflow-hidden"
                >
                  EN
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">RU</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">BN</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Container>
    </Navbar>
  );
}
