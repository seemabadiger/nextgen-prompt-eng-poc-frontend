/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import HeaderBackground from "../assets/header-bg.png";
import { AuthContext } from "../Context/AuthContext";
import Logo from "../assets/logo.svg";
import HarbingerLogo from "../assets/harbinger_logo.svg";
import UploadLogo from "../assets/upload_logo.svg";
import Avatar from "../assets/avatar.png";
import { Navigate } from "react-router-dom";
import ProcessDiagram from "../pages/ProcessDiagram";
import DomainLayout from './DomainLayout'

const NavbarComponent = ({
  mockups,
  showModal,
  selectedTabValue,
  selectedTab,
  handleSortSelect,
  handleTabSelection,
  handleSearchSubmit
}) => {
  const { user, logout } = useContext(AuthContext);
  const handleTabClick = (tab) => {
    handleTabSelection(tab);
  };

  const handleLogout = async () => {
    await logout();
    <Navigate to="/" />;
  };

  const handleUploadClick = () => {
    showModal(!0);
    selectedTabValue(selectedTab);
  };

  return (
    <Navbar
      expand="lg"
      style={{
        backgroundImage: `url(${HeaderBackground})`,
        padding: "9px 0 0 0",
        flexDirection: "column",
        height: "254px",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Navbar.Brand
          className="pt-3 pb-0"
          href="#home"
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            src={Logo}
            width="136"
            height="89"
            className="d-inline-block align-top navbar-logo"
            alt="Logo"
          />
          <div className="logo-divider"></div>
          <span
            style={{ color: "#fff", fontSize: "12px", marginBottom: "35px" }}
          >
            By
          </span>
          <img
            src={HarbingerLogo}
            width="148"
            height="48"
            className="d-inline-block align-top"
            alt="Harbinger Logo"
          />
        </Navbar.Brand>
        <div style={{ display: "flex", gap: "10px" }}>
          {user?.role?.toLowerCase() === "admin" && (
            <button
              onClick={() => handleUploadClick()}
              style={{
                ...buttonStyle,
                background: "transparent",
                color: "#fff",
                border: "none",
                borderRight: "1px solid #fff",
                textDecoration: "underline",
                borderRadius: "0",
                fontWeight: "bold",
                padding: "0px 20px 5px 10px",
              }}
            >
              <img
                style={{
                  marginRight: "5px",
                }}
                src={UploadLogo}
                width="20"
                height="20"
                className="d-inline-block "
                alt="Upload Logo"
              />{" "}
              Upload
            </button>
          )}
          <NavDropdown
            title={
              <span>
                {user?.name}{" "}
                <img
                  src={Avatar}
                  alt="Avatar"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    marginLeft: "10px",
                  }}
                />
              </span>
            }
            id="user-menu-dropdown"
            style={{
              ...buttonStyle,
              background: "transparent",
              color: "#fff",
              border: "none",
            }}
          >
            <NavDropdown.Item href="#logout" onClick={handleLogout}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </div>
      </div>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse
        className="w-100"
        id="basic-navbar-nav"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          transform: "translateY(50px)",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <Nav
              variant="pills"
              className="ml-auto main-nav-tab"
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <Nav.Item>
                <Nav.Link
                  style={{
                    ...tabStyle,
                    color: selectedTab === "Visual Samples" ? "#000" : "#fff",
                    background:
                      selectedTab === "Visual Samples" ? "#fff" : "transparent",
                    fontWeight:
                      selectedTab === "Visual Samples" ? 500 : "normal",
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                    borderBottomLeftRadius: "0px",
                    borderBottomRightRadius: "0px",
                  }}
                  onClick={() => handleTabClick("Visual Samples")}
                >
                  <span
                    style={{
                      padding: "0 0 6px 0",
                      height: "100%",
                      display: "inline-block",
                      borderBottomLeftRadius: "0px",
                      borderBottomRightRadius: "0px",
                    }}
                  >
                    Visual Samples
                  </span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  style={{
                    ...tabStyle,
                    color: selectedTab === "Case Studies" ? "#000" : "#fff",
                    background:
                      selectedTab === "Case Studies" ? "#fff" : "transparent",
                    fontWeight: selectedTab === "Case Studies" ? 500 : "normal",
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                    borderBottomLeftRadius: "0px",
                    borderBottomRightRadius: "0px",
                  }}
                  onClick={() => handleTabClick("Case Studies")}
                >
                  <span
                    style={{
                      padding: "0 0 6px 0",
                      height: "100%",
                      display: "inline-block",
                    }}
                  >
                    Case Studies
                  </span>
                </Nav.Link>
              </Nav.Item>

              <Nav.Link
                style={{
                  ...tabStyle,
                  color: selectedTab === "Process Diagram & Artifacts" ? "#000" : "#fff",
                  background:
                    selectedTab === "Process Diagram & Artifacts" ? "#fff" : "transparent",
                  fontWeight:
                    selectedTab === "Process Diagram & Artifacts" ? 500 : "normal",
                  borderTopLeftRadius: "5px",
                  borderTopRightRadius: "5px",
                  borderBottomLeftRadius: "0px",
                  borderBottomRightRadius: "0px",
                }}
                onClick={() => handleTabClick("Process Diagram & Artifacts")}
              >
                <span
                  style={{
                    padding: "0 0 5px 0",
                    height: "100%",
                    display: "inline-block",
                  }}
                >
                  Process Diagram & Artifacts
                </span>
              </Nav.Link>
              <Nav.Item>
                <Nav.Link
                  style={{
                    ...tabStyle,
                    color: selectedTab === "Before After" ? "#000" : "#fff",
                    background:
                      selectedTab === "Before After" ? "#fff" : "transparent",
                    fontWeight: selectedTab === "Before After" ? 500 : "normal",
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                    borderBottomLeftRadius: "0px",
                    borderBottomRightRadius: "0px",
                  }}
                  onClick={() => handleTabClick("Before After")}
                >
                  <span
                    style={{
                      padding: "0 0 6px 0",
                      height: "100%",
                      display: "inline-block",
                    }}
                  >
                    Before After
                  </span>
                </Nav.Link>
              </Nav.Item>
            </Nav>
            {['Visual Samples', 'Case Studies', 'Before After'].includes(selectedTab) && (
              <DomainLayout
                tabName={selectedTab}
                mockupList={mockups.filter(mock => mock?.mockupType?.name === selectedTab)}
                handleSortSelect={handleSortSelect}
                handleSearchSubmit={handleSearchSubmit}
              />
            )}
            {selectedTab === 'Process Diagram & Artifacts' && (
              <ProcessDiagram />
            )}
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

const tabStyle = {
  background: "transparent",
  border: "none",
  padding: "4px 15px 0px 15px 15px",
  color: "#000",
  textDecoration: "none",
  cursor: "pointer",
};

const buttonStyle = {
  background: "#007bff",
  border: "none",
  color: "#fff",
  padding: "5px 10px",
  cursor: "pointer",
  borderRadius: "5px",
};

export default NavbarComponent;
