import { Link } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { icon: "🏠", label: "Home", active: true },
    { icon: "📊", label: "Dashboard", active: false },
    { icon: "📋", label: "Orders", active: false },
    { icon: "📦", label: "Products", active: false },
    { icon: "👥", label: "Customers", active: false },
  ];

  return (
    <div className="d-flex vh-100">
      <div
        className="bg-dark text-white"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        {/* Header */}
        <div className="p-3 border-bottom border-secondary">
          <div className="d-flex align-items-center">
            <div
              className="bg-white text-dark rounded d-flex align-items-center justify-content-center me-2"
              style={{
                width: "32px",
                height: "32px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              TA
            </div>
            <span className="fs-5 fw-medium">THE APP</span>
          </div>
        </div>

        <nav className="mt-3">
          <ul className="list-unstyled">
            {menuItems.map((item, index) => (
              <li key={index} className="mb-1">
                <Link
                  to={item.active ? "/" : ""}
                  className={`d-flex align-items-center px-3 py-2 text-decoration-none text-white position-relative ${
                    item.active ? "bg-primary" : ""
                  }`}
                  style={{
                    borderRadius: item.active ? "0" : "0",
                    backgroundColor: item.active ? "#0d6efd" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!item.active) {
                      (e.target as HTMLAnchorElement).style.backgroundColor =
                        "rgba(255,255,255,0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!item.active) {
                      (e.target as HTMLAnchorElement).style.backgroundColor =
                        "transparent";
                    }
                  }}
                >
                  <span className="me-3" style={{ fontSize: "16px" }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="position-absolute bottom-0  p-3">
          <div className="d-flex align-items-center">
            <span className="bg-wearning  rounded me-2 fs-2">👤</span>
            <div className="d-flex align-items-center">
              <span className="fs-3 fw-medium me-2 text-white">user</span>
              <span className="text-white fs-6">▼</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
